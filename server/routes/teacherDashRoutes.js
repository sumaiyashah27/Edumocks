const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the models for Student, ScheduleTest, and DelayTest
const Student = require('../models//student-model'); // Update with correct path
const ScheduleTest = require('../models/scheduletest-model'); // Update with correct path
const DelayTest = require('../models/delaytest-model'); // Update with correct path

// Route to get counts of students, scheduled tests, and delayed tests
router.get('/teacherDashCounts', async (req, res) => {
  try {
    // Count total number of students
    const studentCount = await Student.countDocuments();

    // Count total number of scheduled tests
    const scheduleTestCount = await ScheduleTest.countDocuments();

    // Count total number of delayed tests
    const delayTestCount = await DelayTest.countDocuments();

    // Return the counts as a JSON response
    res.json({
      studentCount,
      scheduleTestCount,
      delayTestCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

module.exports = router;
