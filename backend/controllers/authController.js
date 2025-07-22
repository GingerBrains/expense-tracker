const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

        //Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
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