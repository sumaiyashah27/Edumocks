import React from 'react';
import { FaBook } from 'react-icons/fa';  // Importing the necessary icons
import { useNavigate } from "react-router-dom";

const CourseSection = () => {
  const sectionStyle = {
    padding: '50px 0',
    backgroundColor: '#f4f4f4',
    textAlign: 'center',
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '2.5rem',
    marginBottom: '30px',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  };

  const cardStyle = {
    width: '280px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s',
    marginBottom: '20px',
  };

  const cardBodyStyle = {
    padding: '20px',
    textAlign: 'center',
  };

  const cardIconStyle = {
    fontSize: '2rem',
    color: '#100b5c',
    marginBottom: '10px',
  };

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#100b5c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#100b59',
  };
  const navigate = useNavigate();

  return (
    <section style={sectionStyle} id="our-courses">
      <p style={titleStyle}>What We Offer !!</p>

      <div style={rowStyle}>
        {/* Course 1 Card */}
        <div style={cardStyle}>
          <div style={cardBodyStyle}>
            <div style={cardIconStyle}>
              <FaBook />
            </div>
            <span style={{ fontSize: '1rem', color: '#6c757d' }}>COURSE</span>
            <h3 style={cardTitleStyle}>CFA LEVEL 1</h3>
            <button onClick={() => navigate("/login")} style={buttonStyle} onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}>
              Book Test
            </button>
          </div>
        </div>

        {/* Course 2 Card */}
        <div style={cardStyle}>
          <div style={cardBodyStyle}>
            <div style={cardIconStyle}>
              <FaBook />
            </div>
            <span style={{ fontSize: '1rem', color: '#6c757d' }}>COURSE</span>
            <h3 style={cardTitleStyle}>CFA LEVEL 2</h3>
            <button onClick={() => navigate("/login")} style={buttonStyle} onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}>
              Book Test
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
