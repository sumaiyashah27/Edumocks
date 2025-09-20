// server/scripts/initPositions.js
const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('../models/course-model');

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const courses = await Course.find().sort({ createdAt: 1, _id: 1 });
  const ops = courses.map((c, idx) => ({
    updateOne: {
      filter: { _id: c._id },
      update: { $set: { position: idx } }
    }
  }));

  if (ops.length) {
    const res = await Course.bulkWrite(ops);
    console.log('Initialized positions:', res.nModified || res.modifiedCount || 'done');
  } else {
    console.log('No courses found to initialize.');
  }
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
