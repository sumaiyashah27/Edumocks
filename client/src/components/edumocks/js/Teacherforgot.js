import React, { useState } from 'react'; 
import { Button, Form, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import green check circle and eye icons
import { Link } from 'react-router-dom';

const Teachforgot = () => {
  const [step, setStep] = useState(1); // Step tracking (1 - email, 2 - password reset)
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false); // To track if email is verified
  const [showPasswordChangedModal, setShowPasswordChangedModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // To toggle visibility of password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // To toggle visibility of confirm password
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // Track the verification process state
  const navigate = useNavigate();

  // Email verification process
  const verifyEmail = () => {
    const validEmail = "surajpawar1253661@gmail.com"; // Hardcoded valid email for testing
    setIsVerifyingEmail(true); // Start verification process
    if (email === validEmail) {
      setEmailVerified(true);
      setTimeout(() => setStep(2), 2000); // Proceed to password change after delay
      setError('');
    } else {
      setError('Invalid email address. Please try again.');
    }
    setIsVerifyingEmail(false); // Stop verification process
  };

  // Handle form submission for email verification
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    verifyEmail(); // Verify email address
  };

  // Handle password reset submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Simulate password reset (backend logic should update password)
    console.log(`Password reset for ${email}`);
    setShowPasswordChangedModal(true); // Show password change success popup
    setTimeout(() => {
      navigate('/login'); // Redirect to login after 2 seconds
    }, 2000);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Form onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}>
            <h3 className="text-center mb-4">Teacher Forgot Password</h3>

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
                <Button
                  type="submit"
                  className="w-100"
                  disabled={isVerifyingEmail} // Disable button when verifying
                  variant={isVerifyingEmail ? 'light' : 'primary'} // Change color to light when clicked
                >
                  {isVerifyingEmail ? 'Verifying...' : 'Verify Email'}
                </Button>
                <p className="text-primary text-center m-3">
                  <Link to="/login" className="text-decoration-none text-primary">
                    Back
                  </Link>
                </p>
              </>
            )}

            {step === 2 && emailVerified && (
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

export default Teachforgot;
