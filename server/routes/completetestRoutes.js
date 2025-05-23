const express = require('express');
const multer = require('multer');
const router = express.Router();
const CompletedTest = require('../models/completetest-model'); // Import the model
const questionModel = require('../models/question-model');
const authMiddleware = require('../middleware/authMiddleware');

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

// GET route to retrieve all completed test results
router.get('/getCompletedTests', authMiddleware , async (req, res) => {
  try {
    const completedTests = await CompletedTest.find()
      .populate('studentId', 'firstname lastname') // Populate student details
      .populate('selectedCourse', 'name') // Populate course details
      .populate('selectedSubject', 'name') // Populate subject details
      .populate({
        path: 'studentAnswers.questionId',  // Populate full question details
        model: 'Question',
      });

    res.status(200).json(completedTests);
  } catch (error) {
    console.error('Error fetching completed test results:', error);
    res.status(500).json({ message: 'Error fetching completed test results' });
  }
});

module.exports = router;