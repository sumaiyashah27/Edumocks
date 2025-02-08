const express = require('express');
const router = express.Router();
const CompletedTest = require('../models/completedTest'); // Import the CompletedTest model

// POST route to save completed test data
router.post('/saveCompletedTest', async (req, res) => {
  const {
    studentId,
    selectedCourse,
    selectedSubject,
    questionSet,
    testDate,
    testTime,
    score,
    studentAnswers,
  } = req.body;

  try {
    // Create a new completed test document
    const completedTest = new CompletedTest({
      studentId,
      selectedCourse,
      selectedSubject,
      questionSet,
      testDate,
      testTime,
      score,
      studentAnswers,
    });

    // Save the completed test document to the database
    await completedTest.save();
    res.status(201).json({ message: 'Test saved successfully!', completedTest });
  } catch (error) {
    console.error('Error saving completed test:', error);
    res.status(500).json({ message: 'Error saving completed test' });
  }
});

module.exports = router;
