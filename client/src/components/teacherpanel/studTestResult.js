import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs"; // Import Bootstrap search icon

const StudentTestResult = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get("/api/completed/getCompletedTests");
        setResults(data);
        setFilteredResults(data); // Initialize filtered results with all data
        setLoading(false);
      } catch (error) {
        setError("Failed to load completed test results.");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Filter function
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = results.filter((test) =>
      `${test.studentId?.firstname} ${test.studentId?.lastname}`.toLowerCase().includes(query) ||
      test.selectedCourse?.name.toLowerCase().includes(query) ||
      test.selectedSubject?.name.toLowerCase().includes(query) ||
      test.testDate.toLowerCase().includes(query)
    );

    setFilteredResults(filtered);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center" style={{ color: "#100B5C" }}>Completed Test Results</h2>

      {/* Search Bar with Icon */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <BsSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by student, course, subject, or date..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

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
                <th>Topic</th>
                <th>Question Set</th>
                <th>Test Date</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults.map((test, index) => (
                  <tr key={test._id}>
                    <td>{index + 1}</td>
                    <td>{test.studentId ? `${test.studentId.firstname} ${test.studentId.lastname}` : "N/A"}</td>
                    <td>{test.selectedCourse ? test.selectedCourse.name : "N/A"}</td>
                    <td>{test.selectedSubject ? test.selectedSubject.name : "N/A"}</td>
                    <td>{test.questionSet}</td>
                    <td style={{ color: "#8B0000", fontWeight: "bold" }}>
                      {new Date(test.testDate).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: "bold", color: "#8B0000" }}>{test.score}/{test.questionSet}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No matching results found.
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
