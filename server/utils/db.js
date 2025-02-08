require('dotenv').config();
const mongoose = require('mongoose'); // Load environment variables from .env file

// MongoDB URI
console.log(process.env.MONGO_URI)
const mongoURI = process.env.MONGO_URI;
console.log('MongoDB URI:', process.env.MONGO_URI);  // Log the URI to check if it's loaded


// Function to connect to MongoDB
const connectDB = async () => {
    try {
      //await mongoose.connect(mongoURI); // No additional options are needed
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,          // Use the new URL parser
        useUnifiedTopology: true,      // Use the new connection management engine
        serverSelectionTimeoutMS: 30000, // Timeout for connecting to MongoDB (30 seconds)
        socketTimeoutMS: 60000,         // Timeout for socket connections (1 minute)
      });
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1); // Exit process with failure
    }
  };
  
module.exports = connectDB;