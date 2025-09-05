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
    --tl-color-primary: #101D42;
    --tl-color-accent: #FCA311;
    --tl-color-bg: #F8F9FA;
    --tl-color-bg-card: #FFFFFF;
    --tl-color-text-dark: #141414;
    --tl-color-text-light: #FFFFFF;
    --tl-color-text-muted: #6c757d;
    --tl-color-border: #e9ecef;
    --tl-color-error: #dc3545;
  }

  .tl-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--tl-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .tl-container {
    max-width: 900px;
    width: 100%;
  }

  .tl-card {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    background-color: var(--tl-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* --- Left Branding Panel --- */
  .tl-branding-panel {
    background: linear-gradient(135deg, var(--tl-color-primary), #1a2a4c);
    color: var(--tl-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .tl-branding-panel h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .tl-branding-panel p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  /* --- Right Form Panel --- */
  .tl-form-panel {
    padding: 3rem;
  }
  
  .tl-form-panel h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--tl-color-text-dark);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .tl-form-group {
    margin-bottom: 1.25rem;
  }
  
  .tl-input-wrapper {
    position: relative;
  }
  
  .tl-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    border: 1px solid var(--tl-color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .tl-input:focus {
    outline: none;
    border-color: var(--tl-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }
  
  .tl-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--tl-color-text-muted);
  }

  .tl-eye-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--tl-color-text-muted);
  }
  
  .tl-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--tl-color-accent);
    color: var(--tl-color-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .tl-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }
  
  .tl-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.5rem 0;
    color: var(--tl-color-text-muted);
  }

  .tl-divider::before, .tl-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--tl-color-border);
  }

  .tl-divider:not(:empty)::before { margin-right: .5em; }
  .tl-divider:not(:empty)::after { margin-left: .5em; }
  
  .tl-google-btn-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .tl-links {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .tl-link {
    color: var(--tl-color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .tl-link:hover { text-decoration: underline; }
  
  .tl-error-message {
    color: var(--tl-color-error);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .tl-card { grid-template-columns: 1fr; }
    .tl-branding-panel { display: none; }
    .tl-form-panel { padding: 2.5rem; }
  }
`;


const TeacherLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const googleButtonRef = useRef(null);

    const handleGoogleLoginSuccess = useCallback(async (credentialResponse) => {
        const token = credentialResponse.credential;
        try {
            const response = await axios.post('/api/teacher/glogin', { token });
            if (response.data.success) {
                localStorage.setItem('_id', response.data._id);
                localStorage.setItem('teachId', response.data.teachId);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('firstname', response.data.firstname);
                localStorage.setItem('lastname', response.data.lastname);
                localStorage.setItem('email', response.data.email);
                window.location.href = '/teachpanel/dashboard';
            } else {
                setError('Google Login failed or account not registered.');
            }
        } catch (error) {
            console.error('Google Login Error:', error);
            setError('Google Login failed. Please try again.');
        }
    }, []);

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

    const handleTeacherLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please provide both email and password');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/teacher/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('_id', response.data._id);
                localStorage.setItem('teachId', response.data.teachId);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('firstname', response.data.firstname);
                localStorage.setItem('lastname', response.data.lastname);
                localStorage.setItem('email', response.data.email);
                window.location.href = '/teachpanel/dashboard';
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
        <section className="tl-section">
            <motion.div 
                className="tl-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="tl-card">
                    <div className="tl-branding-panel">
                        <h1>Teacher Portal</h1>
                        <p>Manage your courses, review student progress, and access teaching resources.</p>
                    </div>
                    <div className="tl-form-panel">
                        <h2>Teacher Login</h2>
                        <form onSubmit={handleTeacherLogin}>
                            <div className="tl-form-group">
                                <div className="tl-input-wrapper">
                                    <i className="tl-input-icon"><IconEnvelope /></i>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                        placeholder="Enter your email"
                                        required
                                        className="tl-input"
                                    />
                                </div>
                            </div>
                            <div className="tl-form-group">
                                <div className="tl-input-wrapper">
                                    <i className="tl-input-icon"><IconLock /></i>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="tl-input"
                                    />
                                    <i className="tl-eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                                        {passwordVisible ? <IconEyeOff /> : <IconEye />}
                                    </i>
                                </div>
                            </div>
                            <button type="submit" className="tl-submit-btn" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        
                        <div className="tl-divider">or</div>

                        <div className="tl-google-btn-wrapper" ref={googleButtonRef}>
                            {/* Google Button is rendered here by the script */}
                        </div>

                        {error && <p className="tl-error-message">{error}</p>}
                        
                        <div className="tl-links">
                            <a href="/teachForget" className="tl-link">Forgot Password?</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default TeacherLogin;
