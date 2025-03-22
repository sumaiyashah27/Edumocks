const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  quesets: [{ _id: mongoose.Schema.Types.ObjectId, name: String }] // Store queset details
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);