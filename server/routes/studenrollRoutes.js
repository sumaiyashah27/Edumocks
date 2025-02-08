const express = require('express');
const router = express.Router();
const StudentEnroll = require('../models/studenroll-model');
const Student = require('../models/student-model');
const Course = require('../models/course-model');
const Subject = require('../models/subject-model');

// 🟢 GET all enrollments with populated student, course, and subjects
router.get('/', async (req, res) => {
    try {
        const enrollments = await StudentEnroll.find()
            .populate('studentId', 'firstname lastname') 
            .populate('selectedCourse', 'name') 
            .populate('selectedSubjects', 'name');

        res.json(enrollments);
    } catch (error) {
        console.error("❌ Error fetching enrollments:", error.message);
        res.status(500).json({ message: 'Error fetching enrollments' });
    }
});

// 🟢 Fetch all students
router.get('/student', async (req, res) => {
  try {
      const students = await Student.find();
      console.log("Fetched Students:", students); // Debugging
      res.json(students);
  } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: 'Error fetching students', error });
  }
});


// 🟢 Fetch all courses
router.get('/course', async (req, res) => {
    try {
        const courses = await Course.find().populate('subjects'); // Fetch courses with subjects
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
});

// 🟢 Fetch subjects for a specific course
router.get('/course/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('subjects'); 
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course.subjects); // Send only the subjects array
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
});


// 🟢 Enroll a student in a quiz
router.post('/enroll', async (req, res) => {
  try {
      const { enrollments } = req.body;

      console.log("📥 Received Enrollment Data from Frontend:", enrollments); // ✅ Dekho kya data aa raha hai

      if (!enrollments || !enrollments.length) {
          console.error("❌ No students provided for enrollment");
          return res.status(400).json({ message: 'No students provided for enrollment' });
      }

      const enrollmentPromises = enrollments.map(async (data) => {
          const { studentId, selectedCourse, selectedSubjects, paymentStatus, paymentId, amount, orderId } = data;

          if (!studentId || !selectedCourse || !selectedSubjects.length || !paymentStatus || !paymentId || !orderId) {
              console.error("⚠️ Invalid Data:", data);
              throw new Error('All fields are required');
          }

          console.log(`✅ Saving Enrollment for Student: ${studentId}`); // ✅ Dekho kaun kaun save ho raha hai

          const enrollment = new StudentEnroll({
              studentId,
              selectedCourse,
              selectedSubjects,
              paymentStatus,
              paymentId,
              amount,
              orderId
          });

          return enrollment.save();
      });

      await Promise.all(enrollmentPromises);

      console.log("🎉 All students successfully enrolled!");
      res.status(201).json({ message: 'All students successfully enrolled' });
  } catch (error) {
      console.error("❌ Enrollment Error:", error);
      res.status(500).json({ message: 'Error enrolling students', error });
  }
});
//================================================================
//-------------------🔴 Update Enrollment Status ----------------
// Fetch all enrollments for a Student
router.get("/:studentId", async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const enrollments = await StudentEnroll.find({ studentId });
  
      // Ensure the response structure matches your frontend expectations
      const formattedEnrollments = enrollments.map((enrollment) => ({
        ...enrollment.toObject(),
        selectedSubjects: Array.isArray(enrollment.selectedSubjects) ? enrollment.selectedSubjects : [],
      }));
  
      res.status(200).json({ message: "Enrollments fetched successfully", enrollments: formattedEnrollments });
    } catch (error) {
      console.error("Fetch enrollments error:", error);
      res.status(500).json({ message: "Failed to fetch enrollments", error });
    }
});
  
// 🔴 DELETE: Remove a subject from a student's enrollment
router.delete('/:studentId/:courseId/:subjectId', async (req, res) => {
  const { studentId, courseId, subjectId } = req.params;

  try {
      const enrollment = await StudentEnroll.findOne({ studentId, selectedCourse: courseId });

      if (!enrollment) {
          return res.status(404).json({ message: 'Enrollment not found' });
      }

      // Remove the subject from the selectedSubjects array
      enrollment.selectedSubjects = enrollment.selectedSubjects.filter(sub => sub.toString() !== subjectId);

      // If no subjects remain, remove the entire enrollment entry
      if (enrollment.selectedSubjects.length === 0) {
          await StudentEnroll.deleteOne({ _id: enrollment._id });
          return res.json({ message: 'Enrollment deleted as no subjects remain' });
      }

      await enrollment.save();
      res.json({ message: 'Subject removed successfully', enrollment });

  } catch (error) {
      console.error("❌ Error removing subject:", error);
      res.status(500).json({ message: 'Error removing subject', error });
  }
});
// POST route to save quiz enrollment
router.post('/', async (req, res) => {
    try {
        console.log('Received Enrollment Data:', req.body); // Debugging

        const {
            studentId,
            selectedCourse,
            selectedSubject,
            paymentStatus,
            paymentId,
            amount,
            orderId,
        } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Error: orderId is missing in the request" });
        }

        const enrollment = new StudentEnroll({
            studentId,
            selectedCourse,
            selectedSubject,
            paymentStatus,
            paymentId,
            amount,
            orderId,
        });

        await enrollment.save();
        res.status(200).json({ message: 'Enrollment saved successfully!' });

    } catch (error) {
        console.error('Error saving enrollment:', error);
        res.status(400).json({ message: 'Error saving enrollment', error });
    }
});

  
module.exports = router;