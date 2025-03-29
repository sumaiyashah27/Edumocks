const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const Student = require('../models/student-model'); // ✅ CORRECT!
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use environment variable for client ID

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
    const existingUser = await Student.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create a new user if doesn't exist
    const newUser = new Student({
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      password: '', // Password can be empty for Google sign-up
      googleId: payload.sub, // Store Google User ID
      fullPhoneNumber: '', // Optional, can handle this field later
      testCode: 'CFATEST',
    });

    await newUser.save();

    // Send welcome email
    sendWelcomeEmail(newUser.email, newUser.firstname);

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

    let studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      firstname,
      lastname,
      email,
      countryCode,
      phone,
      fullPhoneNumber: `${countryCode}${phone}`, // Correct string interpolation
      password: hashedPassword
    });

    await newStudent.save();
     // Send welcome email
     sendWelcomeEmail(newStudent.email, newStudent.firstname);

    res.status(201).json({ success: true, message: "Signup successful!" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//==================================================================================================//!SECTION
// Google Login Route
router.post('/glogin', async (req, res) => {
  // Set COOP and COEP headers for this route
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  
  const { token } = req.body;
  try {
    console.log('Received Google Token:', token);

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is your correct Google Client ID
    });

    const payload = ticket.getPayload();
    console.log('Google Token Payload:', payload);

    // Check if the user exists in the database using the email
    let student = await Student.findOne({ email: payload.email });

    if (student) {
      // If Google ID is present, just log the user in
      if (student.googleId) {
        console.log('User found with existing Google ID');
        return res.status(200).json({
          success: true,
          message: 'Login successful!',
          _id: student._id, 
          firstname: student.firstname,
          lastname: student.lastname,
          email: student.email,
        });
      } else {
        // If Google ID is missing, update it now
        student.googleId = payload.sub; // Update Google ID with the new value from payload
        await student.save();
        console.log('Google ID updated for existing user');
        
        return res.status(200).json({
          success: true,
          message: 'Login successful with Google ID update!',
          _id: student._id, 
          firstname: student.firstname,
          lastname: student.lastname,
          email: student.email,
        });
      }

    } else {
      // If no user is found, the user needs to be registered
      console.log('User not found in database, need to register');
      return res.status(400).json({ success: false, message: 'User not registered with Google' });
    }

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
    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Send user details to the frontend
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      _id: student._id,
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});
//======================================================================================================================//
//======================================================================================================================//!SECTION
// Bulk Student Upload Route
router.post('/bulk', async (req, res) => {
  const studentsData = req.body;

  try {
    // Insert multiple students into the database
    const insertedStudents = await Student.insertMany(studentsData);

    // Send welcome email to each student
    for (const student of insertedStudents) {
      await sendWelcomeEmail(student.email, student.firstname); // Send the welcome email
    }

    res.status(200).json(insertedStudents);  // Send inserted students' data back for confirmation
  } catch (error) {
    console.error('Error uploading students:', error);
    res.status(500).json({ success: false, message: 'Error uploading students', error });
  }
});

// Route to fetch all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

// Route to delete a student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (password !== process.env.DELETE_PASSWORD) {
    return res.status(403).json({ success: false, message: 'Incorrect password' });
  }

  try {
    await Student.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
});
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
// Route to fetch student by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('route student details for ID:', id);
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    res.status(500).json({ success: false, message: 'Error fetching student data' });
  }
});

//================================================================
// Route to update a student's profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, countryCode, phone, fullPhoneNumber } = req.body;

  try {
    // Find the student by ID
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Update the student details
    student.firstname = firstname || student.firstname;
    student.lastname = lastname || student.lastname;
    student.email = email || student.email;
    student.countryCode = countryCode || student.countryCode;
    student.phone = phone || student.phone;
    student.fullPhoneNumber = fullPhoneNumber || student.fullPhoneNumber;

    // Save the updated student details
    await student.save();

    // Send response back to the frontend
    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      student: {
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        countryCode: student.countryCode,
        phone: student.phone,
        fullPhoneNumber: student.fullPhoneNumber,
      },
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ success: false, message: 'Error updating student profile' });
  }
});
//===============================================================
// Verify if the email exists in the database
router.post('/verify-email', async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Email not found' });
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);

    await student.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;