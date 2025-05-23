import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch, faMinus, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown, Form, Modal, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalCourseName, setModalCourseName] = useState('');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(''); // Add this line
  const [editingCourse, setEditingCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubjectModal, setSubjectShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
 
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Get the token
  
    try {
      const { data } = await axios.get('/api/course', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(data);
    } catch (error) {
      toast.error('Error fetching courses.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSubjects = async () => {
    const token = localStorage.getItem('token'); // Get the token
  
    try {
      const { data } = await axios.get('/api/subject', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubjectOptions(data);
    } catch (error) {
      toast.error('Error fetching Topics.');
    }
  };
  

  // Handle checkbox selection
  const handleCheckboxChange = (subjectId) => {
    setSelectedSubject((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`/api/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourseDetails(data);
    } catch (error) {
      toast.error('Failed to fetch course details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddSubjectToCourse = async () => {
    if (!selectedCourse || selectedSubject.length === 0) {
      toast.warn("Please select both a course and at least one topic.");
      return;
    }

    try {
      // Ensure we send an array
      await axios.put(`/api/course/${selectedCourse}/add-subject`, {
        subjectIds: selectedSubject, // This must be an array
      });

      toast.success("Topics added successfully.");
      handleCourseSelect(selectedCourse);
      closeAddSubjectModal();
      fetchCourses(); // Refresh to ensure UI shows updated data
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding topics to course.");
      fetchCourses();
    }
  };

  const selectedSubjectsText = selectedSubject.length > 0
    ? subjectOptions
      .filter((subject) => selectedSubject.includes(subject._id))
      .map((subject) => subject.name)
      .join(", ")
    : "Select Topics";

  const handleAddCourse = async () => {
    if (!newCourseName || !newCourseDescription) {
      toast.warn('Please enter course name and description.');
      return;
    }

    try {
      const newCourse = {
        name: newCourseName,
        price: newCoursePrice,
        description: newCourseDescription,
      };
      console.log('Sending course data:', newCourse);
      await axios.post('/api/course', newCourse);
      fetchCourses();
      closeAddCourseModal();
      toast.success('Course added successfully.');
    } catch (error) {
      toast.error('Error adding new course.');
    }
  };
  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`/api/course/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success('Course deleted successfully.');
    } catch (error) {
      toast.error('Error deleting the course.');
    }
  };

  const handleDeleteIconClick = (courseId) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.post('/api/course/delete-with-password', {
        courseId: selectedCourseId,
        password,
      });

      setCourses(courses.filter(course => course._id !== selectedCourseId));
      toast.success('Course deleted successfully');
      setShowModal(false);
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleDeleteSubject = async (courseId, subjectId) => {
    try {
      await axios.put(`/api/course/${courseId}/remove-subject`, { subjectId });
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, subjects: course.subjects.filter((subject) => subject._id !== subjectId) }
            : course
        )
      );
      handleCourseSelect(courseId);
      toast.success('Topics deleted successfully.');
    } catch (error) {
      toast.error('Error deleting Topics from course.');
    }
  };

  const openAddSubjectModal = (courseId, courseName) => {
    setSelectedCourse(courseId);
    setModalCourseName(courseName);
    setIsAddSubjectModalOpen(true);
  };

  const closeAddSubjectModal = () => {
    setIsAddSubjectModalOpen(false);
    setSelectedSubject('');
  };

  const openAddCourseModal = () => {
    setIsAddCourseModalOpen(true);
  };

  const closeAddCourseModal = () => {
    setIsAddCourseModalOpen(false);
    setNewCourseName('');
    setNewCourseDescription('');
  };

  const toggleCourseExpand = (courseId) => setExpandedCourse(expandedCourse === courseId ? null : courseId);
  const toggleSubjectExpand = (subjectId) => setExpandedSubject(expandedSubject === subjectId ? null : subjectId);

  const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const isAllSelected = selectedSubject.length === subjectOptions.length && subjectOptions.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSubject([]); // Unselect all
    } else {
      setSelectedSubject(subjectOptions.map((subject) => subject._id)); // Select all
    }
  };

  const handleEditCourse = async () => {
    if (!newCourseName.trim()) {
      toast.warn('Course name cannot be empty.');
      return;
    }

    try {
      await axios.put(`/api/course/${editingCourse._id}`, { name: newCourseName,price: newCoursePrice, description: newCourseDescription });
      fetchCourses();
      setIsEditModalOpen(false);
      toast.success('Course updated successfully.');
    } catch (error) {
      toast.error('Error updating course.');
    }
  };

  const handleDeleteSubjectClick = (courseId, subjectId) => {
    setSelectedCourseId(courseId);
    setSelectedSubjectId(subjectId);
    setSubjectShowModal(true);
  };

  const confirmDeleteSubject = async () => {
    try {
      await axios.put(`/api/course/${selectedCourseId}/remove-subject`, { subjectId: selectedSubjectId,password  });
  
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === selectedCourseId
            ? { ...course, subjects: course.subjects.filter((subject) => subject._id !== selectedSubjectId) }
            : course
        )
      );
  
      toast.success('Subject deleted successfully.');
      setSubjectShowModal(false);
    } catch (error) {
      toast.error('Error deleting subject.');
    }
  };

  const formatLabel = (name, description) => {
    if (!description) return name;
    const cleanDesc = description.replace(/[`'"]/g, "").trim();
    return `${name} (${cleanDesc})`;
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <ToastContainer />
      <h2 className="text-center font-weight-bold" style={{ color: '#100B5C', transition: 'color 0.3s ease' }}>Course Management</h2>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8">
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#fff', border: '1px solid #ddd' }}>
              <FontAwesomeIcon icon={faSearch} style={{ color: '#100B5C', transition: 'color 0.3s ease' }} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for a course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: '5px', transition: 'border-color 0.3s ease' }}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={openAddCourseModal}
        className="d-flex align-items-center justify-content-center mx-auto mb-3"
        style={{ backgroundColor: '#C80D18', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 15px', fontSize: '16px', transition: 'background-color 0.3s ease, transform 0.2s ease' }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <FontAwesomeIcon icon={faPlus} style={{ fontSize: '18px', marginRight: '8px', }} /> Add New Course
      </Button>

      {/* One Column, One Row for Courses */}
      <div>
        {filteredCourses.map((course) => (
          <div key={course._id} className="card mb-3" style={{ padding: '15px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }} onClick={() => toggleCourseExpand(course._id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              {/* Left Section: Course Name & Expand Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h5 className="d-flex align-items-center gap-3" style={{ color: '#100B5C', margin: 0 }}>
                  <FontAwesomeIcon
                    icon={expandedCourse === course._id ? faMinus : faPlus}
                    style={{ color: '#100B5C', cursor: 'pointer', fontSize: '20px' }}
                    onClick={() => toggleCourseExpand(course._id)}
                  />
                  {course.name} - ${course.price}
                </h5>
                <span style={{ color: '#555', fontSize: '14px', marginLeft: '35px' }}>{course.description || ''}</span>
              </div>

              {/* Right Section: Delete Icon */}
              <div className='d-flex gap-5'>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ color: 'rgb(16, 11, 92)', cursor: 'pointer', fontSize: '20px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCourse(course);
                    setNewCourseName(course.name);
                    setNewCourseDescription(course.description)
                    setNewCoursePrice(course.price)
                    setIsEditModalOpen(true);
                  }}
                />
                {course.name !== 'CFA LEVEL - 1' && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: '#e74c3c', cursor: 'pointer', fontSize: '20px', marginRight: '10px' }}
                    onClick={(e) => { e.stopPropagation(); handleDeleteIconClick(course._id); }}
                  />
                )}
              </div>
            </div>

            {expandedCourse === course._id && (
              <div className="d-flex flex-column">
                <Button
                  variant="outline-primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents toggling course expansion
                    openAddSubjectModal(course._id, course.name);
                  }}
                  style={{
                    width: '12%', // Smaller width for a smaller button
                    backgroundColor: '#100B5C', // Button color
                    color: '#fff',
                    borderColor: '#100B5C',
                    marginTop: '10px',
                    fontSize: '14px', // Smaller font size
                    textAlign: 'left', // To ensure the text is aligned nicely at the start
                  }}
                ><FontAwesomeIcon icon={faPlus} /> Add Topic
                </Button>
                {course.subjects.map((subject) => (
                  <div key={subject._id} className="d-flex justify-content-between">
                    <span>
                      <strong>{subject.name}</strong>
                      <div
                        dangerouslySetInnerHTML={{ __html: subject.description }}
                        style={{ marginTop: "4px" }}
                      />
                    </span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: '#e74c3c', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); handleDeleteSubjectClick(course._id, subject._id); }}
                    />
                  </div>
                ))}
              </div>
            )}  
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="deletePassword">
            <Form.Label>Enter password to confirm deletion</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSubjectModal} onHide={() => setSubjectShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="deletePassword">
            <Form.Label>Enter password to confirm deletion</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDeleteSubject}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Course Modal */}
      <div className={`modal ${isAddCourseModalOpen ? 'show' : ''}`} style={{ display: isAddCourseModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Course</h5>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="form-control"
                placeholder="Enter course name"
              />
              <input
                type="number"
                value={newCoursePrice}
                onChange={(e) => setNewCoursePrice(e.target.value)}
                className="form-control mt-2"
                placeholder="Enter course price"
              />
              <textarea
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
                className="form-control mt-2"
                placeholder="Enter course description"
              />
            </div>
            <div className="modal-footer">
              <Button onClick={handleAddCourse} style={{ backgroundColor: '#100B5C', color: '#fff' }}>
                Add Course
              </Button>
              <Button variant="secondary" onClick={closeAddCourseModal}>Close</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      <div className={`modal ${isAddSubjectModalOpen ? 'show' : ''}`} style={{ display: isAddSubjectModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Topics to {modalCourseName}</h5>

            </div>
            <div className="modal-body">
              <Dropdown>
                <Dropdown.Toggle variant="light" className="w-100 text-left d-flex align-items-center justify-content-between select-topic">
                  {selectedSubjectsText}
                </Dropdown.Toggle>
                <Dropdown.Menu className="topic-dropdown w-100" style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}>

                  {/* Select All Checkbox */}
                  <Form.Check
                    id="select-all"
                    type="checkbox"
                    className="d-flex align-items-center w-100"
                    label="Select All"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  />

                  {/* Individual Checkboxes */}
                  {subjectOptions.map((subject) => (
                    <Form.Check
                      key={subject._id}
                      id={`checkbox-${subject._id}`}
                      type="checkbox"
                      className="d-flex align-items-center w-100"
                      label={formatLabel(subject.name, subject.subtitle)}
                      checked={selectedSubject.includes(subject._id)}
                      onChange={() => handleCheckboxChange(subject._id)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="modal-footer">
              <Button onClick={handleAddSubjectToCourse} style={{ backgroundColor: '#100B5C', color: '#fff' }}>
                Add Topic
              </Button>
              <Button variant="secondary" onClick={closeAddSubjectModal}>Close</Button>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Course</h5>
                <span onClick={() => setIsEditModalOpen(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="form-control"
                  placeholder="Enter new course name"
                />
                <input
                  type="number"
                  value={newCoursePrice}
                  onChange={(e) => setNewCoursePrice(e.target.value)}
                  className="form-control mt-2"
                  placeholder="Enter course price"
                />
                <textarea
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className="form-control mt-2"
                  placeholder="Enter course description"
                />
              </div>
              <div className="modal-footer">
                <button style={{ backgroundColor: 'rgb(16, 11, 92)', borderColor: 'rgb(16, 11, 92)' }} className="btn btn-primary" onClick={handleEditCourse}>
                  Save Changes
                </button>
                <button style={{ backgroundColor: 'rgb(200, 13, 24)', borderColor: 'rgb(200, 13, 24)' }} className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;