import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconEnvelope = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconEyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

// --- INLINE CSS STYLES ---
const LoginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --sl-color-primary: #101D42;
    --sl-color-accent: #FCA311;
    --sl-color-bg: #F8F9FA;
    --sl-color-bg-card: #FFFFFF;
    --sl-color-text-dark: #141414;
    --sl-color-text-light: #FFFFFF;
    --sl-color-text-muted: #6c757d;
    --sl-color-border: #e9ecef;
    --sl-color-error: #dc3545;
  }

  .sl-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--sl-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .sl-container {
    max-width: 900px;
    width: 100%;
  }

  .sl-card {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    background-color: var(--sl-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* --- Left Branding Panel --- */
  .sl-branding-panel {
    background: linear-gradient(135deg, var(--sl-color-primary), #1a2a4c);
    color: var(--sl-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .sl-branding-panel h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .sl-branding-panel p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  /* --- Right Form Panel --- */
  .sl-form-panel {
    padding: 3rem;
  }
  
  .sl-form-panel h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--sl-color-text-dark);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .sl-form-group {
    margin-bottom: 1.25rem;
  }
  
  .sl-input-wrapper {
    position: relative;
  }
  
  .sl-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    border: 1px solid var(--sl-color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .sl-input:focus {
    outline: none;
    border-color: var(--sl-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }
  
  .sl-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--sl-color-text-muted);
  }

  .sl-eye-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--sl-color-text-muted);
  }
  
  .sl-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--sl-color-accent);
    color: var(--sl-color-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .sl-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }
  
  .sl-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.5rem 0;
    color: var(--sl-color-text-muted);
  }

  .sl-divider::before, .sl-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--sl-color-border);
  }

  .sl-divider:not(:empty)::before { margin-right: .5em; }
  .sl-divider:not(:empty)::after { margin-left: .5em; }
  
  .sl-google-btn-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .sl-links {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .sl-link {
    color: var(--sl-color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .sl-link:hover { text-decoration: underline; }
  
  .sl-error-message {
    color: var(--sl-color-error);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .sl-card { grid-template-columns: 1fr; }
    .sl-branding-panel { display: none; }
    .sl-form-panel { padding: 2.5rem; }
  }
`;


const StudLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const googleButtonRef = useRef(null);
    const from = '/studpanel/book-test'; // Hardcoded redirect path

    const handleGoogleLoginSuccess = useCallback(async (credentialResponse) => {
        const token = credentialResponse.credential;
        try {
            const response = await axios.post('/api/student/glogin', { token });
            if (response.data.success) {
                localStorage.setItem('_id', response.data._id);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('firstname', response.data.firstname);
                localStorage.setItem('lastname', response.data.lastname);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('role', 'student');
                window.location.href = from;
            } else {
                setError('Google Login failed or account not registered.');
            }
        } catch (error) {
            console.error('Google Login Error:', error);
            setError('Google Login failed. Please try again.');
        }
    }, [from]);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = LoginStyles;
        document.head.appendChild(styleElement);

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
             if (window.google && googleButtonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: "1066864495489-a36j2vv904kp4tkptnvo80gsp40stnca.apps.googleusercontent.com",
                    callback: handleGoogleLoginSuccess
                });
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "outline", size: "large", shape: "pill", width: "300px" } 
                );
            }
        };
        document.body.appendChild(script);

        return () => {
            document.head.removeChild(styleElement);
             const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (googleScript) {
                 document.body.removeChild(googleScript);
            }
        };
    }, [handleGoogleLoginSuccess]);

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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
                window.location.href = from;
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="sl-section">
            <motion.div 
                className="sl-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="sl-card">
                    <div className="sl-branding-panel">
                        <h1>Student Portal</h1>
                        <p>Access your dashboard, book mock tests, and track your progress.</p>
                    </div>
                    <div className="sl-form-panel">
                        <h2>Student Login</h2>
                        <form onSubmit={handleStudentLogin}>
                            <div className="sl-form-group">
                                <div className="sl-input-wrapper">
                                    <i className="sl-input-icon"><IconEnvelope /></i>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                        placeholder="Enter your email"
                                        required
                                        className="sl-input"
                                    />
                                </div>
                            </div>
                            <div className="sl-form-group">
                                <div className="sl-input-wrapper">
                                    <i className="sl-input-icon"><IconLock /></i>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="sl-input"
                                    />
                                    <i className="sl-eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                                        {passwordVisible ? <IconEyeOff /> : <IconEye />}
                                    </i>
                                </div>
                            </div>
                            <button type="submit" className="sl-submit-btn" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        
                        <div className="sl-divider">or</div>

                        <div className="sl-google-btn-wrapper" ref={googleButtonRef}>
                            {/* Google Button is rendered here by the script */}
                        </div>

                        {error && <p className="sl-error-message">{error}</p>}
                        
                        <div className="sl-links">
                            <a href="/studForget" className="sl-link">Forgot Password?</a>
                            <span style={{margin: '0 0.5rem'}}>|</span>
                            <a href="/studSignup" className="sl-link">Don't have an account? Sign Up</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default StudLogin;

