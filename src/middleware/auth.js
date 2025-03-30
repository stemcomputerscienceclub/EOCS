const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Competition = require('../models/Competition');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user to request object
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    } catch (err) {
        next(err);
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'User role not authorized to access this route'
            });
        }
        next();
    };
};

exports.isTeamLeader = async (req, res, next) => {
    try {
        if (!req.user.isTeamLeader) {
            return res.status(403).json({
                success: false,
                error: 'Only team leaders can perform this action'
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

exports.isVerified = async (req, res, next) => {
    try {
        if (!req.user.verified) {
            return res.status(403).json({
                success: false,
                error: 'Please verify your email address to access this feature'
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

exports.checkTeamSize = async (req, res, next) => {
    try {
        const team = await req.user.populate('team').execPopulate();
        if (team && team.members.length >= 4) {
            return res.status(400).json({
                success: false,
                error: 'Team has reached maximum size of 4 members'
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

exports.checkCompetitionPhase = (requiredPhase) => {
    return async (req, res, next) => {
        try {
            const competition = await Competition.findOne().sort({ year: -1 });
            
            if (!competition) {
                return res.status(404).json({
                    success: false,
                    error: 'No active competition found'
                });
            }

            if (competition.status !== requiredPhase) {
                return res.status(403).json({
                    success: false,
                    error: `This action is only allowed during the ${requiredPhase} phase`
                });
            }
            
            req.competition = competition;
            next();
        } catch (err) {
            next(err);
        }
    };
};