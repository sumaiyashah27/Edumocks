const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Added price field
    description: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
