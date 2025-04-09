import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert } from "react-bootstrap";

const ScheduleTestTeacher = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get("/api/scheduleTest");
                setTests(data);
                setLoading(false);
            } catch (error) {
                setError("Failed to load data.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    console.log('tests', tests);

    return (
        <Container>
            <h2 className="text-center my-4" style={{ color: "#100B5C" }}>
                Sheduled Tests
            </h2>

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
                                <th>QuestionSet</th>
                                <th>Test Date</th>
                                <th>Test Time</th>
                                <th>Test Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.length > 0 ? (
                                tests
                                    .filter(test => test.testStatus === "Scheduled") // ✅ filter only Scheduled
                                    .map((test, index) => (
                                        <tr key={test._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {test.studentId
                                                    ? `${test.studentId.firstname} ${test.studentId.lastname}`
                                                    : "N/A"}
                                            </td>
                                            <td>{test.selectedCourse ? test.selectedCourse.name : "N/A"}</td>
                                            <td>{test.selectedSubject ? test.selectedSubject.name : "N/A"}</td>
                                            <td>{test.questionSet || "N/A"}</td>
                                            <td style={{ color: "#8B0000", fontWeight: "bold" }}>
                                                {new Date(test.testDate).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {test.testTime
                                                    ? new Date(`1970-01-01T${test.testTime}`).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false,
                                                    })
                                                    : "N/A"}
                                            </td>
                                            <td>{test.testStatus}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No delayed tests found.
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

export default ScheduleTestTeacher;
