const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const router = express.Router();
const upload = multer(); // Handles file uploads
require('dotenv').config();

// POST route for sending quiz results via email with PDF attachment
router.post('/sendQuizResults', upload.single('pdf'), (req, res) => {
  const { studentEmail } = req.body;
  console.log('Student Email:', studentEmail);

  if (!req.file) {
    return res.status(400).send('No PDF file uploaded');
  }

  const pdfBuffer = req.file.buffer; // Get the correct buffer

  // Setup the nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: studentEmail,
    subject: 'Test Completed! 🎉 Your Results and Solutions',
    html: `
      <p>Hello,</p>
      <p>Congratulations on successfully completing your Test! 🎉 You've taken a big step forward in your exam preparation, and we’re excited to see your results.</p>
      
      <p>Your test has been submitted, and we’ve attached the Test Solutions for you to review. This will help you analyze your performance and identify areas for improvement.</p>
      
      <h3>Next Steps:</h3>
      <ul>
        <li>Review the solutions carefully to understand the correct answers.</li>
        <li>Identify areas where you can improve and focus your study efforts.</li>
        <li>Keep practicing to strengthen your knowledge and skills.</li>
      </ul>
      
      <p>We hope this test has been a valuable learning experience for you. Don’t hesitate to reach out if you have any questions or need further assistance.</p>
      
      <p>Keep up the great work, and we look forward to your continued progress!</p>
      
      <p>Best regards,<br>
      The Edumocks Team<br>
      <a href="https://edumocks.com/">Edumocks</a></p>
    `,
    attachments: [
      {
        filename: 'quiz-results.pdf',
        content: pdfBuffer, // Ensure it's a buffer
        contentType: 'application/pdf', // Set correct MIME type
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    return res.status(200).send('Email sent successfully');
  });
});


module.exports = router;
