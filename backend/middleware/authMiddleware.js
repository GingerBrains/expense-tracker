const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

         if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Token invalid or malformed' });
        }

        // Fetch the user from the database
        req.user = await User.findById(decoded.id).select('-password');
        console.log('User from request:', req.user);
        
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
