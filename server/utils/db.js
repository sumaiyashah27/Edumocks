require('dotenv').config();
const mongoose = require('mongoose'); // Load environment variables from .env file

// MongoDB URI
console.log(process.env.MONGO_URI)
const mongoURI = process.env.MONGO_URI;
console.log('MongoDB URI:', process.env.MONGO_URI);  // Log the URI to check if it's loaded


// Function to connect to MongoDB
const connectDB = async () => {
    try {
      await mongoose.connect(mongoURI); // No additional options are needed
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1); // Exit process with failure
    }
  };
  
module.exports = connectDB;