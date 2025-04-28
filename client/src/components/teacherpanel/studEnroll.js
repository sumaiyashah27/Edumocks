import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { FaPlus, FaTimes, } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Table, Container, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs"; // Import Bootstrap search icon

Modal.setAppElement('#root'); // Required for accessibility

const QuizEnroll = () => {
  // State variables
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchEnrollments();
  }, []);

  // Fetch all students from API
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token

      const response = await axios.get('/api/student', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Students Fetched:", response.data); // Debugging
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error('Error fetching students');
    }
  };


  // Handle selection of students
  const handleStudentSelection = (selectedOptions) => {
    if (!selectedOptions) {
      setSelectedStudents([]);
      return;
    }
    const selectedIds = selectedOptions.map((option) => option.value);
    if (selectedIds.includes('all')) {
      setSelectedStudents(students.map((s) => s._id)); // Select all
    } else {
      setSelectedStudents(selectedIds);
    }
  };
  //options for student selection
  const options = [
    { value: 'all', label: 'Select All' },
    ...students.map((s) => ({
      value: s._id,
      label: `${s.firstname} ${s.lastname}`
    }))
  ];

  // Fetch all courses from API
  const fetchCourses = async () => {
    const token = localStorage.getItem('token'); // Get the token
    try {
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

  // Handle course selection and fetch subjects
  const handleCourseChange = async (selectedOption) => {
    const courseId = selectedOption.value;
    console.log("Selected Course ID:", courseId); // Debugging

    setSelectedCourse(courseId);
    setSelectedSubjects([]);

    const token = localStorage.getItem('token'); // Get the token

    try {
      const response = await axios.get(`/api/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Subjects fetched:", response.data); // Debugging
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error("Error fetching Topics:", error);
    }
  };

  // Handle subject selection
  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId) // Deselect
        : [...prev, subjectId] // Select
    );
  };

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const { data } = await axios.get("/api/studenroll", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setEnrollments(data);
      setFilteredEnrollments(data);
    } catch (error) {
      toast.error('Error fetching enrollments');
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = enrollments
      .map((enrollment) => {
        const matchedSubjects = enrollment.selectedSubjects.filter(subject =>
          subject.name.toLowerCase().includes(query)
        );

        const matchesStudent = `${enrollment.studentId?.firstname} ${enrollment.studentId?.lastname}`
          .toLowerCase()
          .includes(query);

        const matchesCourse = enrollment.selectedCourse?.name.toLowerCase().includes(query);
        const matchesPayment = enrollment.paymentStatus.toLowerCase().includes(query);

        // If student, course, or payment status matches, keep all subjects
        if (matchesStudent || matchesCourse || matchesPayment) {
          return enrollment;
        }

        // If only specific subjects match, return the enrollment with filtered subjects
        if (matchedSubjects.length > 0) {
          return { ...enrollment, selectedSubjects: matchedSubjects };
        }

        // Otherwise, exclude this enrollment
        return null;
      })
      .filter(Boolean); // Remove null values (enrollments that didn't match)

    setFilteredEnrollments(filtered);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudents.length || !selectedCourse || !selectedSubjects.length) {
      toast.error('All fields are required');
      return;
    }

    // Har student ke liye ek enrollment object banayenge
    const enrollmentRequests = selectedStudents.map((studentId) => ({
      studentId,
      selectedCourse,
      selectedSubjects,
      paymentStatus: "success",
      paymentId: "adminapproved",
      amount: 0,
      orderId: "adminapproved",
    }));

    try {
      // Multiple enrollments ek saath bhejne ke liye axios ka use karenge
      await axios.post('/api/studenroll/enroll', { enrollments: enrollmentRequests });

      toast.success('Students successfully enrolled for the quiz!');
      fetchEnrollments(); //refresh enrollments after successful enrollment

      // Email API bhi har student ke liye call karenge
      await Promise.all(
        enrollmentRequests
          .filter((enroll) => enroll.paymentStatus === "success")  // ✅ Ensure only successful payments send emails
          .map((enroll) =>
            axios.post('/api/enrollmail/send-enrollemail', {
              studentId: enroll.studentId,
              selectedCourse: enroll.selectedCourse,
              selectedSubjects: enroll.selectedSubjects,
            })
          )
      );

      toast.success('Confirmation emails sent!');
      setModalOpen(false);
    } catch (error) {
      toast.error('Error enrolling students. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Enroll in a Quiz</h2>
      <button style={{ background: '#4CAF50', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }} onClick={() => setModalOpen(true)}> <FaPlus /> Enroll Students</button>
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, content: { width: '400px', margin: 'auto', padding: '20px', borderRadius: '10px' } }}>
        <FaTimes onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', alignItems: 'right' }} />
        <h3>Quiz Enrollment</h3>
        <form onSubmit={handleSubmit}>
          {/*student selection dropdown */}
          <div>
            <label className="fw-bold mb-2">Select Students:</label>
            <Select options={options} isMulti
              value={
                selectedStudents.length === students.length
                  ? [{ value: 'all', label: 'Select All' }, ...options.slice(1)]
                  : options.filter((opt) => selectedStudents.includes(opt.value))
              }
              onChange={handleStudentSelection} placeholder="Select Students" closeMenuOnSelect={false}
              hideSelectedOptions={false} menuIsOpen={menuOpen} onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
              styles={{ control: (base) => ({ ...base, minHeight: '40px' }), menu: (base) => ({ ...base, zIndex: 1000 }), }}
              components={{
                DropdownIndicator: (props) => {
                  const { selectProps } = props;
                  return (
                    <div onClick={() => selectProps.setMenuOpen(!selectProps.menuIsOpen)} style={{ cursor: 'pointer', padding: '5px' }} >
                      ⏷
                    </div>
                  );
                },
                Option: (props) => {
                  const { data, innerRef, innerProps } = props;
                  const isSelected =
                    selectedStudents.includes(data.value) ||
                    (data.value === 'all' && selectedStudents.length === students.length);

                  return (
                    <div ref={innerRef} {...innerProps} className="d-flex align-items-center px-2" style={{ cursor: 'pointer', gap: '5px' }} >
                      <Form.Check type="checkbox" checked={isSelected} onChange={() => { }} className="m-0" style={{ marginRight: '2px' }} />
                      <span>{data.label}</span>
                    </div>
                  );
                },
              }}
              setMenuOpen={setMenuOpen}
            />
          </div>

          {/* Course selection dropdown */}
          <div className="mb-3">
            <label className="fw-bold">Select Course:</label>
            <Select
              options={courses.map((course) => ({
                value: course._id,
                label: course.name
              }))}
              onChange={handleCourseChange}
              placeholder="Select Course"
            />
          </div>

          {/* Subject selection checkboxes */}
          {selectedCourse && (
            <div className="mb-3">
              <label className="fw-bold">Select Topic:</label>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <div key={subject._id} className="d-flex align-items-center mb-2">
                    <Form.Check
                      type="checkbox"
                      id={subject._id}
                      value={subject._id}
                      checked={selectedSubjects.includes(subject._id)}
                      onChange={() => handleSubjectChange(subject._id)}
                      className="me-2"
                    />
                    <label className='d-flex' style={{ flexWrap: 'wrap', overflow: 'hidden' }} htmlFor={subject._id}>{subject.name}</label>
                  </div>
                ))
              ) : (
                <p>No Topics available for this course.</p>
              )}
            </div>
          )}

          <button type="submit" style={{ width: '100%', background: '#4CAF50', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>Enroll</button>
        </form>
      </Modal>
      {/* Enrolled Students Table */}
      <div className='mt-3'>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by Student Name, course, Topic, or Payment Status..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <h3 className="text-center mt-4">Enrolled Students</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Course</th>
            <th>Topic</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnrollments.length > 0 ? (
            filteredEnrollments.flatMap((enrollment, index) =>
              enrollment.selectedSubjects.map((subject) => (
                <tr key={`${enrollment._id}-${subject._id}`}>
                  <td>{index + 1}</td>
                  <td>{enrollment.studentId?.firstname} {enrollment.studentId?.lastname}</td>
                  <td>{enrollment.selectedCourse?.name}</td>
                  <td>{subject.name}</td>
                  <td>{enrollment.paymentStatus}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No enrollments found.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default QuizEnroll;