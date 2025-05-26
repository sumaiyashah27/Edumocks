import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import '../css/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);

    // Show success message
    setSuccess(true);

    // Clear form fields
    setFormData({
      name: '',
      email: '',
      message: '',
    });

    // Hide message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="contact-container">
      <Container>
        <div className="text-center mb-5">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            <strong>This Company is under EDUINVEST ACADEMY</strong><br />
            We’d love to hear from you! Whether you have a question about our services,
            need support, or want to explore how we can work together — our team is ready to help.
          </p>
        </div>

        <Row>
          <Col xs={12} md={6} className="mb-4">
            <div className="contact-card h-100">
              <h4 className="section-title"><FaPhoneAlt className="section-icon" /> Get in Touch</h4>
              <div className="info-item mt-4">
                <h5>Phone</h5>
                <p>+91 7057621416</p>
              </div>
              <div className="info-item mt-4">
                <h5>Email</h5>
                <p>support@edumocks.com</p>
              </div>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="contact-card h-100">
              <h4 className="section-title"><FaEnvelopeOpenText className="section-icon" /> Send Us a Message</h4>
              <p className="text-muted mb-4">Have a specific inquiry? Fill out the form below and we’ll get back to you within 24 hours.</p>

              {success && (
                <Alert variant="success">
                  ✅ Thank you! Your message has been sent successfully.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="message" className="mb-3">
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <button type="submit" className="btn custom-btn w-100">
                  Send Message
                </button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
