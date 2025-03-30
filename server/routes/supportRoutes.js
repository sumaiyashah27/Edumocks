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
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Email to support team
        const supportMailOptions = {
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

        // Email to student confirming receipt
        const studentMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Edumocks Support Request Received',
            html: `
                <h3>Dear ${firstName},</h3>
                <p>Thank you for reaching out to us.</p>
                <p>Your ticket has been successfully raised, and our team is reviewing your inquiry.</p>
                <p>We will get back to you within 6-8 hours with a response. We appreciate your patience.</p>
                <p>If you have any additional details to share, feel free to reply to this email.</p>
                <p><strong>Support Guidelines:</strong></p>
                <ul>
                    <li><strong>Response Time:</strong> Our team will reply within <span class="highlight">6-8 hours</span>. We appreciate your patience while we process your request.</li>
                    <li><strong>Avoid Duplicate Submissions:</strong> Please do not submit multiple requests, as this may cause delays and mark your email as spam.</li>
                    <li><strong>Check Your Inbox & Spam Folder:</strong> If you haven’t received a response within <span class="highlight">8 hours</span>, kindly check your spam/junk folder before following up.</li>
                    <li><strong>Provide Accurate Details:</strong> Ensure your <span class="highlight">email ID and issue description</span> are correct to prevent delays in resolution.</li>
                    <li><strong>Urgent Queries:</strong> If your issue is urgent, you may also contact us directly at <a href="mailto:support@edumocks.com">support@edumocks.com</a>.</li>
                </ul>
                <p>Best Regards,</p>
                <p>Edumocks Support Team</p>
            `
        };

        // Send emails
        await transporter.sendMail(supportMailOptions);
        await transporter.sendMail(studentMailOptions);

        res.status(200).json({ message: 'Message sent successfully and confirmation email sent to student!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});

module.exports = router;