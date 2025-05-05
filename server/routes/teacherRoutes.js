const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { Teacher } = require('../models/teach-model');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use environment variable for client ID
const jwt = require('jsonwebtoken');

// Create a transporter object using your email provider's settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email provider
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // Your email password or app password
  },
});

// Function to send email
const sendWelcomeEmail = (email, firstname) => {
  const mailOptions = {
    from: 'support@edumocks.com', // Sender address
    to: email, // Recipient address
    subject: 'Welcome to EduMocks!', // Subject line
    text: `Dear ${firstname},\n\nWelcome to EduMocks! 🎉 You’ve taken the first step toward mastering your exam preparation, and we’re excited to help you along the way.\n\nAre you ready to kickstart your journey? 💡 We invite you to take your FIRST MOCK TEST now!\n\n🌟 Why Take the First Mock Test?\nAccurate Exam Simulation\nDetailed Performance Analysis\nTrack Your Progress\n👉 Start Your First Mock Test Today!\n\nDon’t wait! Your exam preparation can take a huge leap forward with your first mock test. Let Edumocks help you stay on track to achieve your goals!\n\nBest of luck with your mock test, and we’re here to support you every step of the way!\n\nWarm regards,\nThe EduMocks Team\n\nVisit: EduMocks.com`,
    html: `<p>Dear ${firstname},</p><p>Welcome to EduMocks! 🎉 You’ve taken the first step toward mastering your exam preparation, and we’re excited to help you along the way.</p><p>Are you ready to kickstart your journey? 💡 We invite you to take your FIRST MOCK TEST now!</p><ul><li>🌟 Why Take the First Mock Test?</li><li>Accurate Exam Simulation</li><li>Detailed Performance Analysis</li><li>Track Your Progress</li></ul><p>👉 Start Your First Mock Test Today!</p><p>Don’t wait! Your exam preparation can take a huge leap forward with your first mock test. Let Edumocks help you stay on track to achieve your goals!</p><p>Best of luck with your mock test, and we’re here to support you every step of the way!</p><p>Warm regards,<br>The EduMocks Team</p><p>Visit: <a href="https://www.edumocks.com">EduMocks.com</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Google Signup Route
router.post('/gsignup', async (req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  const { token } = req.body; // Expecting the token in the body
  console.log('Received token:', token);

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
    });

    const payload = ticket.getPayload(); // Get the payload from the token

    // Check if user exists in the database
    const existingTeacher = await Teacher.findOne({ email: payload.email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Teacher already exists' });
    }

    // Create a new user if doesn't exist
    const newTeacher = new Teacher({
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      password: '', // Password can be empty for Google sign-up
      googleId: payload.sub, // Store Google User ID
      fullPhoneNumber: '', // Optional, can handle this field later
    });

    await newTeacher.save();

    // Send welcome email
    sendWelcomeEmail(newTeacher.email, newTeacher.firstname);

    res.status(201).json({ success: true, message: 'Google signup successful!' });
  } catch (error) {
    console.error('Error during Google signup:', error);
    res.status(500).json({ success: false, message: 'Google signup failed. Please try again.' });
  }
});


// Signup Route
router.post('/signup', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { firstname, lastname, email, countryCode, phone, password } = req.body;

    let teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      firstname,
      lastname,
      email,
      countryCode,
      phone,
      fullPhoneNumber: `${countryCode}${phone}`, // Correct string interpolation
      password: hashedPassword
    });

    await newTeacher.save();
     // Send welcome email
     sendWelcomeEmail(newTeacher.email, newTeacher.firstname);

    res.status(201).json({ success: true, message: "Signup successful!" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//==================================================================================================//!SECTION
// Google Login Route
// router.post('/glogin', async (req, res) => {
//     // Set COOP and COEP headers for this route
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    
//     const { token } = req.body;
//     try {
//       console.log('Received Google Token:', token);
  
//       // Verify Google token
//       const ticket = await client.verifyIdToken({
//         idToken: token,
//         audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is your correct Google Client ID
//       });
  
//       const payload = ticket.getPayload();
//       console.log('Google Token Payload:', payload);
  
//       // Check if the user exists in the database using the email
//       let teacher = await Teacher.findOne({ email: payload.email });
//       if (!teacher) {
//         console.log('User not found in database');
//         return res.status(400).json({ success: false, message: 'User not registered with Google' });
//       }
  
//       console.log('User found:', teacher);
      
//       // Respond with the teacher details
//       res.status(200).json({
//         success: true,
//         message: 'Login successful!',
//         _id: teacher._id, 
//         teachId: teacher.teachId,
//         firstname: teacher.firstname,
//         lastname: teacher.lastname,
//         email: teacher.email
//       });
  
//     } catch (error) {
//       console.error('Error during Google login:', error);
//       res.status(500).json({ success: false, message: 'Google login failed. Please try again.' });
//     }
//   });

router.post('/glogin', async (req, res) => {
  // Set COOP and COEP headers for this route
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  const { token } = req.body;
  try {
    console.log('Received Google Token:', token);

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('Google Token Payload:', payload);

    // Check if the user exists in the database using the email
    let teacher = await Teacher.findOne({ email: payload.email });
    if (!teacher) {
      console.log('User not found in database');
      return res.status(400).json({ success: false, message: 'User not registered with Google' });
    }

    console.log('User found:', teacher);

    // ✅ Always generate a JWT token
    const jwtToken = jwt.sign(
      { _id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET
    );

    // ✅ Respond with the teacher details and token
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: jwtToken, // return token also
      _id: teacher._id,
      teachId: teacher.teachId,
      firstname: teacher.firstname,
      lastname: teacher.lastname,
      email: teacher.email,
    });

  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ success: false, message: 'Google login failed. Please try again.' });
  }
});
  // Login Route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }
  
    
    try {
      // Find the teacher by email
      const teacher = await Teacher.findOne({ email });
      if (!teacher) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, teacher.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // ✅ Generate a JWT token
      const token = jwt.sign(
        { _id: teacher._id, email: teacher.email },
        process.env.JWT_SECRET
      );
  
      // Send user details to the frontend
      res.status(200).json({
        success: true,
        message: 'Login successful!',
        _id: teacher._id, 
        token, 
        teachId: teacher.teachId,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email
      });
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
  });
  
module.exports = router;