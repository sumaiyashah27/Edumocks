import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert } from "react-bootstrap";

const StudentTestResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get("/api/scheduleTest/completed");
        setResults(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load completed test results.");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center" style={{ color: "#100B5C" }}>Completed Test Results</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive className="text-center">
            <thead style={{ backgroundColor: "#100B5C", color: "white" }}>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Subject</th>
                <th>Test Date</th>
                <th>Test Time</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((test, index) => (
                  <tr key={test._id}>
                    <td>{index + 1}</td>
                    <td>{test.studentId ? `${test.studentId.firstname} ${test.studentId.lastname}` : "N/A"}</td>
                    <td>{test.selectedCourse ? test.selectedCourse.name : "N/A"}</td>
                    <td>{test.selectedSubject ? test.selectedSubject.name : "N/A"}</td>
                    <td style={{ color: "#8B0000", fontWeight: "bold" }}>
                      {new Date(test.testDate).toLocaleDateString()}
                    </td>
                    <td>{test.testTime}</td>
                    <td style={{ fontWeight: "bold", color: "#8B0000" }}>{test.score}</td>
                    <td style={{ fontWeight: "bold", color: "green" }}>{test.testStatus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No completed test results found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default StudentTestResult;
