// File Name: Student.js
import React, { useState, useEffect } from 'react';
import { FaTrash, FaDownload, FaSearch, FaUserPlus, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Table, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import Papa from 'papaparse';
import './css/student.css'; // Add styles
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "./modals/DeleteModal"
import axios from 'axios';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token'); 
      //const response = await fetch('/api/student');
      const response = await fetch('/api/student', { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (studentId) => {
    setDeleteId(studentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (password) => {
    try {
      await axios.delete(`/api/student/${deleteId}`, {
        data: { password },
      });
      toast.success("Student deleted successfully.");
      setShowDeleteModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting student.");
    } finally {
      
    }
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,  // Treat the first row as the header and skip it
        skipEmptyLines: true, // Skip empty lines to prevent errors
        complete: async (result) => {
          // Extract students data
          const studentsData = result.data.map(({ firstname, lastname, email, countryCode, phone, testCode }) => ({
            firstname,
            lastname,
            email,
            countryCode,
            phone,
            testCode,
          }));

          // Validate required fields (firstname, lastname, email)
          const invalidStudents = studentsData.filter(student => !student.firstname || !student.lastname || !student.email);

          if (invalidStudents.length > 0) {
            console.log('Invalid students:', invalidStudents);  // Log the invalid students for debugging
            toast.error('Some students have missing required fields: firstname, lastname, or email.');
            return;
          }

          // Email format validation (optional)
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const invalidEmails = studentsData.filter(student => student.email && !emailRegex.test(student.email));

          if (invalidEmails.length > 0) {
            toast.warning('Some emails are invalid. Please check the email format.');
            return;
          }

          // Send valid data to the backend
          try {
            const response = await fetch('/api/student/bulk', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(studentsData),
            });

            if (response.ok) {
              // Fetch and display updated list of students
              fetchStudents();
              toast.success('Students added successfully!');
              setShowUploadModal(false);
            } else {
              throw new Error('Error uploading students');
            }
          } catch (error) {
            console.error('Error uploading students:', error);
            toast.error('There was an error uploading students.');
          }
        },
      });
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      ["firstname", "lastname", "email", "countryCode", "phone", "testCode"]
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const csvData = students
      .filter((student) => selectedStudents.includes(student._id))
      .map(({ firstname, lastname, email, countryCode, phone, testCode }) => ({
        firstname,
        lastname,
        email,
        countryCode,
        phone,
        testCode,
      }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="student-container">
      <h2>Students</h2>
      <div className="controls">
        <div className="search-container">
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-bar"
            />
          </InputGroup>
        </div>
        <Link to="/studSignup" className="no-underline">
          <Button variant="success">
            <FaUserPlus /> Add Student
          </Button>
        </Link>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <FaUpload /> Upload Students
        </Button>
        <Button variant="primary" onClick={handleDownloadCSV} disabled={selectedStudents.length === 0}>
          <FaDownload /> Download Selected
        </Button>
      </div>
      <div className="student-list">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => setSelectedStudents(e.target.checked ? students.map(s => s._id) : [])}
                />
              </th>
              <th>Student Name</th>
              <th>Email</th>
              <th>CC</th>
              <th>Mobile No</th>
              <th>Test ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() =>
                      setSelectedStudents((prev) =>
                        prev.includes(student._id)
                          ? prev.filter((id) => id !== student._id)
                          : [...prev, student._id]
                      )
                    }
                  />
                </td>
                <td>{student.firstname} {student.lastname}</td>
                <td>{student.email}</td>
                <td>{student.countryCode}</td>
                <td>{student.phone}</td>
                <td>{student.testCode}</td>
                <td>
                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(student._id)}>
                  <FaTrash />
                </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      {/* Upload CSV Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="file" accept=".csv" onChange={handleBulkUpload} />
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <Button variant="secondary" onClick={handleDownloadTemplate}>
            <FaDownload /> Bulk Format
          </Button>
          <Button variant="primary" onClick={() => setShowUploadModal(false)}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Student;
