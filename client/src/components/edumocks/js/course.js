import React from 'react';
import { useNavigate } from 'react-router-dom';

const courses = [
  { id: 1, name: 'CFA LEVEL 1 | Quantitative Methods', image: '/10.png' },
  { id: 2, name: 'CFA LEVEL 1 | Ethics', image: '/9.png' },
  { id: 3, name: 'CFA LEVEL 1 | Economics', image: '/11.png' },
  { id: 4, name: 'CFA LEVEL 1 | Financial Statement Analysis', image: '/12.png' },
  { id: 5, name: 'CFA LEVEL 1 | Corporate Issuers', image: '/13.png' },
  { id: 6, name: 'CFA LEVEL 1 | Equity Investments', image: '/14.png' },
  { id: 7, name: 'CFA LEVEL 1 | Fixed Income', image: '/15.png' },
  { id: 8, name: 'CFA LEVEL 1 | Derivatives', image: '/16.png' },
  { id: 9, name: 'CFA LEVEL 1 | Alternative Investments', image: '/17.png' },
  { id: 10, name: 'CFA LEVEL 1 | Portfolio Management', image: '/18.png' },
  { id: 11, name: 'CFA LEVEL 1 | Full Mocks Part 1', image: '/3.png' },
  { id: 12, name: 'CFA LEVEL 1 | Full Mocks Part 1', image: '/4.png' },
  { id: 13, name: 'CFA LEVEL 1 | Individual Topics Mocks', image: '/1.png' },
  { id: 14, name: 'CFA LEVEL 1 | All Topics + 2 Full Mocks', image: '/7.png' },
  { id: 15, name: 'CFA LEVEL 2 | Full Mocks Part 1', image: '/5.png' },
  { id: 16, name: 'CFA LEVEL 2 | Full Mocks Part 2', image: '/6.png' },
  { id: 17, name: 'CFA LEVEL 2 | Individual Topics Mocks', image: '/2.png' },
  { id: 18, name: 'CFA LEVEL 2 | All Topics + 2 Full Mocks', image: '/8.png' }
];

const CourseSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '50px 0', backgroundColor: '#f4f4f4', textAlign: 'center' }} id="our-courses">
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '30px' }}>What We Offer !!</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // Maintains 3 courses per row
        gap: '20px',
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: 'auto',
        padding: '0 20px'
      }}>
        {courses.map(course => (
          <div key={course.id} style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            textAlign: 'center'
          }}>
            <img src={course.image} alt={course.name} style={{ width: '100%', height: 'auto', objectFit: 'cover', objectPosition: 'top' }} />
            <div style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>COURSE</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '10px 0', textAlign: 'center' }}>{course.name}</h3>
              <button 
                onClick={() => navigate('/login')} 
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#100b5c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#100b59'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#100b5c'}
              >
                Book Test
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 1024px) {
            #our-courses div {
              display: grid;
              grid-template-columns: repeat(1, 1fr) !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default CourseSection;
