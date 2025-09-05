import React from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from "framer-motion"; // Import motion
import '../css/Hero.css';

// Animation variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

// Animation variants for child elements
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const Home = () => {
  return (
    <div>
      <section className="hero-section" id="home">
        <div className="hero-overlay d-flex align-items-center">
          <Container className="hero-container">
            <Row>
              <Col md={8} lg={6} className="text-left text-col">
                {/* Wrap the content in a motion.div for staggered animations */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Heading */}
                  <motion.h1 className="hero-heading" variants={itemVariants}>
                    Boost Your CFA Exam Preparation to the Next Level
                  </motion.h1>

                  {/* Paragraph */}
                  <motion.p className="hero-description" variants={itemVariants}>
                    Ace your CFA preparation with mock tests that closely resemble the real exam, offering instant feedback and valuable insights.
                  </motion.p>
                  
                  {/* Button */}
                  <motion.div variants={itemVariants}>
                    <Button href="#our-courses" className="hero-button">
                      <span>Get Started</span>
                      <FaArrowRight className="button-icon" />
                    </Button>
                  </motion.div>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </div>
  );
};

export default Home;