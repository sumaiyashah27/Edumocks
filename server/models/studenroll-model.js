const mongoose = require('mongoose');

const StudentEnrollSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Single student
  selectedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  selectedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }],
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], required: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, default: 0 },
  orderId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StudentEnroll', StudentEnrollSchema);
