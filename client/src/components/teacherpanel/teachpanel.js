import React, { useState, useEffect  } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { FaUserAlt, FaBook, FaClipboard, FaUsers, FaPoll, FaHourglassStart, FaTicketAlt, FaImage, FaQuestionCircle, FaSignOutAlt  } from 'react-icons/fa';
import { Row, Col, Container, Button  } from 'react-bootstrap';
import Dashboard from './teach-dash';
import Students from './student';
import Courses from './course';
import Subjects from './subject';
import Images from './images';
import Questions from './question';
import Coupons from './coupon';
import StudentEnroll from './studEnroll';
import AssignTest from './assignTest';
import StudentTestResults from './studTestResult';
import DelayTest from './delayTest';

const TeachPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    teachId: '',
    firstname: '',
    lastname: '',
    email: '',
  });

  useEffect(() => {
    const _id = localStorage.getItem('_id');
    const teachId = localStorage.getItem('teachId');
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const email = localStorage.getItem('email');
  
    if (!email) {
      console.error('User not found. Redirecting to login');
      navigate('/teachLogin'); // Uncomment this to actually redirect
    } else {
      setTeacher({ _id, teachId, firstname, lastname, email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove `navigate` dependency to avoid unnecessary re-renders
  

  const handleLogout = () => {
    // Clear localStorage and navigate to login
    localStorage.removeItem('_id');
    localStorage.removeItem('teachId');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');

    navigate('/teachLogin');
  };

  return (
    <Container fluid>
      <Row style={{ margin: 0 }}>
        {/* Left Sidebar Panel */}
        <Col xs={12} md={3} lg={2} 
          style={{ backgroundColor: '#f8f9fa', padding: '20px', position: 'fixed', top: 0, bottom: 0, left: 0, width: '250px', height: '100%', boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)',  zIndex: 1000
        }}>
          <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>
            Teacher Panel
            welcome, {teacher._id}
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('dashboard')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'dashboard' ? 'white' : '#333', backgroundColor: activeSection === 'dashboard' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaUserAlt /> Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('students')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'students' ? 'white' : '#333', backgroundColor: activeSection === 'students' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaUsers /> Students
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('courses')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'courses' ? 'white' : '#333', backgroundColor: activeSection === 'courses' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaBook /> Courses
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('subjects')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'subjects' ? 'white' : '#333', backgroundColor: activeSection === 'subjects' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaClipboard /> Subjects
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('images')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'images' ? 'white' : '#333', backgroundColor: activeSection === 'images' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaImage /> Images
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('questions')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'questions' ? 'white' : '#333', backgroundColor: activeSection === 'questions' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaQuestionCircle  /> Questions
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('coupons')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'coupons' ? 'white' : '#333', backgroundColor: activeSection === 'coupons' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaTicketAlt /> Coupons
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('studentenroll')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'studentenroll' ? 'white' : '#333', backgroundColor: activeSection === 'studentenroll' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaUsers /> Student Enrollment
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('studtestresult')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'studtestresult' ? 'white' : '#333', backgroundColor: activeSection === 'studtestresult' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaPoll /> Student Test Results
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }} onClick={() => setActiveSection('delaytests')}>
              <Link to="#" style={{ textDecoration: 'none', color: activeSection === 'delaytests' ? 'white' : '#333', backgroundColor: activeSection === 'delaytests' ? '#007bff' : '', padding: '10px', fontSize: '1.1rem' }}>
                <FaHourglassStart /> Delayed Tests
              </Link>
            </li>
          </ul>
          {/* Logout Button */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        </Col>

        {/* Right Content Panel */}
        <Col xs={12} md={9} lg={10} style={{ padding: '20px', marginLeft: '250px' }}>
          <div>
            {/* Render the respective component based on the active section */}
            {activeSection === 'dashboard' && <Dashboard />}
            {activeSection === 'students' && <Students />}
            {activeSection === 'courses' && <Courses />}
            {activeSection === 'subjects' && <Subjects />}
            {activeSection === 'images' && <Images />}
            {activeSection === 'questions' && <Questions />}
            {activeSection === 'coupons' && <Coupons />}
            {activeSection === 'studentenroll' && <StudentEnroll />}
            {activeSection === 'assigntests' && <AssignTest />}
            {activeSection === 'studtestresult' && <StudentTestResults />}
            {activeSection === 'delaytests' && <DelayTest />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TeachPanel;
