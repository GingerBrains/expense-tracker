const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const { registerUser, 
        loginUser, 
        getUserInfo, 
        updateUser,
        verifyEmail,
        forgotPassword,
        resetPassword,
    } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser',protect, getUserInfo);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Update user info
router.put('/update', protect, updateUser);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // Cloudinary returns the URL in req.file.path
    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
});

module.exports = router;