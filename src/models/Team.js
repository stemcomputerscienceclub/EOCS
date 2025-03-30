const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name is required'],
        unique: true,
        trim: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        required: true,
        enum: ['high_school', 'university'],
        default: 'high_school'
    },
    competition: {
        currentRound: {
            type: Number,
            default: 0
        },
        qualificationStatus: {
            type: String,
            enum: ['pending', 'qualified', 'not_qualified'],
            default: 'pending'
        },
        round2Status: {
            type: String,
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started'
        },
        finalsStatus: {
            type: String,
            enum: ['not_qualified', 'qualified', 'completed'],
            default: 'not_qualified'
        },
        scores: {
            qualification: {
                type: Number,
                default: 0
            },
            round2: {
                type: Number,
                default: 0
            },
            finals: {
                innovation: {
                    type: Number,
                    default: 0
                },
                scientificAccuracy: {
                    type: Number,
                    default: 0
                },
                algorithmEfficiency: {
                    type: Number,
                    default: 0
                },
                presentation: {
                    type: Number,
                    default: 0
                },
                total: {
                    type: Number,
                    default: 0
                }
            }
        }
    },
    submissions: [{
        round: {
            type: Number,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        files: [{
            filename: String,
            path: String,
            type: String
        }],
        score: Number,
        feedback: String,
        status: {
            type: String,
            enum: ['pending', 'graded'],
            default: 'pending'
        }
    }],
    invitationCode: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Middleware to ensure team has no more than 4 members
teamSchema.pre('save', function(next) {
    if (this.members.length > 4) {
        next(new Error('Team cannot have more than 4 members'));
    }
    next();
});

// Method to check if team is full
teamSchema.methods.isFull = function() {
    return this.members.length >= 4;
};

// Method to calculate finals score
teamSchema.methods.calculateFinalsScore = function() {
    const scores = this.competition.scores.finals;
    scores.total = (
        scores.innovation +
        scores.scientificAccuracy +
        scores.algorithmEfficiency +
        scores.presentation
    ) / 4;
    return scores.total;
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;