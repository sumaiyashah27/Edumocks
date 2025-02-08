const express = require('express');
const nodemailer = require('nodemailer');
const Student = require('../models/student-model'); // Replace with your student model
const Course = require('../models/course-model'); // Replace with your course model
const Subject = require('../models/subject-model'); // Replace with your course model

const router = express.Router();

// Email sending endpoint
router.post('/send-enrollemail', async (req, res) => {
  const { studentId , selectedCourse, selectedSubjects  } = req.body;

  try {
    // Fetch student and course details
    console.log("📌 Student Model:", Student); // 🔍 Debugging line
    const student = await Student.findById(studentId);
    console.log("📌 Student Data:", student); 
    if (!student) throw new Error(`Student not found: ${studentId}`);
    const course = await Course.findById(selectedCourse);
    if (!course) throw new Error(`Course not found: ${selectedCourse}`);

    // If multiple subjects are selected, fetch all subject details
    let subjectNames = [];
    if (Array.isArray(selectedSubjects)) {
      const subjects = await Subject.find({ '_id': { $in: selectedSubjects } });
      subjectNames = subjects.map(subject => subject.name);
    } else {
      // If only one subject is selected, fetch its details
      const subject = await Subject.findById(selectedSubjects);
      if (!subject) {
        console.error(`❌ Subject not found: ${selectedSubjects}`);
        return res.status(400).json({ message: "Error: Subject not found" });
      }
      subjectNames.push(subject.name);
    }

    // Configure NodeMailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your preferred email service
      auth: {
        user: 'support@edumocks.com', // Replace with your email
        pass: 'bhhl hpzx tgvb gvlk', // Replace with your email password or app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: 'support@edumocks.com',
      to: student.email,
      subject: `Test Assigned Successfully - ${course.name}`,
      text: `Hello ${student.firstname},

Test assigned for the course ${course.name} with the following subjects: ${subjectNames.join(', ')} is successful.

Now, you can schedule your test.

Best of luck!

The Edumocks Team
https://edumocks.com/`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

module.exports = router;
