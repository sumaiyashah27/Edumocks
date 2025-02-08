import React from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';  // Import the Get Started (Arrow) Icon
import '../css/Hero.css';

const Home = () => {
  return (
    <div>
      <section className="hero-section" id="home">
        <div className="hero-overlay d-flex align-items-center">
          <Container className="hero-container ">
            <Row>
              <Col md={6} className="text-left text-col">
                {/* Heading */}
                <h1 className="hero-heading">
                  Boost Your CFA Exam Preparation to the Next Level
                </h1>

                {/* Paragraph */}
                <p className="hero-description">
                  Ace your CFA preparation with mock tests that closely resemble the real exam, offering instant feedback and valuable insights.
                </p>
                  <Button
                    href="#our-courses"
                    className="fs-5"
                    style={{
                      backgroundColor: "#c80d18",
                      color: "#fff",
                      border: "none",
                      borderRadius: '35px',
                      padding: "10px 20px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Get Started
                    <FaArrowRight className="ml-2" /> {/* Icon added to button */}
                  </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </div>
  );
};

export default Home;
