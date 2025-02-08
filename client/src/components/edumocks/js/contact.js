import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../css/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="contact-container">
      <div className="contact-header text-center">
        <h1 style={{color: '#100b5c', fontWeight: 600}}>Contact Us</h1>
        <p>We'd love to hear from you! Reach out with any questions or feedback.</p>
      </div>

      <Container>
        <Row>
          {/* First Column (Phone and Email) */}
          <Col xs={12} md={6} className="contact-info">
            <div className="contact-info-item">
              <FaPhoneAlt className="contact-icon" />
              <h3>Phone</h3>
              <p>+91 7057621416</p>
            </div>

            <div className="contact-info-item">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>support@edumocks.com</p>
            </div>
          </Col>

          {/* Second Column (Form) */}
          <Col xs={12} md={6} className="contact-form">
            <h2>Send Us a Message</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="message">
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <button type="submit" className="mt-3">Send Message</button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
