import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const courses = [
  { id: 1, name: 'CFA LEVEL 1 | Quantitative Methods', image: '/10.png', oldPrice: 19, newPrice: 9, info: 'This includes mock tests, full-length exams, and expert tips.', },
  { id: 2, name: 'CFA LEVEL 1 | Ethics', image: '/9.png', oldPrice: 19, newPrice: 9 },
  { id: 3, name: 'CFA LEVEL 1 | Economics', image: '/11.png', oldPrice: 19, newPrice: 9 },
  { id: 4, name: 'CFA LEVEL 1 | Financial Statement Analysis', image: '/12.png', oldPrice: 19, newPrice: 9 },
  { id: 5, name: 'CFA LEVEL 1 | Corporate Issuers', image: '/13.png', oldPrice: 19, newPrice: 9 },
  { id: 6, name: 'CFA LEVEL 1 | Equity Investments', image: '/14.png', oldPrice: 19, newPrice: 9 },
  { id: 7, name: 'CFA LEVEL 1 | Fixed Income', image: '/15.png', oldPrice: 19, newPrice: 9 },
  { id: 8, name: 'CFA LEVEL 1 | Derivatives', image: '/16.png', oldPrice: 19, newPrice: 9 },
  { id: 9, name: 'CFA LEVEL 1 | Alternative Investments', image: '/17.png', oldPrice: 19, newPrice: 9 },
  { id: 10, name: 'CFA LEVEL 1 | Portfolio Management', image: '/18.png', oldPrice: 19, newPrice: 9 },
  { id: 11, name: 'CFA LEVEL 1 | Full Mocks Part 1', image: '/3.png', oldPrice: 39, newPrice: 19 },
  { id: 12, name: 'CFA LEVEL 1 | Full Mocks Part 2', image: '/4.png', oldPrice: 39, newPrice: 19 },
  // { id: 13, name: 'CFA LEVEL 1 | Individual Topics Mocks', oldPrice: 1299, newPrice: 699 },
  { id: 14, name: 'CFA LEVEL 1 | All Topics + 2 Full Mocks', image: '/7.png', oldPrice: 149, newPrice: 99 },
  { id: 15, name: 'CFA LEVEL 2 | Quantitative Methods', image: '/10.png', oldPrice: 19, newPrice: 9 },
  { id: 16, name: 'CFA LEVEL 2 | Ethics', image: '/9.png', oldPrice: 19, newPrice: 9 },
  { id: 17, name: 'CFA LEVEL 2 | Economics', image: '/11.png', oldPrice: 19, newPrice: 9 },
  { id: 18, name: 'CFA LEVEL 2 | Financial Statement Analysis', image: '/12.png', oldPrice: 19, newPrice: 9 },
  { id: 19, name: 'CFA LEVEL 2 | Corporate Issuers', image: '/13.png', oldPrice: 19, newPrice: 9 },
  { id: 20, name: 'CFA LEVEL 2 | Equity Investments', image: '/14.png', oldPrice: 19, newPrice: 9 },
  { id: 21, name: 'CFA LEVEL 2 | Fixed Income', image: '/15.png', oldPrice: 19, newPrice: 9 },
  { id: 22, name: 'CFA LEVEL 2 | Derivatives', image: '/16.png', oldPrice: 19, newPrice: 9 },
  { id: 23, name: 'CFA LEVEL 2 | Alternative Investments', image: '/17.png', oldPrice: 19, newPrice: 9 },
  { id: 24, name: 'CFA LEVEL 2 | Portfolio Management', image: '/18.png', oldPrice: 19, newPrice: 9 },
  { id: 25, name: 'CFA LEVEL 2 | Full Mocks Part 1', image: '/5.png', oldPrice: 39, newPrice: 19 },
  { id: 26, name: 'CFA LEVEL 2 | Full Mocks Part 2', image: '/6.png', oldPrice: 39, newPrice: 19 },
  { id: 27, name: 'CFA LEVEL 2 | All Topics + 2 Full Mocks', image: '/8.png', oldPrice: 149, newPrice: 99 }
];

const CourseSection = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleBookClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  return (
    <section style={{ padding: '50px 0', backgroundColor: '#f4f4f4', textAlign: 'center' }} id="our-courses">
      <p style={{ fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '30px' }}>What We Offer !!</p>
      <div className="courses-container">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-content">
              <span className="course-label">COURSE</span>
              <h3 className="course-title">{course.name}</h3>

              <div className="course-price">
                <span className="old-price">₹{course.oldPrice}</span>
                <span className="new-price">₹{course.newPrice}</span>
              </div>

              <button onClick={() => handleBookClick(course)} className="book-btn">
                Book Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content position-relative">
            {/* Close Icon */}
            <FaTimes
              onClick={() => setShowModal(false)}
              className="position-absolute"
              style={{
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#888'
              }}
            />
            <h2>{selectedCourse.name}</h2>
            <span> <strong>About this Course :</strong> <p>{selectedCourse.info}</p></span>
            <p><strong>Price:</strong> ₹{selectedCourse.newPrice}</p>
            <span><strong>PACKAGE INCLUSIONS:</strong> <p>• Mocks included: Mock 1, Mock 2, Mock 3 and Mock 4• Each mock includes:</p> </span>
            <button style={{ transition: "background-color 0.3s ease, transform 0.3s ease" }} onClick={() => navigate('/login')} className="book-btn">Proceed to Book</button>
            <button style={{ backgroundColor: "#C80D18", color: "#fff", padding: "12px 25px", fontSize: "1.2rem", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: "10px", transition: "background-color 0.3s ease, transform 0.3s ease" }} onClick={() => setShowModal(false)} className="book-btn">Close</button>
          </div>
        </div>
       
      )}

      <style>
        {`
          .courses-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr); /* 4 courses per row */
            gap: 20px;
            justify-content: center;
            max-width: 1200px;
            margin: auto;
            padding: 0 20px;
          }

          .course-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            text-align: center;
          }

          .course-image {
            width: 100%;
            height: auto;
            object-fit: cover;
            object-position: top;
          }

          .course-content {
            padding: 20px;
          }

          .course-price {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  font-size: 1.1rem;
}

.old-price {
  text-decoration: line-through;
  color: #999;
}

.new-price {
  color: #e53935;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 700px;
  text-align: center;
}

.book-btn {
  margin: 10px;
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn {
  background: #ccc;
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

          .course-label {
            font-size: 0.8rem;
            color: #6c757d;
          }

          .course-title {
            font-size: 1.1rem;
            font-weight: bold;
            margin: 10px 0;
            text-align: center;
          }

          .book-btn {
            padding: 10px 20px;
            background-color: #100b5c;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .book-btn:hover {
            background-color: #100b59;
          }

          /* Responsive adjustments */
          @media (max-width: 1024px) {
            .courses-container {
              grid-template-columns: repeat(2, 1fr); /* 2 courses per row */
            }
          }

          @media (max-width: 768px) {
            .courses-container {
              grid-template-columns: repeat(1, 1fr); /* 1 course per row */
            }
          }
        `}
      </style>
    </section>
  );
};

export default CourseSection;
