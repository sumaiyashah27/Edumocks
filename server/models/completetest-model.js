const mongoose = require('mongoose');

// Define the CompletedTest Schema
const completedTestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user in MongoDB
    required: true,
    ref: 'Student', // Reference to the User collection
  },
  selectedCourse: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the course in MongoDB
    required: true,
    ref: 'Course', // Reference to the Course collection
  },
  selectedSubject: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the subject in MongoDB
    required: true,
    ref: 'Subject', // Reference to the Subject collection
  },
  questionSet: {
    type: Number, // The number of questions (30, 90, or 120)
    required: true, // Enum to restrict the values to 30, 90, or 120
  },
  testDate: {
    type: Date, // The date for the test
    required: true,
  },
  testTime: {
    type: String, // The time for the test (in HH:mm format)
    required: true,
  },
  score: {
    type: Number, // The score achieved in the test
    default: 0, // Default score is 0
    required: true,
  },
  // Store the student's answers and their correctness
  studentAnswers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the question in MongoDB
      required: true,
      ref: 'Question', // Reference to the Question collection
    },
    selectedAnswer: {
      type: String, // Reference to the selected answer
      required: true,
      ref: 'Answer', // Reference to the Answer collection
    },
    isCorrect: {
      type: Boolean, // Flag indicating whether the selected answer is correct
      required: true,
    }
  }],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the CompletedTest model
const CompletedTest = mongoose.model('CompletedTest', completedTestSchema);

module.exports = CompletedTest;