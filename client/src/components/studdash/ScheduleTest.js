import React, { useState, useEffect } from "react";
import "./css/ScheduleTest.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { faTimes, faClock, faEdit, faCalendarPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateTime } from 'luxon'

const ScheduleTest = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const studentId = localStorage.getItem('_id');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentEnrollData, setStudentEnrollData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [questionSet, setQuestionSet] = useState(''); // Default question set to 30
    const [testDate, setTestDate] = useState('');
    const [testTime, setTestTime] = useState('');
    const [scheduledTests, setScheduledTests] = useState([]); // Store scheduled tests
    const [timeError, setTimeError] = useState(''); // Error message for time validation
    const [delayModalOpen, setDelayModalOpen] = useState(false); // New state for delay modal
    const [selectedTest, setSelectedTest] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [testStatus, setTestStatus] = useState('Scheduled');
    const now = DateTime.local();
    console.log('Local Time:', now.toLocaleString(DateTime.DATETIME_FULL)); // Displays time based on local system settings
    console.log('Timezone:', now.zoneName);
  
    console.log('Student ID:', studentId);

    // Fetch student details, quiz enrollment data, and scheduled tests
    useEffect(() => {
      // Fetch student details
      const fetchStudentDetails = async (studentId) => {
        const token = localStorage.getItem('token'); // Get the token
        try {
          // const response = await axios.get(`/api/student/${studentId}`);
          const response = await axios.get(`/api/student/${studentId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const studentData = response.data;
          setStudentName(studentData.firstname);  // Debugging
          setStudentEmail(studentData.email); 
          setIsLoading(false);
          console.log('Student Data:', studentData);
        } catch (error) { console.error('Error fetching student details:', error);
          setIsLoading(false);
        }
      };

      const fetchQuizEnrollmentData = async (studentId) => {
        if (!studentId) return;
        const token = localStorage.getItem('token');
        try {
          // const response = await axios.get(`/api/studenroll/${studentId}`);
          const response = await axios.get(`/api/studenroll/${studentId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("API Response:", response.data); // Debugging
      
          if (response.data && Array.isArray(response.data.enrollments)) {
            setStudentEnrollData(response.data.enrollments);
          } else {
            console.error("Invalid response format:", response.data);
            setStudentEnrollData([]); // Fallback to an empty array
          }
        } catch (error) {
          console.error("Error fetching Student enrollment data:", error);
          setStudentEnrollData([]); // Prevent undefined state
        }
      };
      
      //Scheduled tests
      const fetchScheduledTests = async (studentId) => {
        if (!studentId) return;
        const token = localStorage.getItem('token');
        try { 
          // const response = await axios.get(`/api/scheduleTest/${studentId}`);
          const response = await axios.get(`/api/scheduleTest/${studentId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (Array.isArray(response.data)) {setScheduledTests(response.data);
          } else {toast.error('Expected an array, but received:', response.data);
          }
        } catch (error) {console.error('Error fetching scheduled tests:', error);
        }
      }

      console.log('scheduledTests',scheduledTests);
      //courses and subjects
      const fetchCoursesAndSubjects = async () => {
        const token = localStorage.getItem('token');
        try {
          // const courseResponse = await axios.get('/api/course');
          // const subjectResponse = await axios.get('/api/subject');
          const courseResponse = await axios.get('/api/course', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      
          const subjectResponse = await axios.get('/api/subject', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setCourses(courseResponse.data);
          console.log('courseResponse',courseResponse.data)
          console.log('subjectResponse',subjectResponse.data)
          setSubjects(subjectResponse.data);
        } catch (error) {console.error('Error fetching courses and subjects:', error);
        }
      };
      fetchCoursesAndSubjects();
      if (studentId) {
        fetchStudentDetails(studentId);
        fetchQuizEnrollmentData(studentId); 
        fetchScheduledTests(studentId); 
        fetchCoursesAndSubjects(); 
      }
    }, [studentId]);

    // //update the active tests
    // const formatEnrollmentData = () => {
    //   const activeTests = [];
    //   quizEnrollmentData.forEach((enrollment) => {
    //     enrollment.selectedSubject.forEach((subject) => {
    //       const testData = {course: enrollment.selectedCourse,subject: subject,amount: enrollment.amount,testStatus: enrollment.testStatus,
    //       };
    //       activeTests.push(testData);
    //     });
    //   });
    //   return { activeTests };
    // }; const { activeTests } = formatEnrollmentData();

    const formatEnrollmentData = () => {
      const activeTests = [];
    
      if (!Array.isArray(studentEnrollData)) {
        console.error("quizEnrollmentData is not an array:", studentEnrollData);
        return { activeTests };
      }
    
      studentEnrollData.forEach((enrollment) => {
        // Fix: Use "selectedSubjects" instead of "selectedSubject"
        if (!Array.isArray(enrollment.selectedSubjects)) {
          console.error("selectedSubjects is not an array for enrollment:", enrollment);
          return; // Skip invalid entries
        }
    
        enrollment.selectedSubjects.forEach((subject) => {
          const testData = {
            course: enrollment.selectedCourse,
            subject: subject, // Assuming this is an ObjectId or an object
            amount: enrollment.amount || 0, // Fallback if amount is missing
            testStatus: enrollment.testStatus || "Scheduled", // Default value
          };
          activeTests.push(testData);
        });
      });
    
      return { activeTests };
    };
    
    // Ensure formatEnrollmentData is not called before data is loaded
    const { activeTests } = studentEnrollData ? formatEnrollmentData() : { activeTests: [] };
    //console.log("Active Tests:", activeTests);
    
    console.log('activeTests',activeTests);

    // Define the handleScheduleTest function
    const handleScheduleTest = (course, subject) => {
      setSelectedCourse(course);
      setSelectedSubject(subject);
      setModalOpen(true);
    };
    // Filter the scheduled tests to get the completed tests
    const completedTests = scheduledTests.filter(test => test.testStatus === 'Completed');
     // Define the state variables
     const [selectTest, setSelectTest] = useState(null);
     const [remainingTime, setRemainingTime] = useState('');
     const [showEnterButton, setShowEnterButton] = useState(false);
      // Update the useEffect hook to include the selectTest state  
     useEffect(() => {
      if (selectTest?.testDate && selectTest?.testTime) {
        const testDate = new Date(selectTest.testDate); 
        const testTime = selectTest.testTime;
        const [hours, minutes] = testTime.split(':');
        
        testDate.setHours(hours);
        testDate.setMinutes(minutes);
        testDate.setSeconds(0); // Set seconds to 0 if required
    
        if (isNaN(testDate.getTime())) {
          toast.error('Invalid test date-time:', testDate); // If invalid date-time
          return; // Return if invalid date-time to avoid further calculations
        }
        const updateRemainingTime = () => {
          const now = new Date();
          const timeDiff = testDate - now;
  
          if (timeDiff <= 0) {
            setRemainingTime('');
            setShowEnterButton(true); // Show Enter Room button
            // Hide the "Enter Room" button after 1 hour
            setTimeout(() => {
              setShowEnterButton(false); // Hide the button after 1 hour
              updateTestStatus();
            }, 3600000); 
          } else {
            setShowEnterButton(false); // Hide Enter Room button
            const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsRemaining = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setRemainingTime(`${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`);
          }
        };
    
        updateRemainingTime();
        const interval = setInterval(updateRemainingTime, 1000);
    
        return () => clearInterval(interval); // Cleanup on unmount
      }
    },);
    // Define the handleConfirmSchedule function
    const handleConfirmSchedule = async () => {
      console.log('Selected Question Set:', questionSet); // This logs the selected value
    
      // Validate if the selected time is in the past
      const selectedDateTime = DateTime.fromISO(`${testDate}T${testTime}`, { zone: 'local' });
      // Remove .toUTC() to keep the time in the local zone.
      //const selectedDateTime = DateTime.fromISO(`${testDate}T${testTime}`, { zone: 'local' }).toUTC();
      const currentDateTime = DateTime.utc();
      // Convert to UTC for storage
      const selectedDateTimeUTC = selectedDateTime.toUTC();
  
      // Convert back to local time for display
      const displayTime = selectedDateTimeUTC.setZone('local').toFormat('HH:mm:ss');
      // Validate if all fields are filled out, including questionSet
      if (!testDate || !testTime || !questionSet) {
        if (!questionSet) {
          toast.error("Please select a question set.");
        } else {
          toast.error("Please fill out all the fields.");
        }
        return;
      }
      // Proceed with scheduling if validation passes
      setErrorMessage('');
      if (selectedDateTime <= currentDateTime) {
        toast.error('The selected time cannot be in the past.');
        return;
      }
      setTimeError(''); // Clear the error if the time is valid
      const testData = { 
        studentId: studentId,
        selectedCourse,
        selectedSubject,
        questionSet,  // This holds the selected value
        testDate: selectedDateTime.toISODate(),
        testTime: selectedDateTime.toISOTime(),
        testStatus: 'Scheduled',
      };
      // Optimistically update the UI
      const newScheduledTests = [...scheduledTests, testData];
      setScheduledTests(newScheduledTests);
      try {
        const response = await axios.post('/api/scheduleTest', testData);
        console.log('Test scheduled successfully:', response.data);
        setModalOpen(false);
        toast.success('Test scheduled successfully!');
      } catch (error) {
        console.error('Error scheduling test:', error);
        setScheduledTests(scheduledTests); // Revert to previous state if the request fails
        console.error('Failed to schedule test.');
      }
    };
  
    //define the handleDelayTest function
    const handleDelayTest = (course, subject) => {
      const test = scheduledTests.find(
        (test) => test.selectedCourse === course && test.selectedSubject === subject
      );
      setSelectedTest(test); // Store the test to be delayed
      setDelayModalOpen(true); // Open the delay modal
    };
    const delayAmount = 1;
    const handlePayDelay = () => {
      if (!testDate || !testTime) {
        setError(true); // Sets error state to true
        return; // Prevents proceeding if fields are empty
      }
      // Reset error state and proceed with paying delay logic
      toast.error(false);
      console.log("Navigating with test details:", {
        studentId: studentId,
        selectedCourse: selectedTest.selectedCourse,
        selectedSubject: selectedTest.selectedSubject,
        testDate,
        testTime,
        delayAmount,
      });
      navigate('/delaytestpayment', {
        state: {
          studentId: studentId,
          selectedCourse: selectedTest.selectedCourse,
          selectedSubject: selectedTest.selectedSubject,
          testDate,
          testTime,
          delayAmount,
        },
      });
  };
    // Modify the isTestScheduled function
    const isTestScheduled = (course, subject) => {
      // Check if the test is scheduled or completed for the current student and selected course/subject
      const existingTest = scheduledTests.some(
        (test) => 
          test.selectedCourse === course && 
          test.selectedSubject === subject
      );
      // If no existing test, return false
      if (!existingTest) return false;
      // Check if the test status is 'Scheduled'
      const testStatusScheduled = scheduledTests.some(
        (test) => test.selectedCourse === course && test.selectedSubject === subject && test.testStatus === 'Scheduled'
      );
      // If the test status is 'Scheduled', return true, else return false (for Completed tests)
      return testStatusScheduled;
    };  
  
    const getCourseName = (courseId) => {
      // const course = courses.find(c => c._id === courseId);
      const course = courses.find(c => c._id.trim() === courseId.trim());
      return course ? course.name : 'Course';
    };
  
    const getSubjectName = (subjectId) => {
      // const subject = subjects.find(s => s._id === subjectId);
      const subject = subjects.find(s => s._id.trim() === subjectId.trim());
      return subject ? subject.name : 'Subject';
    };
  ;
  
  const handleAttendTest = (course, subject) => {
    console.log('Attending Test for:', course, subject);
  
    // Save selected course and subject in localStorage
    localStorage.setItem('selectedCourse', course);
    localStorage.setItem('selectedSubject', subject);
  
    // Find the scheduled test that matches the clicked course and subject
    const scheduledTest = scheduledTests.find(
      (test) => test.selectedCourse === course && test.selectedSubject === subject && test.testStatus === 'Scheduled'
    );
  
    if (scheduledTest) {
      setSelectTest(scheduledTest);
      setQuestionSet(scheduledTest.questionSet);
      setTestTime(scheduledTest.testTime);
      setTestDate(scheduledTest.testDate);
  
      // Open the modal
      setIsModalOpen(true);
    } else {
      toast.error('Test not found for the given course and subject.');
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  
  const handleEnterRoom = async (course, subject) => {
    console.log('selectTest object:', selectTest);
    try {
      // Make a DELETE request to remove the specific subject from the backend
      const response = await axios.delete(`/api/studenroll/${studentId}/${course}/${subject}`);
      if (response.status === 200) {
        console.log('Subject removed successfully:', response.data);
        // Update the local state to reflect the change
        // Log existing data before modifying it
        console.log("Before update - studentEnrollData:", studentEnrollData);
        // Safe state update
        setStudentEnrollData((prevData) => {
          if (!Array.isArray(prevData)) {
              console.error("prevData is not an array:", prevData);
              return [];
          }

          return prevData.map((enrollment) =>
              enrollment.selectedCourse === course
                  ? {
                      ...enrollment,
                      selectedSubject: Array.isArray(enrollment.selectedSubject)
                          ? enrollment.selectedSubject.filter((sub) => sub !== subject)
                          : [],
                  }
                  : enrollment
          );
        });
        // Check if subjects for this course are empty, and if so, remove the entire enrollment entry
        setStudentEnrollData((prevData) => {
          if (!Array.isArray(prevData)) {
              console.error("prevData is not an array:", prevData);
              return [];
          }

          return prevData.filter(
              (enrollment) =>
                  enrollment.selectedCourse !== course || 
                  (Array.isArray(enrollment.selectedSubject) && enrollment.selectedSubject.length > 0)
          );
      });
        console.log("Navigating with data:", {
          studentId,
          studentName,
          studentEmail,
          selectedCourse: course,
          selectedSubject: subject
        });
        // Redirect to the test page
        navigate(`/test/${course}/${subject}`, {
          state: { studentId, 
            studentName, 
            studentEmail, 
            selectedCourse: course, 
            selectedSubject: subject },
        });
      }
      console.log("Navigating with data:", {
        studentId,
        studentName,
        studentEmail,
        selectedCourse: course,
        selectedSubject: subject
      });
      // navigate(`/test/${course}/${subject}`, {
      //   state: { studentId, studentName, studentEmail, selectedCourse: course, selectedSubject: subject },
      // });
    } catch (error) {
      toast.error('Error removing subject:', error);
      toast.error('Failed to remove subject. Please try again later.');
    }
  };
   // Function to update test status to "Delay" after 1 hour
   const updateTestStatus = async () => {
    try {
      const response = await axios.put('/api/scheduleTest/delay', {
        studentId: selectTest.studentId,
        selectedCourse: selectTest.selectedCourse,
        selectedSubject: selectTest.selectedSubject,
        testDate: testDate,
      });
  
      if (response.data) {
        setTestStatus('Delay'); // Update the status in frontend
        toast.error('Test status updated to Delay');
      }
    } catch (error) {
      console.error('Error updating test status:', error);
    }
  };
    return (
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f4f4f9'}}>
        <ToastContainer />
        {/* Display active tests (Quiz Enrollment) */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule Test</h3>
          {activeTests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
              <p style={{ fontSize: '1.2rem', color: '#7f8c8d', fontStyle: 'italic' }}>No active tests found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              {activeTests.map((test, index) => {
                const isScheduled = isTestScheduled(test.course, test.subject);
                return (
                  <div key={index} style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)', width: '300px', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s', overflow: 'hidden' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)'; }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#34495e', marginBottom: '15px' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px', padding: '8px', borderRadius: '8px', backgroundColor: '#ecf0f1', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', display: 'inline-block' }}> {getCourseName(test.course)}</p>
                      <p>{getSubjectName(test.subject)}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap'  }}>
                      {isScheduled ? (
                        <>
                          <button style={{ fontSize: '1rem', backgroundColor: 'rgb(16, 11, 92)', color: 'white', padding: '10px 10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s, transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(16, 11, 92)')} onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(16, 11, 92)')} onClick={() => handleAttendTest(test.course, test.subject)}><FontAwesomeIcon icon={faEdit} style={{ animation: 'bounce 1s ease-in-out infinite' }} /> Attend Test</button>
                          <button style={{ fontSize: '1rem', backgroundColor: 'rgb(200, 13, 24)', color: 'white', padding: '10px 10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s, transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(200, 13, 24)')} onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(200, 13, 24)')} onClick={() => handleDelayTest(test.course, test.subject)}><FontAwesomeIcon icon={faClock} style={{ animation: 'spin 1s linear infinite' }} /> Reschedule Test</button>
                        </>
                      ) : (
                        <>
                          <button style={{ fontSize: '1rem', backgroundColor: 'rgb(16, 11, 92)', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s, transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(16, 11, 92)')} onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(16, 11, 92)')} onClick={() => handleScheduleTest(test.course, test.subject)}><FontAwesomeIcon icon={faCalendarPlus} style={{ animation: 'pulse 1.5s infinite' }} /> Schedule Test</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
              <h2>Test Details</h2>
              {/* <p><strong>Course:</strong> {selectTest.selectedCourse}</p>
              <p><strong>Subject:</strong> {selectTest.selectedSubject}</p> */}
              <p><strong>Question Set:</strong> {selectTest.questionSet}</p>
              <p><strong>Test Time:</strong> {selectTest.testTime.split('.')[0]}</p>
              {/* <p><strong>Test Time:</strong> {selectTest.testTime}</p> */}
              <p><strong>Test Date:</strong> {new Date(selectTest.testDate).toLocaleDateString()}</p>
              {!showEnterButton && remainingTime && <p style={{ color: 'red', fontWeight: 'bold' }}>Countdown: {remainingTime}</p>}
              {showEnterButton && (
                <button onClick={() => handleEnterRoom(selectTest.selectedCourse, selectTest.selectedSubject)} 
                  style={{ padding: '10px 20px', backgroundColor: 'rgb(16, 11, 92)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: '20px' }}>
                  Enter Room
                </button>
              )}
              <button onClick={handleCloseModal} 
                style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: '10px', marginLeft: '10px' }}>
                Close
              </button>
            </div>
          </div>
        )}
        {/* Modal for scheduling the test */}
        {modalOpen && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', position: 'relative', animation: 'fadeIn 0.3s ease' }}>
              <button onClick={() => { setModalOpen(false); setQuestionSet('30'); setTestDate(''); setTestTime(''); }} style={{ position: 'absolute', top: '9px', right: '12px', backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#333' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: '20px' }}>Schedule Test</h3>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#555' }}>Course:</label>
                <span style={{ fontSize: '1.1rem', color: '#333' }}>{getCourseName(selectedCourse)}</span>
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#555' }}>Subject:</label>
                <span style={{ fontSize: '1.1rem', color: '#333' }}>{getSubjectName(selectedSubject)}</span>
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Question Set:</label>
                <select value={questionSet} onChange={(e) => setQuestionSet(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', color: '#333', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} >
                  {getCourseName(selectedCourse).toUpperCase().includes("LEVEL 1") ? (
                    <>
                      <option value="" disabled>select</option>
                      <option value="30">30 Questions</option>
                      <option value="60">60 Questions</option>
                      <option value="90">90 Questions</option>
                    </>
                  ) : (
                    <>
                      <option value="" disabled>select</option>
                      <option value="44">44 Questions</option>
                    </>
                  )}
                </select>
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Test Date:</label>
                <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} min={DateTime.now().toFormat('yyyy-MM-dd')} style={{ width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', color: '#333', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                />
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Test Time:</label>
                <input type="time" value={testTime} onChange={(e) => setTestTime(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', color: '#333', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                {timeError && <div style={{ color: 'red', marginTop: '10px', fontSize: '1rem' }}>{timeError}</div>}
              </div>
  
              {errorMessage && <div style={{ color: 'red', marginBottom: '15px', fontSize: '1rem' }}>{errorMessage}</div>}
              <p><strong style={{ color: "red" }}>NOTE:-</strong> Please ensure you attend the test on time. Rescheduling will incur a charge of $1.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={handleConfirmSchedule}
                  style={{ fontSize: '1.1rem', backgroundColor: '#28a745', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                >Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {delayModalOpen && selectedTest && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', position: 'relative', animation: 'fadeIn 0.3s ease' }}>
              
              <button onClick={() => { setDelayModalOpen(false); setTestDate(''); setTestTime(''); }} style={{ position: 'absolute', top: '9px', right: '12px', backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#333' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              
              <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: '20px' }}>Resheduled Tests</h3>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#555' }}>Course:</label>
                <span style={{ fontSize: '1.1rem', color: '#333' }}>{getCourseName(selectedTest.selectedCourse)}</span>
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#555' }}>Subject:</label>
                <span style={{ fontSize: '1.1rem', color: '#333' }}>{getSubjectName(selectedTest.selectedSubject)}</span>
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Test Date:</label>
                <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', color: '#333', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                {error && !testDate && <div style={{ color: 'red', marginTop: '10px' }}>Test date is required.</div>}
              </div>
  
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Test Time:</label>
                <input type="time" value={testTime} onChange={(e) => setTestTime(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', color: '#333', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
              </div>
  
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handlePayDelay} style={{ fontSize: '1.1rem', backgroundColor: '#28a745', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>Pay $1 Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
export default ScheduleTest;
