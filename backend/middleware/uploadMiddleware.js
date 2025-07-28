const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'expense-tracker/profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [
            { width: 300, height: 300, crop: 'fill' }, // Resize to 300x300
            { quality: 'auto' } // Optimize quality
        ]
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed.'), false); // Reject file
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;