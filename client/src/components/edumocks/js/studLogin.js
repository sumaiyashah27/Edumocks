import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importing icons
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'; // For password visibility toggle
import '../css/Login.css'; // Import custom CSS
import { Link } from 'react-router-dom';

const StudLogin = () => {
  const [email, setEmail] = useState(''); // For email input
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/studpanel/book-test';

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError('Please provide both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/student/login', { email, password });

      if (response.data.success) {
        localStorage.setItem('_id', response.data._id);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('firstname', response.data.firstname);
        localStorage.setItem('lastname', response.data.lastname);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('role', 'student');

        // 👇 navigate where user originally intended
        navigate(from, { state: location.state });
      } else {
        setError('Invalid Email or Password');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // Google token
    
    console.log('Sending Google Token to backend:', token); // Log token being sent
    
    try {
      const response = await axios.post('/api/student/glogin', { token });
    
      console.log('Backend Response:', response.data); // Log the response from the backend
    
      if (response.data.success) {
        // Successfully logged in, store user details in localStorage
        localStorage.setItem('_id', response.data._id);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('firstname', response.data.firstname);
        localStorage.setItem('lastname', response.data.lastname);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('role', 'student');
    
        // Navigate to TeachPanel page
        navigate(from, { state: location.state });
      } else {
        setError('Google Login failed or account not registered');
        console.log('Login failed:', response.data.message); // Log failure message
      }
    } catch (error) {
      console.error('Google Login Error:', error); // Log any error from the backend
      setError('Google Login failed. Please try again.');
    }
  };
  
  
  return (
    <GoogleOAuthProvider clientId="1066864495489-a36j2vv904kp4tkptnvo80gsp40stnca.apps.googleusercontent.com">
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Row className="w-100">
          <Col md={6} lg={4} className="mx-auto">
            <Card className="login-card shadow-lg border-0 rounded">
              <Card.Body>
                <h2 className="text-center mb-4 text-white">Student Login</h2>
                <Form onSubmit={handleStudentLogin}>
                  <Form.Group controlId="StudentId" className="mb-3 position-relative">
                    <Form.Label style={{ color: '#100b5c' }}>Email </Form.Label>
                    <div className="input-with-icon">
                      <FaEnvelope className="input-icon" />
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        placeholder="Enter Email"
                        required
                        className="input-field"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-4 position-relative">
                    <Form.Label style={{ color: '#100b5c' }}>Password</Form.Label>
                    <div className="input-with-icon">
                      <FaLock className="input-icon" />
                      <Form.Control
                        type={passwordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="input-field"
                      />
                      <span
                        className="eye-icon"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? <RiEyeOffLine /> : <RiEyeLine />}
                      </span>
                    </div>
                  </Form.Group>

                  <Button type="submit" className="w-100 mb-3 login-button">
                    Login
                  </Button>
                  
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => console.log('Google Login failed')}
                    className="w-100 mt-3 mb-3 "
                    theme="filled_blue"
                  />
                  {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                  <div className="mt-3 text-center">
                    <Link to="/studForget" className="text-primary">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Added Signup Link */}
                  <div className="mt-3 text-center">
                    <p className="text-primary">
                      
                    <Link to="/studSignup" className="text-danger">
                      Don't have an account?{' '}
                        Signup
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default StudLogin;