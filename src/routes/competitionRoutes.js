const express = require('express');
const router = express.Router();
const {
    createCompetition,
    getCurrentCompetition,
    getRoundQuestions,
    submitSolution,
    gradeSubmission,
    getStatistics,
    getLeaderboard
} = require('../controllers/competitionController');
const {
    protect,
    authorize,
    isVerified,
    checkCompetitionPhase
} = require('../middleware/auth');

// Public routes
router.get('/current', getCurrentCompetition);
router.get('/statistics', getStatistics);
router.get('/leaderboard/:roundNumber', getLeaderboard);

// Protected routes
router.use(protect);
router.use(isVerified);

// Competition participation routes
router.get('/rounds/:roundNumber/questions', getRoundQuestions);
router.post(
    '/rounds/:roundNumber/submit',
    checkCompetitionPhase('in_progress'),
    submitSolution
);

// Admin only routes
router.use(authorize('admin'));
router.post('/create', createCompetition);
router.post('/grade', gradeSubmission);

module.exports = router;