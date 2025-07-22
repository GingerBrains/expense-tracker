const nodemailer = require('nodemailer');

// Configure the transporter (for development, use ethereal.email or Mailtrap)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'your_ethereal_user',
        pass: process.env.SMTP_PASS || 'your_ethereal_pass',
    },
});

/**
 * Send an email
 * @param {Object} options - { to, subject, html }
 */
const sendMail = async (options) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || 'no-reply@expensetracker.com',
        ...options,
    };
    const info = await transporter.sendMail(mailOptions);
    // For Ethereal, add preview URL to the result
    if (nodemailer.getTestMessageUrl) {
        info.preview = nodemailer.getTestMessageUrl(info);
    }
    return info;
};

module.exports = { transporter, sendMail }; 