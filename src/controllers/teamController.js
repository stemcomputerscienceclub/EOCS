const Team = require('../models/Team');
const User = require('../models/User');
const crypto = require('crypto');

// Create Team
exports.createTeam = async (req, res) => {
    try {
        const { name, category } = req.body;

        // Check if user already has a team
        if (req.user.team) {
            return res.status(400).json({
                success: false,
                error: 'You are already part of a team'
            });
        }

        // Generate unique invitation code
        const invitationCode = crypto.randomBytes(6).toString('hex');

        // Create team
        const team = await Team.create({
            name,
            category,
            leader: req.user._id,
            members: [req.user._id],
            invitationCode
        });

        // Update user
        req.user.team = team._id;
        req.user.isTeamLeader = true;
        await req.user.save();

        res.status(201).json({
            success: true,
            team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Join Team
exports.joinTeam = async (req, res) => {
    try {
        const { invitationCode } = req.body;

        // Check if user already has a team
        if (req.user.team) {
            return res.status(400).json({
                success: false,
                error: 'You are already part of a team'
            });
        }

        // Find team by invitation code
        const team = await Team.findOne({ invitationCode });
        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Invalid invitation code'
            });
        }

        // Check if team is full
        if (team.members.length >= 4) {
            return res.status(400).json({
                success: false,
                error: 'Team is full'
            });
        }

        // Check category match
        if (team.category !== req.user.category) {
            return res.status(400).json({
                success: false,
                error: 'Team category does not match your category'
            });
        }

        // Add user to team
        team.members.push(req.user._id);
        await team.save();

        // Update user
        req.user.team = team._id;
        await req.user.save();

        res.json({
            success: true,
            team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Leave Team
exports.leaveTeam = async (req, res) => {
    try {
        // Check if user is in a team
        if (!req.user.team) {
            return res.status(400).json({
                success: false,
                error: 'You are not part of any team'
            });
        }

        const team = await Team.findById(req.user.team);

        // If user is team leader, delete team
        if (req.user.isTeamLeader) {
            // Remove team reference from all members
            await User.updateMany(
                { _id: { $in: team.members } },
                { $unset: { team: 1 }, isTeamLeader: false }
            );

            // Delete team
            await team.remove();

            return res.json({
                success: true,
                message: 'Team deleted successfully'
            });
        }

        // Remove user from team members
        team.members = team.members.filter(
            member => member.toString() !== req.user._id.toString()
        );
        await team.save();

        // Remove team reference from user
        req.user.team = undefined;
        await req.user.save();

        res.json({
            success: true,
            message: 'Left team successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Team Details
exports.getTeamDetails = async (req, res) => {
    try {
        const team = await Team.findById(req.user.team)
            .populate('leader', 'name email')
            .populate('members', 'name email');

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        res.json({
            success: true,
            team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Team
exports.updateTeam = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if user is team leader
        if (!req.user.isTeamLeader) {
            return res.status(403).json({
                success: false,
                error: 'Only team leader can update team details'
            });
        }

        const team = await Team.findById(req.user.team);
        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        if (name) team.name = name;
        await team.save();

        res.json({
            success: true,
            team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Team Submissions
exports.getTeamSubmissions = async (req, res) => {
    try {
        const team = await Team.findById(req.user.team);
        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        res.json({
            success: true,
            submissions: team.submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};