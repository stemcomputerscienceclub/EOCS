const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
        
        const mailOptions = {
            from: `"EOCS Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your EOCS Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <img src="cid:logo" alt="EOCS Logo" style="width: 150px; margin: 20px 0;">
                    <h2 style="color: #1a237e;">Welcome to EOCS!</h2>
                    <p>Thank you for registering for the Egyptian Olympiad in Computational Science.</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <a href="${verificationUrl}" 
                    style="display: inline-block; padding: 12px 24px; background: #3949ab; 
                            color: white; text-decoration: none; border-radius: 4px; 
                            margin: 20px 0;">
                        Verify Email
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        If the button doesn't work, copy and paste this link into your browser:
                        <br>
                        ${verificationUrl}
                    </p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This email was sent by EOCS. If you didn't register for an account,
                        please ignore this email.
                    </p>
                </div>
            `,
            attachments: [{
                filename: 'logo.svg',
                path: './frontend/assets/logo.svg',
                cid: 'logo'
            }]
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        
        const mailOptions = {
            from: `"EOCS Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your EOCS Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <img src="cid:logo" alt="EOCS Logo" style="width: 150px; margin: 20px 0;">
                    <h2 style="color: #1a237e;">Password Reset Request</h2>
                    <p>You requested to reset your password for your EOCS account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background: #3949ab; 
                              color: white; text-decoration: none; border-radius: 4px; 
                              margin: 20px 0;">
                        Reset Password
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        If the button doesn't work, copy and paste this link into your browser:
                        <br>
                        ${resetUrl}
                    </p>
                    <p style="color: #666;">
                        This link will expire in 30 minutes.
                    </p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        If you didn't request a password reset, please ignore this email or contact support.
                    </p>
                </div>
            `,
            attachments: [{
                filename: 'logo.svg',
                path: './frontend/assets/logo.svg',
                cid: 'logo'
            }]
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    async sendTeamInvitation(email, teamName, invitationCode) {
        const joinUrl = `${process.env.FRONTEND_URL}/join-team/${invitationCode}`;
        
        const mailOptions = {
            from: `"EOCS Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Invitation to Join EOCS Team: ${teamName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <img src="cid:logo" alt="EOCS Logo" style="width: 150px; margin: 20px 0;">
                    <h2 style="color: #1a237e;">Team Invitation</h2>
                    <p>You've been invited to join the team "${teamName}" in the EOCS competition!</p>
                    <p>Use this invitation code to join the team:</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; 
                                font-size: 24px; font-family: monospace; margin: 20px 0;">
                        ${invitationCode}
                    </div>
                    <p>Or click the button below to join directly:</p>
                    <a href="${joinUrl}" 
                       style="display: inline-block; padding: 12px 24px; background: #3949ab; 
                              color: white; text-decoration: none; border-radius: 4px; 
                              margin: 20px 0;">
                        Join Team
                    </a>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        If you don't want to join this team or didn't expect this invitation,
                        please ignore this email.
                    </p>
                </div>
            `,
            attachments: [{
                filename: 'logo.svg',
                path: './frontend/assets/logo.svg',
                cid: 'logo'
            }]
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
}

module.exports = new EmailService();