const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// Define the Student schema (no counter or studTestId)
const studentSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  countryCode: { type: String, default: '' },  // Country code for phone number
  phone: { type: String, default: '' },  // Phone number without country code
  fullPhoneNumber: { type: String, default: '' },  // Full phone number including country code
  password: { type: String, default: '' }, // Optional field for password
  googleId: { type: String, default: '' }, // Google User ID
  testCode: { type: String, default: 'CFATEST' },
  timezone: { type: String, required: true, default: 'UTC' }  // Add timezone field
});

// Pre-save hook to generate the full phone number
studentSchema.pre('save', async function (next) {
  // Generate the full phone number by combining countryCode and phone
  this.fullPhoneNumber = `${this.countryCode}${this.phone}`;

  next();
});

// Compare password method for login
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

// Export the Student model
module.exports = Student;

