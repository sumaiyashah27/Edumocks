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
    // const mailOptions = {
    //   from: 'support@edumocks.com',
    //   to: student.email,
    //   subject: `Test Assigned Successfully - ${course.name}`,
    //   text: `Hello ${student.firstname},

    //   Test assigned for the course ${course.name} with the following subjects: ${subjectNames.join(', ')} is successful.

    //   Now, you can schedule your test.

    //   Best of luck!

    //   The Edumocks Team
    //   https://edumocks.com/`,
    // };

    const isMultiple = subjectNames.length > 1;
    const subjectListHtml = subjectNames.map(s => `<li>${s}</li>`).join('');

    const mailOptions = {
      from: 'support@edumocks.com',
      to: student.email,
      subject: `New Mock Test Enroll: ${course.name}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>New Mock Test Enroll</title>
      </head>
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#000000; color:#ffffff; padding:20px; text-align:center;">
              <h2 style="margin:0;">🎓 New Mock Test Enroll</h2>
            </td>
          </tr>

          <!-- Course & Subjects -->
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 10px 0;">Hello <strong>${student.firstname}</strong>,</p>
              <p style="margin:0 0 15px 0;">You have been Enroll a New Mock of Course: <strong>${course.name}</strong>.</p>
              
              <p style="margin:0 0 5px 0;">📘 <strong>${isMultiple ? 'Topics of Mock Test' : 'Subject Included'}:</strong></p>
              <ul style="padding-left:20px; margin:0;">
                ${subjectListHtml}
              </ul>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="https://edumocks.com/studpanel/schedule-test" target="_blank" style="display:inline-block; padding:12px 25px; background-color:#C80D18; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:5px;">
                  📅 Schedule Test
                </a>
              </div>

              <p style="font-size:14px; color:#555555;">Wishing you the best in your preparation.</p>
              <p style="font-size:14px; color:#555555;">Best of luck!<br>Warm regards,<br><strong>Team Eduinvest</strong></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f0f0; padding:10px 20px; font-size:12px; color:#888888; text-align:center;">
              © 2025 Edumocks | <a href="https://edumocks.com" target="_blank" style="color:#888888; text-decoration:none;">Visit Website</a>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `
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
