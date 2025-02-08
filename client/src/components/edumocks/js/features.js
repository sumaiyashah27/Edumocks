import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiCalendar, BiQuestionMark, BiTimer, BiChart, BiRepeat, BiMailSend } from 'react-icons/bi';
import '../css/features.css';

const FeatureCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    { 
      icon: <BiCalendar size={30} />, 
      title: "Exam Schedule", 
      description: "Stay updated with the exam schedule and dates."
    },
    { 
      icon: <BiQuestionMark size={30} />, 
      title: "Unique Questions", 
      description: "Get access to unique and challenging mock questions."
    },
    { 
      icon: <BiTimer size={30} />, 
      title: "Timed Examinations", 
      description: "Take exams under realistic time constraints."
    },
    { 
      icon: <BiChart size={30} />, 
      title: "Progress Tracking", 
      description: "Track your progress with detailed reports and analytics."
    },
    { 
      icon: <BiRepeat size={30} />, 
      title: "Retest Options", 
      description: "Take retests to improve your performance."
    },
    { 
      icon: <BiMailSend size={30} />, 
      title: "Instant Test Solution", 
      description: "After exam instant test solutions sent to your registered email."
    },
  ];

  useEffect(() => {
    const isSmallScreen = window.innerWidth <= 768;
  
    if (isSmallScreen) {
      const cardCarousel = document.querySelector('.card-carousel');
      const cardWidth = cardCarousel.firstChild.offsetWidth + 20; // card width + margin
  
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % features.length;
          cardCarousel.scrollTo({
            left: cardWidth * newIndex,
            behavior: 'smooth',
          });
          return newIndex;
        });
      }, 1000); // 3 seconds for automatic carousel
  
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
      }, 3000); // 3 seconds for automatic carousel
  
      return () => clearInterval(interval);
    }
  }, [features.length]);
  
  

  return (
    <section className="features-section py-5" id='features'>
      <Container className='feature-container'> 
        <h2 className="text-center mb-2 fw-bold" style={{color: '#100b5c'}}>Features</h2>
        <p className="mb-4 text-center">
          Explore the amazing features we offer with our platform.
        </p>
        <Row className="justify-content-center">
          <div className="card-carousel">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`my-card ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="card-content">
                  <div className="icon">{feature.icon}</div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default FeatureCarousel;
