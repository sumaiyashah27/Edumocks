const mongoose = require('mongoose');

const quesetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true,},
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question', // Reference to the Question schema
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Queset', quesetSchema);
