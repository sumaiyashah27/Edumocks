const express = require('express');
const Question = require('../models/question-model'); // Initialize the router
const Subject = require("../models/subject-model");
const Queset = require("../models/queset-model");
const router = express.Router();

// Get all subjects with questions
router.get("/", async (req, res) => {
    try {
        const subjects = await Subject.find().populate("questions");
        res.status(200).json(subjects);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
});
 // Add a new subject
router.post("/", async (req, res) => {
    const { name, price, questions = [] } = req.body; // Removed chapters, now using questions
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    try {
      const newSubject = new Subject({ name, price, questions });
      await newSubject.save();
      res.status(201).json(newSubject);
    } catch (error) {
      console.error("Error adding subject:", error);
      res.status(500).json({ message: "Error adding subject", error: error.message });
    }
  });
// Update a subject by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // Only update the name field
    try {
      const updatedSubject = await Subject.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedSubject) {
          return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json(updatedSubject);
    } catch (error) {
        console.error("Error updating subject:", error);
        res.status(500).json({ message: "Error updating subject", error: error.message });
    }
});
// Delete a subject by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json({ message: "Subject deleted" });
    } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
});

// Route to fetch a subject by ID
router.get("/:id", async (req, res) => {
    console.log("Subject ID:", req.params.id); // Debugging
    try { const subject = await Subject.findById(req.params.id);
      if (!subject) return res.status(404).json({ message: "Subject not found" });
      res.status(200).json(subject);
    } catch (err) {
      console.error("Error fetching subject:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
 
// Example of returning an array of questions
router.get("/questions", async (req, res) => {
  const subjectId = req.query.subjectId;

  try {
    // Fetch subject by ID and populate the questions field
    const subject = await Subject.findById(subjectId).populate('questions'); // Populate questions
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    const questions = subject.questions; // Get the populated questions
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for the selected subject" });
    }

    console.log('Fetched Questions:', questions); // Debugging to check the fetched questions
    res.status(200).json(questions); // Return the questions
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
});

router.get('/:subjectId/questions', async (req, res) => {
  const { subjectId } = req.params;

  try {
    // Find the subject by ID and populate its questions
    const subject = await Subject.findById(subjectId).populate('questions');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Return the questions of the subject
    res.json(subject.questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE route to remove a question from a subject
router.delete("/:subjectId/questions/:questionId", async (req, res) => {
  const { subjectId, questionId } = req.params;

  try {
    // Find the subject by ID
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Find the question within the subject's questions array
    const questionIndex = subject.questions.findIndex(
      (q) => q._id.toString() === questionId
    );
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found in the subject" });
    }

    // Remove the question from the array
    subject.questions.splice(questionIndex, 1);

    // Save the updated subject
    await subject.save();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add questions from a queset to a subject
router.post('/:subjectId/add-queset-questions', async (req, res) => {
  const { subjectId } = req.params;
  const { quesetId } = req.body;  // We expect the quesetId in the request body

  try {
    // Find the subject by its ID
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Find the queset by its ID
    const queset = await Queset.findById(quesetId).populate('questions');
    if (!queset) {
      return res.status(404).json({ error: 'Queset not found' });
    }

    // Add all the questions from the queset into the subject's questions array
    subject.questions.push(...queset.questions.map(question => question._id));

    // Save the updated subject
    await subject.save();

    res.status(200).json({ message: 'Questions from queset added to subject' });
  } catch (error) {
    console.error('Error adding queset questions to subject:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;