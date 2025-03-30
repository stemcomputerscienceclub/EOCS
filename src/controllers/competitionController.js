const Competition = require('../models/Competition');
const Team = require('../models/Team');

// Create Competition
exports.createCompetition = async (req, res) => {
    try {
        const {
            year,
            theme,
            registrationStart,
            registrationEnd,
            rounds
        } = req.body;

        const competition = await Competition.create({
            year,
            theme,
            registrationStart,
            registrationEnd,
            rounds
        });

        res.status(201).json({
            success: true,
            competition
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Current Competition
exports.getCurrentCompetition = async (req, res) => {
    try {
        const competition = await Competition.findOne().sort({ year: -1 });

        if (!competition) {
            return res.status(404).json({
                success: false,
                error: 'No active competition found'
            });
        }

        res.json({
            success: true,
            competition
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Competition Round Questions
exports.getRoundQuestions = async (req, res) => {
    try {
        const { roundNumber } = req.params;
        const competition = await Competition.findOne().sort({ year: -1 });

        if (!competition) {
            return res.status(404).json({
                success: false,
                error: 'No active competition found'
            });
        }

        const round = competition.rounds.find(r => r.number === parseInt(roundNumber));
        if (!round) {
            return res.status(404).json({
                success: false,
                error: 'Round not found'
            });
        }

        // Filter questions based on user category
        const questions = round.questions.filter(q => 
            q.category === req.user.category
        );

        res.json({
            success: true,
            questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Submit Round Solution
exports.submitSolution = async (req, res) => {
    try {
        const { roundNumber } = req.params;
        const { files } = req.body;

        // Verify team exists
        const team = await Team.findById(req.user.team);
        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Add submission
        team.submissions.push({
            round: roundNumber,
            files,
            submittedAt: Date.now()
        });

        await team.save();

        res.json({
            success: true,
            message: 'Solution submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Grade Submission (Admin Only)
exports.gradeSubmission = async (req, res) => {
    try {
        const { teamId, roundNumber, score, feedback } = req.body;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Find and update submission
        const submission = team.submissions.find(s => 
            s.round === parseInt(roundNumber) && s.status === 'pending'
        );

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: 'Submission not found'
            });
        }

        submission.score = score;
        submission.feedback = feedback;
        submission.status = 'graded';

        // Update team round scores
        if (roundNumber === 1) {
            team.competition.scores.qualification = score;
        } else if (roundNumber === 2) {
            team.competition.scores.round2 = score;
        } else if (roundNumber === 3) {
            team.competition.scores.finals = score;
        }

        await team.save();

        res.json({
            success: true,
            message: 'Submission graded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Competition Statistics
exports.getStatistics = async (req, res) => {
    try {
        const competition = await Competition.findOne().sort({ year: -1 });
        if (!competition) {
            return res.status(404).json({
                success: false,
                error: 'No active competition found'
            });
        }

        // Get additional statistics
        const teamsCount = await Team.countDocuments();
        const qualifiedTeams = await Team.countDocuments({
            'competition.qualificationStatus': 'qualified'
        });
        const finalistsCount = await Team.countDocuments({
            'competition.finalsStatus': 'qualified'
        });

        // Update competition statistics
        competition.statistics = {
            ...competition.statistics,
            totalParticipants: teamsCount * 4, // approximate
            qualifiedTeams,
            finalistsCount
        };

        await competition.save();

        res.json({
            success: true,
            statistics: competition.statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Competition Leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const { roundNumber } = req.params;
        
        let scoreField;
        if (roundNumber === '1') {
            scoreField = 'competition.scores.qualification';
        } else if (roundNumber === '2') {
            scoreField = 'competition.scores.round2';
        } else if (roundNumber === '3') {
            scoreField = 'competition.scores.finals.total';
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid round number'
            });
        }

        const teams = await Team.find()
            .sort({ [scoreField]: -1 })
            .limit(50)
            .populate('members', 'name');

        res.json({
            success: true,
            leaderboard: teams.map(team => ({
                teamName: team.name,
                members: team.members.map(m => m.name),
                score: team.competition.scores[roundNumber === '3' ? 'finals.total' : roundNumber === '2' ? 'round2' : 'qualification']
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};