require('dotenv').config();
const mongoose = require('mongoose');

// Log the environment variable to confirm it's loaded
console.log('🔍 MongoDB URI:', process.env.MONGO_URI || 'Not Found');

// Ensure the URI is loaded
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file.');
  process.exit(1);
}

const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,        
        useUnifiedTopology: true,     
        serverSelectionTimeoutMS: 30000, // 30s timeout for initial connection
        socketTimeoutMS: 60000,         // 60s timeout for operations
      });

      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error.message);
      process.exit(1); // Exit process with failure
    }
};

// Debugging: Check connection status
mongoose.connection.on('connected', () => console.log('✅ Mongoose connected.'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose disconnected.'));

module.exports = connectDB;
