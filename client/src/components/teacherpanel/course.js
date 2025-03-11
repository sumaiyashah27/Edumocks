import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Button } from 'react-bootstrap';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalCourseName, setModalCourseName] = useState('');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(''); // Add this line


  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/course');
      setCourses(data);
    } catch (error) {
      toast.error('Error fetching courses.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get('/api/subject');
      setSubjectOptions(data);
    } catch (error) {
      toast.error('Error fetching Topics.');
    }
  };

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/course/${courseId}`);
      setCourseDetails(data);
    } catch (error) {
      toast.error('Failed to fetch course details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubjectToCourse = async () => {
    if (!selectedCourse || !selectedSubject) {
      toast.warn('Please select both a course and a Topics.');
      return;
    }

    const courseToUpdate = courses.find((course) => course._id === selectedCourse);
    const isSubjectAlreadyAdded =
      courseToUpdate && courseToUpdate.subjects.some((subject) => subject._id === selectedSubject);

    if (isSubjectAlreadyAdded) {
      toast.info('This Topics is already added to the course.');
      return;
    }

    const updatedCourses = courses.map((course) => {
      if (course._id === selectedCourse) {
        const subjectToAdd = subjectOptions.find((subject) => subject._id === selectedSubject);
        return { ...course, subjects: [...course.subjects, subjectToAdd] };
      }
      return course;
    });

    setCourses(updatedCourses);

    try {
      await axios.put(`/api/course/${selectedCourse}/add-subject`, { subjectId: selectedSubject });
      handleCourseSelect(selectedCourse);
      closeAddSubjectModal();
      toast.success('Topics added successfully.');
    } catch (error) {
      toast.error('Error adding Topics to course.');
      fetchCourses();
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseName) {
      toast.warn('Please enter a course name.');
      return;
    }

    try {
      const newCourse = { name: newCourseName, price: newCoursePrice  };
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
  };

  const toggleCourseExpand = (courseId) => setExpandedCourse(expandedCourse === courseId ? null : courseId);
  const toggleSubjectExpand = (subjectId) => setExpandedSubject(expandedSubject === subjectId ? null : subjectId);

  const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()));

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

      {loading && <p>Loading...</p>}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h5 style={{ color: '#100B5C' }}>{course.name} - ${course.price}</h5>
              <div>
                {course.name !== 'CFA LEVEL - 1' && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: '#e74c3c', cursor: 'pointer', fontSize: '20px', marginRight: '10px' }}
                    onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course._id); }}
                  />
                )}
                <FontAwesomeIcon
                  icon={expandedCourse === course._id ? faMinus : faPlus}
                  style={{ color: '#100B5C', cursor: 'pointer', fontSize: '20px' }}
                  onClick={() => toggleCourseExpand(course._id)}
                />
              </div>
            </div>
            {expandedCourse === course._id && (
              <div className="d-flex flex-column">
                <Button
                  variant="outline-primary"
                  onClick={() => openAddSubjectModal(course._id, course.name)}
                  style={{ 
                    width: '12%', // Smaller width for a smaller button
                    backgroundColor: '#100B5C', // Button color
                    color: '#fff', 
                    borderColor: '#100B5C',
                    marginTop: '10px',
                    fontSize: '14px', // Smaller font size
                    textAlign: 'left', // To ensure the text is aligned nicely at the start
                  }}
                ><FontAwesomeIcon icon={faPlus}/> Add Topic
                </Button>
                {course.subjects.map((subject) => (
                  <div key={subject._id} className="d-flex justify-content-between">
                    <span>{subject.name}</span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: '#e74c3c', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); handleDeleteSubject(course._id, subject._id); }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

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
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-control"
              >
                <option value="">Select Topic</option>
                {subjectOptions.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
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
    </div>
  );
};

export default Course;
