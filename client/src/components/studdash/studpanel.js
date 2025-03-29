import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faBook, faChalkboardTeacher, faBookOpen, faChevronLeft, faChevronRight, faSignOutAlt, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const StudPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

      if (!studentId) {
        console.error("Student ID not found in localStorage.");
        return;
      }
      try {
        const response = await axios.get(`/api/student/${studentId}`);
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
  }, [student.email, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/studLogin');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/studpanel/dashboard', icon: faTachometerAlt },
    { name: 'Book Test', path: '/studpanel/book-test', icon: faUser },
    { name: 'Schedule Test', path: '/studpanel/schedule-test', icon: faBook },
    { name: 'Study Material', path: '/studpanel/material', icon: faBookOpen },
    { name: 'Profile', path: '/studpanel/profile', icon: faChalkboardTeacher },
    { name: 'Support', path: '/studpanel/support', icon: faHandsHelping },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#100b5c' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', color: 'white' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#FFF' }}>
            Welcome, {isLoading ? 'Loading...' : student.firstname}
          </h2>
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

        {/* Sidebar & Content */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar */}
          <div style={{ width: sidebarOpen ? '250px' : '100px', backgroundColor: '#100b5c', padding: '20px', color: 'white', transition: 'width 0.3s ease' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                backgroundColor: '#fff',
                color: '#100b5c',
                border: 'none',
                padding: '10px',
                cursor: 'pointer',
                marginBottom: '10px',
                borderRadius: '5px',
              }}
            >
              <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} />
            </button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {menuItems.map((item) => (
                <li key={item.path} style={{ marginBottom: '15px' }}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: location.pathname === item.path ? '#ffdf5c' : '#ECF0F1',
                      border: 'none',
                      color: location.pathname === item.path ? '#100b5c' : '#100b5c',
                      textAlign: 'left',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      justifyContent: 'flex-start',
                      width: sidebarOpen ? '100%' : '50px',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                      textDecoration: 'none',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      style={{
                        marginRight: '10px',
                        fontSize: '20px',
                        color: location.pathname === item.path ? '#100b5c' : '#100b5c',
                      }}
                    />
                    {sidebarOpen && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '10px', backgroundColor: '#ecf0f1', overflowY: 'auto' }}>
            <div style={{ padding: '10px', margin: '0 auto', maxWidth: '100%', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <Outlet /> {/* Renders the selected component based on the route */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudPanel;