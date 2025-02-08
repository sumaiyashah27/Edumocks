import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './css/profile.css';

const Profile = () => {
  const [studentDetails, setStudentDetails] = useState({
    firstname: '',
    lastname: '',
    email: '', // Added email field
    phone: '', // Added phone field
    countryCode: '', // Added countryCode
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch current student details when the component mounts
  useEffect(() => {
    const studentId = localStorage.getItem('_id');

    if (!studentId) {
      console.error('student not logged in');
      return;
    }

    axios.get(`/api/student/${studentId}`)  // Adjust with your API ro ute
      .then((response) => {
        // Fetch only the first name, last name, and photo from the backend, not phone or countryCode
        setStudentDetails((prevDetails) => ({
          ...prevDetails,
          firstName: response.data.firstname || '',
          lastName: response.data.lastname || '',
          email: response.data.email || '',
          countryCode: response.data.countryCode || '',
          phone: response.data.phone || '',
        }));
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false); // Disable editing mode
  
    const studentId = localStorage.getItem('_id');

    if (!studentId) {
      console.error('student not logged in');
      return;
    }
  
    const updatedStudent = { 
      firstname: studentDetails.firstName,
      lastname: studentDetails.lastName,
      email: studentDetails.email,
      countryCode: studentDetails.countryCode,
      phone: studentDetails.phone,
      fullPhoneNumber: `${studentDetails.countryCode}${studentDetails.phone}`
    };
  
    console.log('Updated student data:', updatedStudent); // Log the data being sent
  
    try {
      const response = await axios.put(`/api/student/${studentId}`, updatedStudent);
      console.log('student profile updated:', response.data);
    } catch (error) {
      console.error('Error updating student profile:', error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setStudentDetails((prevDetails) => ({
          ...prevDetails,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitialAvatar = () => {
    const initials = (studentDetails.firstName || '').charAt(0).toUpperCase() + (studentDetails.lastName || '').charAt(0).toUpperCase();
    return (
      <div
        className="initial-avatar rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: '120px',
          height: '120px',
          fontSize: '50px',
          backgroundColor: '#f0f0f0',
          color: '#555',
        }}
      >
        {initials || 'JD'} {/* Default to 'JD' if initials is empty */}
      </div>
    );
  };

  return (
    <Container className="profile-container d-flex flex-column justify-content-center">
      <Row>
        {/* Sidebar Section */}
        <Col md={3} className="profile-sidebar d-flex flex-column align-items-center text-center p-3">
          <div
            className="profile-photo-container mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: '150px',
              height: '150px',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {studentDetails.photo ? (
              <img
                src={studentDetails.photo}
                alt="Profile"
                className="profile-photo rounded-circle"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              getInitialAvatar()
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <h3>{studentDetails.firstName} {studentDetails.lastName}</h3>
          {/* <Button variant="primary" className="w-100">Set Password</Button> */}
        </Col>

        {/* Profile Details Section */}
        <Col md={8} className="profile-details text-start">
          <h2>Profile Info</h2>
          <Form>
            <Row className="mb-3">
              <Col md={6} className="text-start">
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={studentDetails.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={studentDetails.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Email Field */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={studentDetails.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Phone and Country Code Fields */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formCountryCode">
                  <Form.Label>Country Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="countryCode"
                    value={studentDetails.countryCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={studentDetails.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              {isEditing ? (
                <>
                  <Button variant="success" onClick={handleSave}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
              {/* <Button variant="danger">Delete Account</Button> */}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
