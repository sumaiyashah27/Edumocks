// server/routes/courseRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/course-model');
const Subject = require('../models/subject-model');
// const QuizEnroll = require('../models/quizenroll-model');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure image directory name matches path used in DB (use "course-images")
const courseImagesDir = path.join(__dirname, '..', 'course-images');
if (!fs.existsSync(courseImagesDir)) {
  fs.mkdirSync(courseImagesDir, { recursive: true });
}

// Multer setup
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, courseImagesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, `course-${Date.now()}${ext}`);
  },
});
const courseFileFilter = (req, file, cb) => {
  const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
  cb(ok ? null : new Error('Only image files allowed'), ok);
};
const uploadCourseImage = multer({ storage: courseStorage, fileFilter: courseFileFilter });

/**
 * IMPORTANT: Place /reorder before any param routes like '/:courseId' or '/:id'
 * so Express doesn't interpret 'reorder' as a param value.
 */
router.put('/reorder', authMiddleware, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ message: 'Order must be an array' });
    }

    // Validate IDs first
    const invalid = order.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalid) {
      return res.status(400).json({ message: 'Invalid ObjectId in order', invalid });
    }

    // Build bulk operations: set position = index
    const ops = order.map((id, idx) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position: idx } },
      },
    }));

    if (ops.length === 0) {
      return res.json({ message: 'No changes' });
    }

    const bulkResult = await Course.bulkWrite(ops, { ordered: true });
    return res.json({ message: 'Order updated', result: bulkResult });
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
});

// Create Course with optional image
router.post('/', uploadCourseImage.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? `/course-images/${req.file.filename}` : '';
    const course = new Course({ name, price, description, image });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating course', error });
  }
});

// Update Course with optional new image
router.put('/:id', uploadCourseImage.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updates = { name, price, description };

    if (req.file) {
      // delete old image if exists
      const existing = await Course.findById(req.params.id).select('image');
      if (existing?.image?.startsWith('/course-images/')) {
        const oldPath = path.join(courseImagesDir, path.basename(existing.image));
        fs.unlink(oldPath, () => {}); // ignore errors
      }
      updates.image = `/course-images/${req.file.filename}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating course', error });
  }
});

// GET all courses sorted by position, with populated subjects/questions
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ position: 1 }) // persist order from DB
      .populate({
        path: 'subjects',
        populate: { path: 'questions' },
      });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Add subjects to course
router.put('/:courseId/add-subject', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { subjectIds } = req.body;

    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({ message: 'No subjects provided' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const subjects = await Subject.find({ _id: { $in: subjectIds } });
    const foundSubjectIds = subjects.map(s => s._id.toString());
    const missing = subjectIds.filter(id => !foundSubjectIds.includes(id));
    if (missing.length > 0) {
      return res.status(404).json({ message: 'Some subjects not found', missing });
    }

    await Course.findByIdAndUpdate(courseId, { $addToSet: { subjects: { $each: subjectIds } } }, { new: true });
    res.status(200).json({ message: 'Subjects added successfully' });
  } catch (error) {
    console.error('Error adding subjects to course', error);
    res.status(500).json({ message: 'Error adding subjects to course', error });
  }
});

// Remove subject from course (requires password)
router.put('/:courseId/remove-subject', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { subjectId, password } = req.body;

    if (password !== process.env.DELETE_SECRET_PASSWORD) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.subjects = course.subjects.filter(sub => sub._id.toString() !== subjectId);
    await course.save();

    res.status(200).json({ message: 'Subject removed successfully', course });
  } catch (error) {
    console.error('Error removing subject from course', error);
    res.status(500).json({ message: 'Error removing subject from course', error });
  }
});

// Delete course with password
router.post('/delete-with-password', async (req, res) => {
  const { courseId, password } = req.body;
  if (password !== process.env.DELETE_SECRET_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course', error);
    res.status(500).json({ message: 'Error deleting course', error });
  }
});

// Get course details (populated)
router.get('/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({
      path: 'subjects',
      populate: { path: 'questions' },
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course details', error);
    res.status(500).json({ message: 'Error fetching course details', error });
  }
});

// Optional endpoint: fetch subjects by course query param
router.get('/api/subjects', authMiddleware, (req, res) => {
  const { courseId } = req.query;
  Subject.find({ course: courseId })
    .then(subjects => res.json(subjects))
    .catch(error => res.status(500).json({ message: 'Error fetching subjects', error }));
});

// A few alternative routes left in place (if your frontend uses them)
router.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ position: 1 }).populate('subjects');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// export router
module.exports = router;
