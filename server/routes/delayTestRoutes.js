const express = require('express');
const router = express.Router();
const Subject = require("../models/subject-model");
const Course = require('../models/course-model');
const Student = require("../models/student-model");
const DelayTest = require('../models/delaytest-model'); // Your model for delay test data

// Route to save delay test after successful payment
router.post('/', async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, testDate, testTime, amount, paymentId, orderId } = req.body;

  try {
    const delayTest = new DelayTest({
      studentId,
      selectedCourse,
      selectedSubject,
      testDate,
      testTime,
      amount,
      paymentId,
      orderId
    });

    await delayTest.save(); // Save the delay test data to the database
    res.status(201).json({ message: 'Delay test data saved successfully', delayTest });
  } catch (error) {
    console.error('Error saving delay test data:', error);
    res.status(500).json({ message: 'Error saving delay test data' });
  }
});
// router.post('/', async (req, res) => {
//   const { studentId, selectedCourse, selectedSubject, testDate, testTime, amount, paymentId, orderId } = req.body;

//   try {
//     // Create new delay test document (use fake IDs for testing if payment is not done)
//     const delayTest = new DelayTest({
//       studentId,
//       selectedCourse,
//       selectedSubject,
//       testDate,
//       testTime,
//       amount,
//       paymentId: paymentId || "fakePaymentId",  // Use a fake paymentId for testing
//       orderId: orderId || "fakeOrderId"         // Use a fake orderId for testing
//     });

//     await delayTest.save(); // Save the delay test data to the database
//     res.status(201).json({ message: 'Delay test data saved successfully', delayTest });
//   } catch (error) {
//     console.error('Error saving delay test data:', error);
//     res.status(500).json({ message: 'Error saving delay test data' });
//   }
// });

// Route to get student by ID
router.get('/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).select('firstname lastname email');
    
    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    }
    
    res.json(student); // Send student data
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  // Get subject by ID
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).select('name');
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject); // Send subject data
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  // Get course by ID
router.get('/course/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).select('name');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course); // Send course data
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch all delayed tests with student, course, and subject details
router.get("/", async (req, res) => {
  try {
    const tests = await DelayTest.find()
      .populate({ path: "studentId", select: "firstname lastname" })
      .populate({ path: "selectedCourse", select: "name" })
      .populate({ path: "selectedSubject", select: "name" });

    if (!tests.length) {
      return res.status(404).json({ message: "No delay tests found" });
    }

    res.json(tests);
  } catch (error) {
    console.error("Error fetching delay tests:", error);
    res.status(500).json({ message: "Error fetching delayed tests" });
  }
});
  
module.exports = router;