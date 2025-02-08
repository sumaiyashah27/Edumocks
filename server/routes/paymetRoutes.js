const express = require("express");
const router = express.Router();
const StudEnroll = require("../models/studenroll-model");
const Student = require("../models/subject-model"); // Replaced User with Student
const Course = require("../models/course-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const nodemailer = require("nodemailer");
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Email setup with Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Mock payment gateway simulation (Replace with Razorpay/Stripe in production)
router.post("/", async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, amount } = req.body;

  if (!studentId || !selectedCourse || !selectedSubject || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Save initial payment record with "pending" status
    const enrollment = new StudEnroll({
      studentId,
      selectedCourse,
      selectedSubject,
      amount,
      paymentStatus: "pending",
    });

    const savedEnrollment = await enrollment.save();

    // Simulate payment gateway interaction
    const paymentId = `PAY-${Date.now()}`;
    setTimeout(async () => {
      savedEnrollment.paymentStatus = "success";
      savedEnrollment.paymentId = paymentId;
      await savedEnrollment.save();

      // Send email notification on successful payment
      const student = await Student.findById(studentId); // Fetch student data
      const course = await Course.findById(selectedCourse); // Fetch course data
      const subjectNames = selectedSubject.map(sub => sub.name).join(", ");

      const mailOptions = {
        from: process.env.EMAIL,
        to: student.email,
        subject: `Test Assigned Successfully - ${course.name}`,
        text: `Hello ${student.firstname},\n\nTest assignment for the course ${course.name} and selected subjects: ${subjectNames} is successful. Now, you can schedule your test.\n\nBest of luck!\n\nThe Edumocks Team\n[https://edumocks.com/]`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      console.log("Payment successful for:", paymentId);
    }, 5000);

    res.status(200).json({
      message: "Payment initiated",
      enrollmentId: savedEnrollment._id,
      paymentId,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Payment failed", error });
  }
});

// Fetch course with its subjects based on courseId
router.get("/api/course/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate("subjects");
    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).send("Server Error");
  }
});

// Route to get student details by studentId
router.get("/api/student/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      _id: student._id,
      studentId: student.studentId,
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Failed to fetch student details", error });
  }
});

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).send({ error: error.message });
  }
});

// Create Razorpay Order
router.post("/create-razorpay-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Error creating Razorpay order." });
  }
});

module.exports = router;
