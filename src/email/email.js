const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    service: "mail.ru",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Service!',
        text: `Hello ${name},\n\nThank you for registering with us. We're excited to have you on board!\n\nBest regards,\nYour Service Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendWelcomeEmail
