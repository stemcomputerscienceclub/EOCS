const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    verifyEmail, 
    forgotPassword, 
    resetPassword,
    getCurrentUser,
    updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect); // All routes below this will require authentication
router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);

module.exports = router;