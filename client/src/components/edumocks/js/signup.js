import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [signupType, setSignupType] = useState(''); // 'student' or 'teacher'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle signup type selection
  const handleSignupType = (type) => {
    setSignupType(type);
    setError(''); // Clear any errors
    // Navigate to the respective signup page based on the type
    if (type === 'student') {
      navigate('/studSignup');
    } else if (type === 'teacher') {
      navigate('/teachSignup');
    }
  };

  // Navigate to login page
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Signup</h1>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      {!signupType ? (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button onClick={() => handleSignupType('student')} style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', }} >
            Student Signup
          </button>
          <button onClick={() => handleSignupType('teacher')}  style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', }} >
            Teacher Signup
          </button>
        </div>
      ) : (
        // This section could display a form or specific content based on the signup type
        <div style={{ textAlign: 'center' }}>
          <p>{signupType === 'student' ? 'Student Signup Form' : 'Teacher Signup Form'}</p>
          {/* Additional form content could go here */}
        </div>
      )}

      {/* Option to go to Login page if already registered */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleLoginRedirect}  style={{ background: 'none', color: '#007BFF', border: 'none', cursor: 'pointer', textDecoration: 'underline', }} >
          Already registered? Log in
        </button>
      </div>

      {signupType && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setSignupType('')} style={{ background: 'none', color: '#007BFF', border: 'none', cursor: 'pointer', textDecoration: 'underline', }} >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Signup;
