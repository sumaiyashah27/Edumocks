import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Form, InputGroup, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs"; // Import Bootstrap search icon

const StudentTestResult = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const { data } = await axios.get("/api/completed/getCompletedTests", {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });
        setResults(data);
        setFilteredResults(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load completed test results.");
        setLoading(false);
      }
    };
  
    fetchResults();
  }, []);
  
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTests([]);
    } else {
      setSelectedTests(filteredResults.map(test => test._id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    if (selectedTests.includes(id)) {
      setSelectedTests(selectedTests.filter(item => item !== id));
    } else {
      setSelectedTests([...selectedTests, id]);
    }
  };

  const downloadCSV = () => {
    const selectedData = filteredResults.filter(test => selectedTests.includes(test._id));
    const csvHeader = ["#", "Student", "Course", "Topic", "Question Set", "Test Date", "Score"];
    const csvRows = selectedData.map((test, index) => [
      index + 1,
      test.studentId ? `${test.studentId.firstname} ${test.studentId.lastname}` : "N/A",
      test.selectedCourse ? test.selectedCourse.name : "N/A",
      test.selectedSubject ? test.selectedSubject.name : "N/A",
      test.questionSet,
      new Date(test.testDate).toLocaleDateString(),
      `${test.score}/${test.questionSet}`
    ]);

    const csvContent = [csvHeader, ...csvRows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_test_results.csv");
    link.click();
  };

  return (
    <Container className="mt-4 stud-test">
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

        <Button className="mb-3" variant="success" disabled={selectedTests.length === 0} onClick={downloadCSV}>
          Download CSV
        </Button>

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
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
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
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedTests.includes(test._id)}
                        onChange={() => handleCheckboxChange(test._id)}
                      />
                    </td>
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
                  <td colSpan="8" className="text-center">
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
