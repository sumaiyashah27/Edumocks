import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const StudSignup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    countryCode: '+1',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/student/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/studLogin'), 3000);
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignupSuccess = async (response) => {
    const token = response.credential;
    console.log('Google Token:', token); // Log the token for verification
    
    try {
      // Send Google token to backend for verification and signup
      const googleUserData = await axios.post('/api/student/gsignup', { token });
    
      if (googleUserData.data.success) {
        setSuccess('Google Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/studLogin'), 3000);
      } else {
        setError(googleUserData.data.message || 'Google signup failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Google signup failed. Please try again.');
    }
  };
  
  return (
    <GoogleOAuthProvider clientId="1066864495489-a36j2vv904kp4tkptnvo80gsp40stnca.apps.googleusercontent.com">
      <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center' }}>Student Signup</h1>
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
          <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" name="countryCode" placeholder="Country Code (e.g., +1)" value={formData.countryCode} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          </div>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <GoogleLogin onSuccess={handleGoogleSignupSuccess} onError={() => console.error('Google Signup failed')} useOneTap />
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/studLogin')} style={{ color: '#007BFF', textDecoration: 'underline', cursor: 'pointer' }}>
            Log In
          </span>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default StudSignup;
