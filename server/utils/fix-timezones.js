require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Student = require('../models/student-model'); // Adjust the path if needed

// Use environment variable for MongoDB URI
const mongoURI = process.env.MONGO_URI;

const updateMissingTimezones = async () => {
  try {
    // Ensure mongoURI is loaded
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected successfully');

    // Update students with missing timezones
    const result = await Student.updateMany(
      { timezone: { $exists: false } },  // Find students without a timezone field
      { $set: { timezone: 'UTC' } } // Set default timezone to UTC
    );

    console.log(`✅ Updated ${result.modifiedCount} student records with missing timezones.`);

    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error updating students:', error.message);
    process.exit(1);
  }
};

// Run the function
updateMissingTimezones();
