import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaBook, FaClipboard, FaChevronRight, FaChevronLeft, FaUsers, FaPoll, FaHourglassStart, FaTicketAlt, FaImage, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { Row, Col, Container, Button } from 'react-bootstrap';
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
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
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
      navigate('/teachLogin');
    } else {
      setTeacher({ _id, teachId, firstname, lastname, email });
    }
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('_id');
    localStorage.removeItem('teachId');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');

    navigate('/teachLogin');
  };

  const handleToggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  return (
    <Container fluid style={{ padding: 0, overflowX: 'hidden' }}>
      <Row style={{ margin: 0 }}>
        {/* Left Sidebar Panel */}
        <Col xs={12} md={3} lg={2} 
          style={{
            backgroundColor: '#100B5C', padding: '20px', position: 'fixed', top: 0, bottom: 0, left: 0,
            width: isSidebarClosed ? '60px' : '250px', height: '100%', boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000, transition: 'width 0.3s ease', overflowY: 'auto'
          }}>

          <div style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#FFF' }}>
            {!isSidebarClosed && `Welcome, ${teacher.firstname}`}
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[{ icon: <FaUserAlt/>, label: 'Dashboard', section: 'dashboard' },
              { icon: <FaUsers />, label: 'Students', section: 'students' },
              { icon: <FaBook />, label: 'Courses', section: 'courses' },
              { icon: <FaClipboard />, label: 'Subjects', section: 'subjects' },
              { icon: <FaImage />, label: 'Images', section: 'images' },
              { icon: <FaQuestionCircle />, label: 'Questions', section: 'questions' },
              { icon: <FaUsers />, label: 'Student Enrollment', section: 'studentenroll' },
              { icon: <FaHourglassStart />, label: 'Delayed Tests', section: 'delaytests' }].map(({ icon, label, section }) => (
                <li key={section} style={{ marginBottom: '20px' }} onClick={() => setActiveSection(section)}>
                  <Link to="#" style={{textDecoration: 'none',color: activeSection === section ? '#FFF' : '#CCC',backgroundColor: activeSection === section ? '#007bff' : '',padding: '10px',fontSize: '1.1rem',display: 'flex',alignItems: 'center',width: '100%', }}>
                    <span style={{ marginRight: isSidebarClosed ? '100px' : '10px' }}>
                      {icon}
                    </span>
                    {!isSidebarClosed && label}
                  </Link>
                </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt /> {!isSidebarClosed && 'Logout'}
            </Button>
          </div>
        </Col>

        {/* Right Content Panel */}
        <Col xs={12} md={9} lg={10} 
          style={{
            padding: '20px',
            marginLeft: isSidebarClosed ? '50px' : 'auto', // Adjust margin-left dynamically based on sidebar state
            transition: 'margin-left 0.3s ease',
            paddingTop: '20px',
          }}>
          <div>
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

      {/* Button outside Sidebar */}
      <Button
        variant="link"
        onClick={handleToggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          left: isSidebarClosed ? '70px' : '250px', // Adjust based on sidebar state
          fontSize: '1.5rem',
          padding: 0,
          backgroundColor: '#C80D18',
          border: 'none',
          borderRadius: '8px',
          width: '40px',
          height: '40px',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 2000, // Ensures button is above all content
        }}
      >
        {isSidebarClosed ? <FaChevronRight /> : <FaChevronLeft />}
      </Button>
    </Container>
  );
};

export default TeachPanel;
