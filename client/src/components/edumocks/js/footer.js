import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'; // For social icons
import { Link as ScrollLink } from 'react-scroll'; // Import ScrollLink from react-scroll
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-light">
      <Container>
        <Row className="footer-content">
          {/* Logo and Description */}
          <Col md={4} className="footer-column">
            <img src="/logo192.png" alt="Logo" className="footer-logo mb-3" />
            <p className="footer-description">
              We are committed to providing top-tier educational services and a seamless learning experience
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="social-icon" />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="footer-column">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><ScrollLink to="about" smooth={true} duration={500}>About</ScrollLink></li>
              <li><ScrollLink to="our-courses" smooth={true} duration={500}>Courses</ScrollLink></li>
              <li><ScrollLink to="testimonials" smooth={true} duration={500}>Testimonial</ScrollLink></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          {/* Help & Support */}
          <Col md={4} className="footer-column">
            <h5 className="footer-title">Help & Support</h5>
            <ul className="footer-links">
              <li> <Link to="/privacy-policy">Privacy Policy</Link></li>
              <li> <Link to="/terms-conditions">Terms and Conditions</Link> </li>
              <li> <Link to="/refund-policy">Refund Policy</Link> </li>
            </ul>
          </Col>
        </Row>

        {/* Footer Bottom Section */}
        <Row className="footer-bottom">
          <Col className="text-center">
            <p className="footer-text">
              Design and Developed by <a href="https://globalgrowthmarketing.com/" className='text-primary'>GlobalGrowthMarketing</a>
            </p>
            {/* Underlined "All rights reserved" text */}
            <p className="footer-text footer-rights">
              &copy; {new Date().getFullYear()} Edumocks. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
