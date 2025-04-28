import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarCheck, faClock, faChartBar, faCogs } from '@fortawesome/free-solid-svg-icons';

const TeacherDash = () => {
  // State to store the counts
  const [counts, setCounts] = useState({
    studentCount: 0,
    scheduleTestCount: 0,
    delayTestCount: 0
  });

  // Fetch counts from the server
  useEffect(() => {
    const token = localStorage.getItem('token');
    //axios.get('/api/teachdash/teacherDashCounts') // Updated API endpoint to match the server route
    axios.get('/api/teachdash/teacherDashCounts', { headers: { Authorization: `Bearer ${token}` }})
      .then(response => {
        setCounts(response.data);  // Set the counts from the response
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center" style={{ color: '#100B5C' , marginBottom: '150px'}}> Dashboard</h2>
      
      <div className="row justify-content-center mt-4">
        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-lg" style={{ borderRadius: '15px', borderColor: '#C80D18' }}>
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faUsers} size="3x" style={{ color: '#100B5C' }} />
              <h5 className="card-title mt-3" style={{ color: '#C80D18' }}>Total Students</h5>
              <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold', color: '#100B5C' }}>
                {counts.studentCount}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-lg" style={{ borderRadius: '15px', borderColor: '#C80D18' }}>
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faCalendarCheck} size="3x" style={{ color: '#100B5C' }} />
              <h5 className="card-title mt-3" style={{ color: '#C80D18' }}>Scheduled Tests</h5>
              <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold', color: '#100B5C' }}>
                {counts.scheduleTestCount}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-lg" style={{ borderRadius: '15px', borderColor: '#C80D18' }}>
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faClock} size="3x" style={{ color: '#100B5C' }} />
              <h5 className="card-title mt-3" style={{ color: '#C80D18' }}>Rescheduled Tests</h5>
              <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold', color: '#100B5C' }}>
                {counts.delayTestCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDash;
