const express = require('express');
const cors = require('cors'); 
const path = require('path');
const connectDB = require("./utils/db");
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const quesetRoutes = require('./routes/quesetRoutes');
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const questionRoutes = require('./routes/questionRoutes'); 
const folderRoutes = require('./routes/folderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const studEnrollRoutes = require("./routes/studenrollRoutes");
const paymentRoutes = require("./routes/paymetRoutes");
const sendEmailRouter = require('./services/enrollemail');
const scheduleTestRoutes = require("./routes/scheduletestRoutes");
const delayTestRoutes = require('./routes/delayTestRoutes');
const emailRoutes = require("./routes/emailRoutes");
const checkAndSendReminders = require('./services/scheduler');
const studResultsRoutes = require('./routes/studResultsRoutes');
const teacherDashRoutes = require('./routes/teacherDashRoutes');
const completedTestRoutes = require('./routes/completetestRoutes'); 
const couponRoutes = require("./routes/couponRoutes");

require('dotenv').config();
const app = express();

// Body Parsing Middleware (Increase payload size limit)
app.use(express.json({ limit: '1150mb' })); // Increase limit if necessary
app.use(express.urlencoded({ limit: '1150mb', extended: true }));

// Middleware
app.use(cors({
  origin: ["https://edumocks.com", "https://www.edumocks.com", "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})); // Allow cross-origin requests

checkAndSendReminders(); // Check and send reminders every minute

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


app.use(express.json()); // Parse JSON request bodies

// Serve static images from the "images" folder (adjust the folder name if needed)
app.use('/images', express.static(path.join(__dirname, './image/'))); // Replace 'images' with your actual image folder
// Use the routes 
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/queset', quesetRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/subject", subjectRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/folders', folderRoutes);
app.use("/api/images", imageRoutes);
app.use('/api/studenroll', studEnrollRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/enrollmail', sendEmailRouter);
app.use("/api/scheduleTest", scheduleTestRoutes);
app.use("/api/delayTest",delayTestRoutes);
app.use("/api/email", emailRoutes);
app.use('/api/studResults', studResultsRoutes);
app.use('/api/teachdash', teacherDashRoutes); 
app.use('/api/completed', completedTestRoutes);
app.use("/api/coupon", couponRoutes);



// Serve the React client (in production)
if (process.env.NODE_ENV === 'production') {
  // Set static folder to 'client/build'
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Serve index.html for all routes that don't match API paths
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Define server port and listen
const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is now running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});