const express = require('express');
const router = express.Router();
require('dotenv').config();
const ScheduleTest = require('../models/scheduletest-model');
const Subject = require('../models/subject-model');
const Course = require('../models/course-model');
const Student = require('../models/student-model') // Assuming this is the Subject model
const sendEmail = require('../utils/sendEmail');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request data

    const { studentId, selectedCourse, selectedSubject, questionSet, testDate, testTime, testStatus } = req.body;

    // Validate the input data
    if (!studentId || !selectedCourse || !selectedSubject || !questionSet || !testDate || !testTime) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Find the Subject ID using the name
    const subject = await Subject.findOne({ _id: selectedSubject });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    console.log('Found subject:', subject);

    // Save test schedule to the database
    const newTest = new ScheduleTest({
      studentId,
      selectedCourse,
      selectedSubject: subject._id,
      questionSet,
      testDate,
      testTime,
      testStatus,
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error scheduling test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// GET /api/scheduleTest/:userId
router.get('/:studentId', authMiddleware,  async (req, res) => {
  const { studentId } = req.params; // Extract userId from URL

  try {
    // Fetch all scheduled tests for the user
    const scheduledTests = await ScheduleTest.find({ studentId });

    if (!scheduledTests || scheduledTests.length === 0) {
      return res.status(404).json({ message: 'No scheduled tests found for this student.' });
    }

    res.status(200).json(scheduledTests); // Return the list of tests
  } catch (error) {
    console.error('Error fetching scheduled tests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/scheduleTest
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Fetch all scheduled tests
    const scheduledTests = await ScheduleTest.find()
    .populate({ path: "studentId", select: "firstname lastname" })
    .populate({ path: "selectedCourse", select: "name" })
    .populate({ path: "selectedSubject", select: "name" });


    if (!scheduledTests || scheduledTests.length === 0) {
      return res.status(404).json({ message: 'No scheduled tests found.' });
    }

    res.status(200).json(scheduledTests);
  } catch (error) {
    console.error('Error fetching scheduled tests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch scheduled tests for a specific user
router.get('/scheduleTest/:studentId', authMiddleware, async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findById(studentId); // Find user by userId
    if (!student) return res.status(404).json({ message: 'student not found' });

    const scheduledTests = await ScheduleTest.find({ studentId }); // Find scheduled tests for the user
    res.json(scheduledTests);
  } catch (error) {
    console.error('Error fetching scheduled tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to get ScheduleTest by userId, selectedCourse, and selectedSubject
router.get("/", authMiddleware, async (req, res) => {
  const { studentId, selectedCourse, selectedSubject } = req.query;

  if (!studentId || !selectedCourse || !selectedSubject) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const scheduleTest = await ScheduleTest.findOne({
      studentId,
      selectedCourse,
      selectedSubject,
    });

    if (!scheduleTest) {
      return res.status(404).json({ message: "ScheduleTest not found" });
    }

    res.json({ questionSet: scheduleTest.questionSet });
  } catch (error) {
    console.error("Error fetching schedule test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to update test status to "Completed" and set the score
router.post('/updateTestStatus', async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, score } = req.body;

  console.log('Received request to update test status and score:', req.body);

  try {
    // Find the test schedule with status "Scheduled" and update it
    const updatedTest = await ScheduleTest.findOneAndUpdate(
      { studentId, selectedCourse, selectedSubject, testStatus: 'Scheduled' }, // Match tests that are still "Scheduled"
      {
        $set: {
          testStatus: 'Completed',  // Update the test status
          score,                   // Update the score
        },
      },
      { new: true }  // Return the updated test document
    );

    if (!updatedTest) {
      console.log('Test schedule not found or already completed for:', { studentId, selectedCourse, selectedSubject });
      return res.status(404).json({ message: 'Test schedule not found or already completed.' });
    }

    console.log('Test status and score updated:', updatedTest);
    res.status(200).json({ message: 'Test status updated to Completed and score saved.', test: updatedTest });
  } catch (error) {
    console.error('Error updating test status and score:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Endpoint to update test score
router.post('/updateTestScore', async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, score } = req.body;

  try {
    // Find the test and update the score
    const result = await ScheduleTest.findOneAndUpdate(
      {
        studentId,
        selectedCourse,
        selectedSubject,
      },
      { $set: { score, testStatus: 'Completed' } }, // Update score and mark the test as completed
      { new: true, upsert: false } // Return updated document, do not create if not found
    );

    if (!result) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    res.status(200).json({ message: 'Score updated successfully.', data: result });
  } catch (error) {
    console.error('Error updating test score:', error);
    res.status(500).json({ message: 'Failed to update test score.' });
  }
});
// Fetch completed tests for a specific user
router.get('/scheduleTest/:studentId', authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const completedTests = await ScheduleTest.find({ studentId, testStatus: 'Completed' })
      .populate('selectedCourse selectedSubject') // Populate course and subject data
      .exec();
    
    res.json(completedTests);
  } catch (error) {
    console.error('Error fetching completed tests:', error);
    res.status(500).send('Server Error');
  }
});
router.put('/scheduleTest', async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, testDate, testTime } = req.body;
  
  try {
    const updatedTest = await ScheduleTest.findOneAndUpdate(
      { studentId, selectedCourse, selectedSubject, testStatus: 'Scheduled' },
      { $set: { testDate, testTime, testStatus: 'Scheduled' } },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found or already updated.' });
    }

    res.status(200).json(updatedTest);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Error updating test', error });
  }
});
router.put('/', async (req, res) => {
  console.log("Received PUT request for /scheduleTest");
  const { studentId, selectedCourse, selectedSubject, testDate, testTime } = req.body;

  try {
    const updatedTest = await ScheduleTest.findOneAndUpdate(
      { studentId, selectedCourse, selectedSubject, testStatus: 'Scheduled' },
      { $set: { testDate, testTime, testStatus: 'Scheduled' } },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found or already updated.' });
    }

    res.status(200).json(updatedTest);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Error updating test', error });
  }
});

// Fetch test details for the given user, course, and subject
router.get('/', authMiddleware, async (req, res) => {
  const { studentId, course, subject } = req.query;
  try {
    const testDetails = await ScheduleTest.findOne({
      studentId,
      selectedCourse: course,
      selectedSubject: subject,
    }).populate('selectedCourse selectedSubject'); // Populate course and subject fields
    if (!testDetails) {
      return res.status(404).json({ message: 'Test not found' });
    }
    return res.json({
      questionSet: testDetails.questionSet,
      testDate: testDetails.testDate,
      testTime: testDetails.testTime,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to check and update test status to "delay" after 1 hour
router.put('/scheduleTest/delay', async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, testDate } = req.body;

  try {
    // Check if the test date is valid and has passed 1 hour
    const testDateTime = new Date(testDate);
    const now = new Date();
    const timeDiff = now - testDateTime; // Time difference in milliseconds

    // If 1 hour has passed, we proceed with updating the status to 'delay'
    if (timeDiff >= 3600000) { // 3600000 milliseconds = 1 hour
      // Find the test schedule where the test status is still "Scheduled"
      const updatedTest = await ScheduleTest.findOneAndUpdate(
        { studentId, selectedCourse, selectedSubject, testStatus: 'Scheduled' },
        { testStatus: 'Delay' },  // Update to 'Delay'
        { new: true }
      );

      if (!updatedTest) {
        return res.status(404).json({ message: 'Test schedule not found or already updated.' });
      }

      // Send back the updated test schedule
      return res.status(200).json(updatedTest);
    } else {
      return res.status(400).json({ message: 'Test has not yet passed 1 hour.' });
    }
  } catch (error) {
    console.error('Error updating test status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to send a reminder email 24 hours before the test
router.post('/sendReminder24Hours', async (req, res) => {
  try {
    // Log the request body to check if userId is coming correctly
    console.log('Received request to send 24-hour reminder:', req.body);

    const { userId, testDate, testTime } = req.body;

    // Ensure userId is received properly
    if (!studentId) {
      console.error('UserId is missing from the request body');
      return res.status(400).json({ message: 'UserId is required' });
    }

    // Calculate test date and time
    const testDateTime = new Date(testDate);
    const [hours, minutes] = testTime.split(':');
    testDateTime.setHours(hours);
    testDateTime.setMinutes(minutes);

    // Format the testDate to a readable format
    const formattedTestDate = testDateTime.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTestTime = testDateTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const now = new Date();
    const timeDiff = testDateTime - now;

    // Ensure the test is within 24 hours
    if (timeDiff <= 0 || timeDiff > 86400000) { // 24 hours in milliseconds
      return res.status(400).json({ message: 'Test is not within 24 hours.' });
    }

    // Find the scheduled test
    const scheduledTest = await ScheduleTest.findOne({ studentId, testDate, testTime });
    if (!scheduledTest) {
      return res.status(404).json({ message: 'Scheduled test not found.' });
    }

    // Check if 24-hour reminder has already been sent
    if (scheduledTest?.reminderSent24Hours) {
      return res.status(400).json({ message: '24-hour reminder has already been sent for this test.' });
    }

    // Find the user and send the email
    const student = await Student.findById(studentId);
    if (!student || !student.email) {
      console.error('student not found, studentId:', studentId);  // Log the userId for debugging
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send the email
    await sendEmail(student.email, '24-Hour Test Reminder', 
      `Your test is scheduled for ${formattedTestDate} at ${formattedTestTime}.`);

    // Update reminderSent24Hours flag and save
    scheduledTest.reminderSent24Hours = true;
    await scheduledTest.save();

    res.status(200).json({ message: '24-hour reminder sent successfully.' });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Server error while sending reminder.' });
  }
});

// Endpoint to send a reminder email 1 hour before the test
router.post('/sendReminder1Hour', async (req, res) => {
  try {
    // Log the request body to check if userId is coming correctly
    console.log('Received request to send 1-hour reminder:', req.body);

    const { studentId, testDate, testTime } = req.body;
    
    // Ensure userId is received properly
    if (!studentId) {
      console.error('studentId is missing from the request body');
      return res.status(400).json({ message: 'studentId is required' });
    }

    // Calculate test date and time
    const testDateTime = new Date(testDate);
    const [hours, minutes] = testTime.split(':');
    testDateTime.setHours(hours);
    testDateTime.setMinutes(minutes);

    // Format the testDate to a readable format
    const formattedTestDate = testDateTime.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTestTime = testDateTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const now = new Date();
    const timeDiff = testDateTime - now;

    // Ensure the test is within 1 hour
    if (timeDiff <= 0 || timeDiff > 3600000) { // 1 hour in milliseconds
      return res.status(400).json({ message: 'Test is not within 1 hour.' });
    }

    // Find the scheduled test
    const scheduledTest = await ScheduleTest.findOne({ studentId, testDate, testTime });

    // Check if 1-hour reminder has already been sent
    if (scheduledTest?.reminderSent1Hour) {
      return res.status(400).json({ message: '1-hour reminder has already been sent for this test.' });
    }

    // Find the user and send the email
    const student = await Student.findById(studentId);
    if (!student || !student.email) {
      console.error('student not found, studentId:', studentId);  // Log the userId for debugging
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send formatted date and time in the email
    await sendEmail(student.email, '1-Hour Test Reminder', 
      `Your test is scheduled for ${formattedTestDate} at ${formattedTestTime}.`);

    // Update reminderSent1Hour flag and save
    scheduledTest.reminderSent1Hour = true;
    await scheduledTest.save();

    res.status(200).json({ message: '1-hour reminder sent successfully.' });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Server error while sending reminder.' });
  }
});

// Route to get all test schedules for a user
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params; // Get the userId from the URL params

    // Query the ScheduleTest collection for all tests related to the given userId
    const testSchedules = await ScheduleTest.find({ studentId }).populate('selectedCourse selectedSubject');

    if (!testSchedules.length) {
      return res.status(404).json({ message: 'No test schedules found for this user.' });
    }

    res.status(200).json(testSchedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/course/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ name: course.name });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get subject by ID
router.get('/subject/:id', authMiddleware, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.json({ name: subject.name });
    } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch only completed tests with populated student, course, and subject details
router.get("/completedTests", authMiddleware, async (req, res) => {
  console.log("Request query:", req.query);
  try {
    const completedTests = await ScheduleTest.find({ testStatus: "Completed" })
      .populate({ path: "studentId", select: "firstname lastname" })
      .populate({ path: "selectedCourse", select: "name" })
      .populate({ path: "selectedSubject", select: "name" });

    if (!completedTests.length) {
      return res.status(404).json({ message: "No completed tests found" });
    }

    res.json(completedTests);
  } catch (error) {
    console.error("🔥 Error fetching completed tests:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to fetch all completed tests
router.get('/getCompletedTests', authMiddleware, async (req, res) => {
  try {
    const completedTests = await completedTests.find()
      .populate('studentId', 'firstname lastname') // Populate student details
      .populate('selectedCourse', 'name') // Populate course name
      .populate('selectedSubject', 'name') // Populate subject name
      .exec();

    res.status(200).json(completedTests); // Return completed tests as response
  } catch (error) {
    console.error('Error fetching completed tests:', error);
    res.status(500).json({ message: 'Failed to fetch completed tests' });
  }
});


module.exports = router;