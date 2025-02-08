const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Counter Schema for auto-incrementing Teacher ID (using 'name' instead of '_id')
const counterTeacherSchema = new Schema({
  name: { type: String, required: true, unique: true }, // Name field to identify the counter
  currentId: { type: Number, default: 1001 }, // Default starting ID
});

// Prevent overwriting the model
const CounterTeacher = mongoose.models.CounterTeacher || mongoose.model('CounterTeacher', counterTeacherSchema);

// Teacher Schema
const teacherSchema = new Schema({
  teachId: { type: String, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  countryCode: { type: String, default: '' },
  phone: { type: String, default: '' },
  fullPhoneNumber: { type: String, default: '' },
  googleId: { type: String, default: '' },
  password: { type: String, default: '' },
});

// Pre-save hook to generate teachId
teacherSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Use findOneAndUpdate with 'name' instead of '_id'
      const counter = await CounterTeacher.findOneAndUpdate(
        { name: 'teacher' }, // Use 'name' as the identifier for the counter
        { $inc: { currentId: 1 } }, // Increment the currentId by 1
        { new: true, upsert: true } // Create if it doesn't exist
      );

      if (counter) {
        // Generate the next teachId (e.g., T001, T002, etc.)
        const nextId = String(counter.currentId).padStart(3, '0');
        this.teachId = `T${nextId}`;
      } else {
        throw new Error('Counter not found or created');
      }
    } catch (error) {
      next(error);
    }
  }

  // Set fullPhoneNumber before saving
  this.fullPhoneNumber = `${this.countryCode}${this.phone}`;
  next();
});

// Compare password method for login
teacherSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with the hashed password
};

// Create the Teacher model
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = { Teacher, CounterTeacher };
