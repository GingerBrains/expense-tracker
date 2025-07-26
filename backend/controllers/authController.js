const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../config/mailer');

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

//Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //Validation: Check if all fields are provided
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try{
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 60 * 60 * 1000; // 1 hour in the future

        //Create new user (not verified)
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
            isVerified: false,
            emailVerificationToken,
            emailVerificationExpires: new Date(expires),
            verificationTimeout: new Date(expires), // Set to 1 hour in the future
        });

        // Send verification email
        const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${emailVerificationToken}`;
        await sendMail({
            to: user.email,
            subject: 'Verify your email',
            html: `<p>Hi ${user.fullName},</p><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a><p>This link will expire in 1 hour.</p>`
        });

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
    //console.log('Token received for verification:', token);
    if (!token) {
        return res.status(400).json({ message: 'Invalid or missing token.' });
    }
    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
        });
        //console.log('User found for verification:', user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }
        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        user.verificationTimeout = null; // Remove TTL field to prevent deletion
        await user.save();
        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //Validation: Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        //Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        //Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    //console.log('Forgot password endpoint hit', req.body);
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please provide your email address.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // For security, do not reveal if user exists
            return res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();
        // Send reset email
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        const mailResult = await sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Hi ${user.fullName},</p><p>You requested a password reset. Click the link below to set a new password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 1 hour. If you did not request this, you can ignore this email.</p>`
        });
        //console.log('Mail result:', mailResult);
        //if (mailResult && mailResult.preview) {
        //    console.log('Preview URL:', mailResult.preview);
        //}
        return res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Invalid request.' });
    }
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }
        user.password = password; // Will be hashed by pre-save hook
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User Info
exports.updateUser = async (req, res) => {
    const userId = req.user.id;
    const { fullName, email, password, profileImageUrl } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If email is being changed, check for uniqueness
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }
        if (fullName) user.fullName = fullName;
        if (profileImageUrl) user.profileImageUrl = profileImageUrl;
        if (password) user.password = password; // Will be hashed by pre-save hook

        await user.save();
        const updatedUser = await User.findById(userId).select('-password');
        res.status(200).json({
            user: updatedUser,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};