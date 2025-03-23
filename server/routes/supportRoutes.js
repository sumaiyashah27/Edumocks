const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-support-message', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use 'smtp.ethereal.email' for testing
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: email, // The student's email
            to: process.env.GMAIL_USER,
            subject: `Support Request from ${firstName} ${lastName}`,
            html: `
                <h3>New Support Message</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});

module.exports = router;