import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Dashboard.css';
import axios from 'axios';
import DoughnutChart from './DoughnutChart'; // Update path if needed
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaDownload } from "react-icons/fa"

const DashBoard = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [tests, setTests] = useState([]);
  const [grade, setGrade] = useState('');
  const [status, setStatus] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [goodScore, setGoodScore] = useState(0);
  const [poorScore, setPoorScore] = useState(0);
  const studentId = localStorage.getItem('_id');
  const [rowsToShow, setRowsToShow] = useState(3);
  const [results, setResults] = useState([]);

  console.log('results', results);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        // const response = await axios.get('/api/course'); // Backend endpoint
        const response = await axios.get('/api/course', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        // Fetch subjects for the specific course ID
        // const response = await axios.get(`/api/subject`);
        const response = await axios.get(`/api/subject`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSubjects(response.data); // Update the `subjects` state with the fetched data
      } catch (error) {
        console.error('Error fetching Topics:', error);
      }
    };


    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        // const response = await axios.get(`/api/scheduleTest/${studentId}`); // Fetch tests for the user
        const response = await axios.get(`/api/scheduleTest/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const completedTests = response.data.filter(test => test.testStatus === 'Completed'); // Filter completed tests
        setTests(completedTests); // Set tests to state
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchCourses();
    fetchSubjects();
    fetchTests();
  }, [studentId]);

  console.log('tests', tests);

  // Get course name by courseId
  const getCourseName = (courseId) => {
    const course = courses.find((course) => course._id === courseId);
    return course ? course.name : '';
  };

  // Get subject name by subjectId
  const getSubjectName = (subjectId) => {
    const subject = subjects.find((subject) => subject._id === subjectId);
    return subject ? subject.name : '';
  };

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token'); // Get the token
      try {
        // const { data } = await axios.get("/api/completed/getCompletedTests");
        const { data } = await axios.get("/api/completed/getCompletedTests", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setResults(data);
      } catch (error) {
      }
    };

    fetchResults();
  }, []);


  // Handle course selection
  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
    setSelectedSubjectId(''); // Reset selected subject when course changes
  };

  // Handle subject selection
  const handleSubjectChange = (e) => {
    setSelectedSubjectId(e.target.value);
  };

  const selectedCourse = courses.find((course) => course._id === selectedCourseId);

  // Function to evaluate grade and status based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) {
      return { grade: 'AAA', status: 'Exceptional Performance' };
    }
    if (percentage >= 80) {
      return { grade: 'AA', status: 'Outstanding Effort' };
    }
    if (percentage >= 70) {
      return { grade: 'BBB', status: 'Passed with Confidence' };
    }
    if (percentage >= 60) {
      return { grade: 'BB', status: 'Borderline Safe' };
    }
    if (percentage >= 50) {
      return { grade: 'C', status: 'Needs Improvement' };
    }
    return { grade: 'D', status: 'Reassess and Rebuild' };
  };

  // Function to handle 'Load More' button click
  const handleLoadMore = () => {
    setRowsToShow(prevRows => prevRows + 3);
  };

  // Calculate if there are more rows to display
  const hasMoreRows = tests.length > rowsToShow;

  useEffect(() => {
    if (tests.length > 0) {
      const firstSubjectId = tests[tests.length - 1].selectedSubject; // First subject based on reversed order
      setSelectedSubjectId(firstSubjectId);

      // Automatically trigger the logic for first subject
      const subjectTests = tests.filter((test) => test.selectedSubject === firstSubjectId);

      if (subjectTests.length > 0) {
        const totalScore = subjectTests.reduce((sum, test) => sum + test.score, 0);
        const totalQuestions = subjectTests.reduce((sum, test) => sum + test.questionSet, 0);
        const percentage = (totalScore / totalQuestions) * 100;
        const { grade, status } = getGrade(percentage);

        setGrade(grade);
        setStatus(status);
        setGoodScore(percentage);
        setPoorScore(100 - percentage);
        setTotalScore(totalScore);
        setTotalQuestions(totalQuestions);
      } else {
        setGrade("N/A");
        setStatus("No Data");
        setGoodScore(0);
        setPoorScore(100);
        setTotalScore(0);
        setTotalQuestions(0);
      }
    }
  }, [tests]);

  return (
    <div className="container dashboard-container" style={{ height: 'auto' }}>
      {/* Main Content */}
      <div className="row mt-3 content-row">
        <div className="col-md-12 col-sm-12">
          <div className="row" style={{ height: 'auto' }}>
            {/* First Column: Dropdown Menus */}
            <div className="col-md-8 col-sm-12">
              <div className="row">
                <div className="col-12 p-3 d-flex justify-content-center">
                  {/* Course Dropdown */}
                </div>
              </div>

              <div className="row d-flex align-items-center justify-content-center data-container" style={{ height: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
                  <thead style={{ backgroundColor: "#1D1A6D", color: "#FFD700" }}>
                    <tr>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>COURSE</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>TOPIC</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>SCORE</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>%</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Grade</th>
                      {/* <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>  */}
                      {/* New Column */}
                    </tr>
                  </thead>
                  <tbody>
                    {[...tests].reverse().map((test, index) => {
                      const percentage = (test.score / test.questionSet) * 100;
                      const { grade, status } = getGrade(percentage);

                      return (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                            {getCourseName(test.selectedCourse)}
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                            {getSubjectName(test.selectedSubject)}
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{test.score}</td>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                            {percentage.toFixed(2)}%
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{grade}</td>
                          {/* <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                            <button
                              // onClick={() => downloadPDF(test)} // Call the function to generate PDF
                              className="btn btn-light btn-sm"
                              title="Download PDF"
                            >
                              <FaDownload size={16} color="#1D1A6D" />
                            </button>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Second Column: Other Content */}
            <div className="col-md-4 col-sm-12">
              <div className="row">
                {/* Subject Dropdown 2*/}
                <div className="col-12">
                  <select
                    id="subject-select"
                    className="form-select mb-3"
                    value={selectedSubjectId}
                    onChange={(e) => {
                      const subjectId = e.target.value;
                      setSelectedSubjectId(subjectId);

                      // Find all tests for the selected subject
                      const subjectTests = tests.filter((test) => test.selectedSubject === subjectId);

                      if (subjectTests.length > 0) {
                        // Combine scores and total questions for the same subject
                        const totalScore = subjectTests.reduce((sum, test) => sum + test.score, 0);
                        const totalQuestions = subjectTests.reduce((sum, test) => sum + test.questionSet, 0);
                        const percentage = (totalScore / totalQuestions) * 100;
                        const { grade, status } = getGrade(percentage);

                        // Update the chart and display values
                        setGrade(grade);
                        setStatus(status);
                        setGoodScore(percentage);
                        setPoorScore(100 - percentage);
                        setTotalScore(totalScore);
                        setTotalQuestions(totalQuestions);
                      } else {
                        setGrade("N/A");
                        setStatus("No Data");
                        setGoodScore(0);
                        setPoorScore(100);
                        setTotalScore(0);
                        setTotalQuestions(0);
                      }
                    }}
                  >
                    <option value="">-- Select Topics --</option>
                    {[
                      ...new Map(
                        tests.map((test) => [test.selectedSubject, test.selectedSubject])
                      ).values(),
                    ].map((subjectId) => (
                      <option key={subjectId} value={subjectId}>
                        {getSubjectName(subjectId)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Total Score and Percentage */}
                {/* {selectedSubjectId && (
                  <div className="col-12">
                    <h5>Subject: {getSubjectName(selectedSubjectId)}</h5>
                    <p>Total Score: {totalScore}</p>
                    <p>Total Questions: {totalQuestions}</p>
                    <p>Percentage: {goodScore.toFixed(2)}%</p>
                    <p>Grade: {grade}</p>
                    <p>Status: {status}</p>
                  </div>
                )} */}
              </div>

              <div className="row">
                <div className="col-12 doughnut-chart" style={{ height: 'auto' }}>
                  <DoughnutChart goodScore={goodScore} poorScore={poorScore} />
                </div>
              </div>

              <div className="row">
                <div className="col-6 grade-container">
                  <h5 className="grade-title text-center">Grade</h5>
                  <h2 className="grade-text text-center">{grade || "N/A"}</h2>
                </div>
                <div className="col-6 status-container">
                  <h5 className="status-title text-center">Status</h5>
                  <h2 className="status-text text-center">{status || "No Data"}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="row d-flex align-items-center justify-content-center grading-container" style={{ height: 'auto', marginTop: '20px' }} >
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
          <thead style={{ backgroundColor: '#1D1A6D', color: '#FFD700' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Grade</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Percentage Range</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>AAA</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>90% &gt;</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Exceptional Performance</td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>AA</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>80-90%</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Outstanding Effort</td>
            </tr>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>BBB</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>70-80%</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Passed with Confidence</td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>BB</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>60-70%</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Borderline Safe</td>
            </tr>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>C</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>50-60%</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Needs Improvement</td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>D</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>50% &lt;</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Reassess and Rebuild</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashBoard;