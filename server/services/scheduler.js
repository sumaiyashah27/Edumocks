const { DateTime } = require('luxon');
const cron = require('node-cron');
const ScheduleTest = require('../models/scheduletest-model');
const Student = require('../models/student-model'); // Use 'Student' instead of 'User'
const sendEmail = require('../utils/sendEmail');

const sendReminderEmail = async (student, test, reminderType) => {
  const { testDate, testTime } = test;
  
  // Combine testDate and testTime into a full DateTime object (UTC)
  const testDateTime = DateTime.fromISO(`${testDate.toISOString().split('T')[0]}T${testTime}`, { zone: 'utc' });

  if (!testDateTime.isValid) {
    console.log(`❌ Invalid testDateTime for testId: ${test._id}`);
    return;
  }

  // Convert to student's timezone
  const studentTimezone = student.timezone || 'UTC';
  const localTestDateTime = testDateTime.setZone(studentTimezone);

  // Format the date and time for the student's timezone
  // const formattedDate = localTestDateTime.toLocaleString(DateTime.DATE_FULL);
  // const formattedTime = localTestDateTime.toLocaleString(DateTime.TIME_SIMPLE);
  const formattedDate = localTestDateTime.toFormat('dd MMMM yyyy');
  // const formattedTime = testTime;//localTestDateTime.toFormat('hh:mm a');
  const formattedTime = DateTime.fromFormat(testTime.split(':').slice(0, 2).join(':'), 'HH:mm').toFormat('hh:mm a'); // Converts to 12-hour format with AM/PM


  const reminderSubject = `${reminderType} Test Reminder ⏰`;
  const reminderMessage = `
    Dear ${student.firstname},

    The countdown is on! Your test starts in just ${reminderType === '1-Hour' ? '1 hour' : '24 hours'}. Get ready to show what you’ve learned.

    **Test Details:**
    - 📅 Date: ${formattedDate}  
    - ⏰ Time: ${formattedTime}  

    **Instructions:**
    - Be ready at least 10 minutes before the test starts.
    - Ensure a stable internet connection.
    - Be in a quiet, distraction-free environment.

    Important Note:
    ⏳ Rescheduling is available for $3. Please make sure to attend your test on time. If you need to reschedule, you can do so before the test begins.

    👉 [Click Here to Start Your Test](https://edumocks.com/)  

    If you have any questions, reach out to us.

    **Best of luck,**  
    *The Edumocks Team*  
    [https://edumocks.com/]
  `;

  await sendEmail(student.email, reminderSubject, reminderMessage);
};

const checkAndSendReminders = async () => {
  try {
    const now = DateTime.utc();
    console.log('🔄 Running Reminder Job at:', now.toISO());

    // Fetch all scheduled tests that are not yet reminded
    const allTests = await ScheduleTest.find({
      testStatus: 'Scheduled',
      $or: [{ reminderSent24Hours: false }, { reminderSent1Hour: false }]
    });

    for (const test of allTests) {
      const { studentId, testDate, testTime, reminderSent24Hours, reminderSent1Hour } = test;

      // Fetch student details
      const student = await Student.findById(studentId);
      if (!student) {
        console.log(`⚠️ Student not found for testId: ${test._id}`);
        continue;
      }

      // Combine testDate and testTime into a full DateTime object (UTC)
      const testDateUTC = DateTime.fromJSDate(testDate, { zone: 'utc' });

      // Validate testTime format
      if (!testTime || typeof testTime !== 'string') {
        console.error(`❌ Invalid testTime format for testId: ${test._id}, received:`, testTime);
        continue;
      }

      // Extract only the time part from testTime
      const extractedTestTime = testTime.split(':').slice(0, 2).join(':');
      // const testTimeObj = DateTime.fromFormat(testTime, 'HH:mm', { zone: 'utc' });
      const testTimeObj = DateTime.fromFormat(extractedTestTime, 'HH:mm', { zone: 'utc' });
      if (!testTimeObj.isValid) {
        console.error(`❌ Failed to parse testTime for testId: ${test._id}, received:`, testTime);
        continue;
      }

      // Merge testDate (UTC) with testTime (local time)
      const testDateTime = testDateUTC.set({
        hour: testTimeObj.hour,
        minute: testTimeObj.minute,
        second: testTimeObj.second
      });

      if (!testDateTime.isValid) {
        console.log(`❌ Invalid testDateTime for testId: ${test._id}, Raw Data:`, testDate, testTime);
        continue;
      }

      console.log(`✅ Valid testDateTime: ${testDateTime.toISO()} for testId: ${test._id}`);

      // Convert to student's timezone
      const studentTimezone = student.timezone || 'UTC';
      const testDateTimeLocal = testDateTime.setZone(studentTimezone);
      const timeDiff = testDateTimeLocal.diff(now, 'milliseconds').milliseconds;
        
      // Skip past tests
      if (timeDiff <= 0) {
        console.log(`⏳ Test already passed for testId: ${test._id}`);
        continue;
      }

      // Send 24-hour reminder if within the 24-hour window
      if (!reminderSent24Hours && timeDiff <= 86400000 && timeDiff > 3600000) {
        await sendReminderEmail(student, test, '24-Hour');
        test.reminderSent24Hours = true;
        await test.save();
        console.log(`✅ 24-hour reminder sent for testId: ${test._id}`);
      }

      // Send 1-hour reminder if within the 1-hour window
      if (!reminderSent1Hour && timeDiff <= 3600000) {
        await sendReminderEmail(student, test, '1-Hour');
        test.reminderSent1Hour = true;
        await test.save();
        console.log(`✅ 1-hour reminder sent for testId: ${test._id}`);
      }
    }
  } catch (error) {
    console.error('❌ Error sending reminders:', error);
  }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', () => {
  console.log('⏳ Running scheduled reminder job...');
  checkAndSendReminders();
});

module.exports = checkAndSendReminders;
