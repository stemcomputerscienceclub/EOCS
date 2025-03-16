const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['mcq', 'coding', 'theoretical', 'simulation']
    },
    round: {
        type: Number,
        required: true,
        enum: [1, 2, 3] // 1: Qualification, 2: National, 3: Finals
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['high_school', 'university']
    },
    content: {
        question: String,
        codeTemplate: String, // For coding questions
        testCases: [{
            input: String,
            output: String,
            isHidden: {
                type: Boolean,
                default: false
            }
        }],
        options: [{ // For MCQ
            text: String,
            isCorrect: Boolean
        }],
        hints: [String],
        solutionApproach: String, // Available after submission
        timeLimit: Number, // In seconds, for coding questions
        memoryLimit: Number // In MB, for coding questions
    },
    tags: [String], // e.g., ['physics', 'algorithms', 'chemistry']
    resources: [{
        type: String, // 'image', 'pdf', 'dataset'
        url: String,
        description: String
    }]
});

const roundSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    questions: [questionSchema],
    rules: [{
        title: String,
        description: String
    }],
    scoringCriteria: {
        type: Map,
        of: String
    }
});

const competitionSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    theme: {
        type: String,
        required: true
    },
    registrationStart: {
        type: Date,
        required: true
    },
    registrationEnd: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'registration', 'in_progress', 'completed'],
        default: 'upcoming'
    },
    rounds: [roundSchema],
    statistics: {
        totalParticipants: {
            type: Number,
            default: 0
        },
        highSchoolParticipants: {
            type: Number,
            default: 0
        },
        universityParticipants: {
            type: Number,
            default: 0
        },
        qualifiedTeams: {
            type: Number,
            default: 0
        },
        finalistsCount: {
            type: Number,
            default: 0
        }
    },
    prizes: [{
        rank: Number,
        description: String,
        value: String
    }]
}, {
    timestamps: true
});

// Middleware to update competition status based on dates
competitionSchema.pre('save', function(next) {
    const now = new Date();
    if (now < this.registrationStart) {
        this.status = 'upcoming';
    } else if (now >= this.registrationStart && now <= this.registrationEnd) {
        this.status = 'registration';
    } else if (this.rounds.some(round => 
        now >= round.startDate && now <= round.endDate)) {
        this.status = 'in_progress';
    } else if (now > this.rounds[this.rounds.length - 1].endDate) {
        this.status = 'completed';
    }
    next();
});

// Method to get current round
competitionSchema.methods.getCurrentRound = function() {
    const now = new Date();
    return this.rounds.find(round => 
        now >= round.startDate && now <= round.endDate
    );
};

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;