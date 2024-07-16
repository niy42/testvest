const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User, sequelize } = require('../../models'); // Adjust the path as necessary
const { Op } = require('sequelize'); // Import Op from sequelize
const { google } = require('googleapis');
const bcrypt = require('bcryptjs');
const router = express.Router();
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(user, token, req) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Error sending email: ' + error.message);
    }
}

router.post('/send-reset-link', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('forgot-password', { error: 'No account with that email found.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();

        await sendMail(user, token, req);

        res.render('forgot-password', { message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
    } catch (error) {
        console.error('Error:', error);
        res.render('forgot-password', { error: error.message });
    }
});

router.get('/reset/:token', async (req, res) => {
    const { token } = req.params;
    console.log('Token:', token);  // Log the token to verify it's being passed correctly
    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Use Op from Sequelize
            }
        });

        if (!user) {
            return res.render('reset-password', { error: 'Password reset token is invalid or has expired.' });
        }

        res.render('reset-password', { token: token });
    } catch (error) {
        console.error('Database error:', error);
        res.render('reset-password', { error: 'Database error. Please try again later.' });
    }
});

router.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('reset-password', { error: 'Passwords do not match.', token });
    }

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Use Op from Sequelize
            }
        });

        if (!user) {
            return res.render('reset-password', { error: 'Password reset token is invalid or has expired.', token });
        }

        user.password = await bcrypt.hash(password, 10); // Hash the password before saving
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.redirect('/mysqllogin');
    } catch (error) {
        console.error('Database error:', error);
        res.render('reset-password', { error: 'Database error. Please try again later.', token });
    }
});

module.exports = router;