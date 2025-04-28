const express = require('express');
const mongoose = require('mongoose');
const Queset = require('../models/queset-model');  // Adjust the path if needed
const Question = require('../models/question-model'); // Adjust the path if needed
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Route to add 100 questions under a Queset
router.post('/add-questions', async (req, res) => {
  try {
    const { quesetId, questionsData } = req.body;

    // Check if the Queset exists
    const queset = await Queset.findById(quesetId);
    if (!queset) {
      return res.status(404).json({ message: 'Queset not found' });
    }

    // Create an array of question documents
    const questions = questionsData.map(questionData => ({
      ...questionData,
      quesetId: quesetId, // Linking the question to the Queset
    }));

    // Create multiple questions at once using insertMany
    const createdQuestions = await Question.insertMany(questions);

    // Add the question references to the Queset
    queset.questions.push(...createdQuestions.map(q => q._id));

    // Save the updated Queset document
    await queset.save();

    res.status(201).json({
      message: `${createdQuestions.length} questions added successfully`,
      data: createdQuestions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding questions', error: err.message });
  }
});

// Route to get a Queset with its associated questions
router.get('/get-queset/:quesetId', authMiddleware, async (req, res) => {
  try {
    const { quesetId } = req.params;

    // Find the Queset and populate the questions field with the Question details
    const queset = await Queset.findById(quesetId).populate('questions');

    if (!queset) {
      return res.status(404).json({ message: 'Queset not found' });
    }

    // Return the Queset along with the populated questions
    res.status(200).json({
      message: 'Queset and questions fetched successfully',
      data: queset,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Queset', error: err.message });
  }
});

module.exports = router;