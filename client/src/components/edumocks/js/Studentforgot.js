import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import green check circle and eye icons
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Studforgot = () => {
  const [step, setStep] = useState(1); // Step tracking (1 - email, 2 - email verification, 3 - password reset)
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false); // Track email verification status
  const [showEmailVerifiedModal, setShowEmailVerifiedModal] = useState(false); // To show email verification success popup
  const [showPasswordChangedModal, setShowPasswordChangedModal] = useState(false); // To show password changed success popup
  const [passwordVisible, setPasswordVisible] = useState(false); // To toggle visibility of password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // To toggle visibility of confirm password
  const navigate = useNavigate();

  // Handle form submission for email (email verification)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch('/api/student/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setEmailVerified(true);
        setShowEmailVerifiedModal(true);
        setTimeout(() => setStep(3), 2000); // Proceed to password reset
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };
  

  // Handle password reset submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('/api/student/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShowPasswordChangedModal(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error resetting password. Please try again.');
    }
  };
  

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Form onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}>
            <h3 className="text-center mb-4">Student Forgot Password</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            {step === 1 && (
              <>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100">
                  Verify Email
                </Button>
                <p className="text-primary text-center m-3">
                  <Link to="/login" className="text-decoration-none text-primary">
                    Back
                  </Link>
                </p>
              </>
            )}

            {step === 3 && emailVerified && (
              <>
                <Form.Group controlId="formNewPassword" className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Button type="submit" className="w-100">
                  Reset Password
                </Button>
              </>
            )}
          </Form>
        </Col>
      </Row>

      {/* Email Verified Modal */}
      <Modal show={showEmailVerifiedModal} onHide={() => setShowEmailVerifiedModal(false)} centered>
        <Modal.Body className="text-center">
          <FaCheckCircle color="green" size={50} />
          <h4 className="mt-3">Email Verified Successfully!</h4>
        </Modal.Body>
      </Modal>

      {/* Password Changed Modal */}
      <Modal show={showPasswordChangedModal} onHide={() => setShowPasswordChangedModal(false)} centered>
        <Modal.Body className="text-center">
          <FaCheckCircle color="green" size={50} />
          <h4 className="mt-3">Password Changed Successfully!</h4>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Studforgot;
