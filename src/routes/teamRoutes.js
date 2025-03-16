const express = require('express');
const router = express.Router();
const {
    createTeam,
    joinTeam,
    leaveTeam,
    getTeamDetails,
    updateTeam,
    getTeamSubmissions
} = require('../controllers/teamController');
const { 
    protect, 
    isVerified, 
    checkTeamSize,
    isTeamLeader 
} = require('../middleware/auth');

// All routes require authentication
router.use(protect);
router.use(isVerified);

// Team management routes
router.post('/create', checkTeamSize, createTeam);
router.post('/join', checkTeamSize, joinTeam);
router.post('/leave', leaveTeam);
router.get('/details', getTeamDetails);
router.put('/update', isTeamLeader, updateTeam);
router.get('/submissions', getTeamSubmissions);

module.exports = router;