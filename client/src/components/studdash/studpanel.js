import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faTachometerAlt, faUser, faBook, faChalkboardTeacher, faBookOpen, faChevronLeft, faChevronRight, faSignOutAlt, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './DashBoard';
import Profile from './Profile';
import BookTest from './BookTest';
import ScheduleTest from './ScheduleTest';
import Material from './Material';
import SupportStudent from './SupportStudent';
import { useNavigate } from 'react-router-dom';

const StudPanel = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState({
    _id: localStorage.getItem('_id'),
    firstname: localStorage.getItem('firstname'),
    lastname: localStorage.getItem('lastname'),
    email: localStorage.getItem('email'),
  });

  useEffect(() => {
    if (!student.email) {
      console.error('Student not found. Redirecting to login');
      navigate('/studLogin');
      return;
    }

    const fetchStudentDetails = async () => {
      const studentId = localStorage.getItem('_id');
      console.log('Fetching student details for ID:', studentId);

      if (!studentId) {
        console.error("Student ID not found in localStorage.");
        return;
      }
      try {
        console.log('Fetching student details for ID:', studentId);
        const response = await axios.get(`/api/student/${studentId}`);
        console.log('Student data fetched:', response.data);
        setStudent((prev) => ({
          ...prev,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
        }));
        localStorage.setItem('_id', response.data._id);
        localStorage.setItem('firstname', response.data.firstname);
        localStorage.setItem('lastname', response.data.lastname);
        localStorage.setItem('email', response.data.email);
      } catch (error) {
        console.error('Error fetching student details:', error.response || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [student._id, student.email, navigate]);

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/studLogin');
  };

  const menuItems = [
    { name: 'Dashboard', panel: 'dashboard', icon: faTachometerAlt },
    { name: 'Book Test', panel: 'book test', icon: faUser },
    { name: 'Schedule Test', panel: 'schedule test', icon: faBook },
    { name: 'Study Material', panel: 'material', icon: faBookOpen },
    { name: 'Profile', panel: 'profile', icon: faChalkboardTeacher },
    { name: 'Support', panel: 'support', icon: faHandsHelping },
  ];

  const renderContent = () => {
    switch (activePanel) {
      case 'dashboard':
        return <Dashboard />;
      case 'book test':
        return <BookTest />;
      case 'schedule test':
        return <ScheduleTest />;
      case 'material':
        return <Material />;
      case 'profile':
        return <Profile />;
      case 'support':
        return <SupportStudent />;
      default:
        return <h2>Welcome! Please select an option.</h2>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#100b5c' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', color: 'white' }}>
          <div className="row topbar">
            <h2 style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#FFF' }}>
              Welcome, {isLoading ? 'Loading...' : student.firstname}
            </h2>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ff4d4d',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              borderRadius: '5px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
            Logout
          </button>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: sidebarOpen ? '250px' : '70px', backgroundColor: '#100b5c', padding: '20px', color: 'white', transition: 'width 0.3s ease' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ backgroundColor: '#fff', color: '#100b5c', border: 'none', padding: '10px', cursor: 'pointer', marginBottom: '10px', borderRadius: '5px' }}
            >
              <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} />
            </button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {menuItems.map((item) => (
                <li key={item.panel} style={{ marginBottom: '15px' }}>
                  <button
                    onClick={() => handlePanelChange(item.panel)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: activePanel === item.panel ? '#ffdf5c' : '#ECF0F1',
                      border: 'none',
                      color: activePanel === item.panel ? '#100b5c' : '#100b5c',
                      textAlign: 'left',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      justifyContent: 'flex-start',
                      width: sidebarOpen ? '100%' : '50px',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      style={{
                        marginRight: '10px',
                        fontSize: '20px',
                        color: activePanel === item.panel ? '#100b5c' : '#100b5c',
                        transition: 'transform 0.2s ease',
                        transform: 'scale(1)',
                      }}
                    />
                    {sidebarOpen && item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, padding: '10px', backgroundColor: '#ecf0f1', overflowY: 'auto' }}>
            <div style={{ padding: '10px', margin: '0 auto', maxWidth: '100%', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudPanel;
