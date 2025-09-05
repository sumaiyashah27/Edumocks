import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconEnvelope = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconEye = () => <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconEyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;


// --- INLINE CSS STYLES ---
const SignupStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --ss-color-primary: #101D42;
    --ss-color-accent: #FCA311;
    --ss-color-bg: #F8F9FA;
    --ss-color-bg-card: #FFFFFF;
    --ss-color-text-dark: #141414;
    --ss-color-text-light: #FFFFFF;
    --ss-color-text-muted: #6c757d;
    --ss-color-border: #e9ecef;
    --ss-color-error: #dc3545;
    --ss-color-success: #28a745;
  }

  .ss-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--ss-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .ss-container {
    max-width: 900px;
    width: 100%;
  }

  .ss-card {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    background-color: var(--ss-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* Left Branding Panel */
  .ss-branding-panel {
    background: linear-gradient(135deg, var(--ss-color-primary), #1a2a4c);
    color: var(--ss-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .ss-branding-panel h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .ss-branding-panel p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  /* Right Form Panel */
  .ss-form-panel {
    padding: 2.5rem;
    position: relative;
  }
  
  .ss-form-panel h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--ss-color-text-dark);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .ss-form-group {
    margin-bottom: 1rem;
  }
  
  .ss-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .ss-input-wrapper {
    position: relative;
  }
  
  .ss-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1px solid var(--ss-color-border);
    border-radius: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }
  
  .ss-input:focus {
    outline: none;
    border-color: var(--ss-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }
  
  .ss-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ss-color-text-muted);
  }

  .ss-eye-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--ss-color-text-muted);
  }
  
  .ss-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--ss-color-accent);
    color: var(--ss-color-primary);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }
  
  .ss-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }
  
  .ss-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.25rem 0;
    color: var(--ss-color-text-muted);
    font-size: 0.8rem;
  }

  .ss-divider::before, .ss-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--ss-color-border);
  }

  .ss-divider:not(:empty)::before { margin-right: .5em; }
  .ss-divider:not(:empty)::after { margin-left: .5em; }
  
  .ss-google-btn-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .ss-links {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .ss-link {
    color: var(--ss-color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .ss-link:hover { text-decoration: underline; }
  
  .ss-error-message {
    color: var(--ss-color-error);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .ss-success-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    z-index: 10;
  }
  
  .ss-success-overlay__icon { color: var(--ss-color-success); }
  .ss-success-overlay__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ss-color-primary);
    margin-top: 1.5rem;
  }
  .ss-success-overlay__text {
    color: var(--ss-color-text-muted);
    margin-top: 0.5rem;
  }
  

  /* Responsive */
  @media (max-width: 900px) {
    .ss-card { grid-template-columns: 1fr; }
    .ss-branding-panel { display: none; }
    .ss-form-panel { padding: 2.5rem; }
  }
   @media (max-width: 576px) {
    .ss-form-row { grid-template-columns: 1fr; }
    .ss-form-panel { padding: 1.5rem; }
  }
`;

const StudSignup = () => {
    const [formData, setFormData] = useState({
        firstname: '', lastname: '', email: '', phone: '',
        password: '', confirmPassword: '', countryCode: '+91'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const googleButtonRef = useRef(null);

    const handleGoogleSignupSuccess = useCallback(async (response) => {
        const token = response.credential;
        try {
            const googleUserData = await axios.post('/api/student/gsignup', { token });
            if (googleUserData.data.success) {
                setIsSubmitted(true);
                setTimeout(() => window.location.href = '/studLogin', 3000);
            } else {
                setError(googleUserData.data.message || 'Google signup failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred during Google signup.');
        }
    }, []);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = SignupStyles;
        document.head.appendChild(styleElement);

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google && googleButtonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: "1066864495489-a36j2vv904kp4tkptnvo80gsp40stnca.apps.googleusercontent.com",
                    callback: handleGoogleSignupSuccess
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
            if (googleScript) document.body.removeChild(googleScript);
        };
    }, [handleGoogleSignupSuccess]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/student/signup', formData);
            if (response.data.success) {
                setIsSubmitted(true);
                setTimeout(() => window.location.href = '/studLogin', 3000);
            } else {
                setError(response.data.message || 'Signup failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="ss-section">
            <motion.div className="ss-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="ss-card">
                    <div className="ss-branding-panel">
                        <h1>Create Your Student Account</h1>
                        <p>Join our community to start your journey with our expert-led mock tests.</p>
                    </div>
                    <div className="ss-form-panel">
                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div className="ss-success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="ss-success-overlay__icon"><IconCheckCircle /></div>
                                    <h3 className="ss-success-overlay__title">Signup Successful!</h3>
                                    <p className="ss-success-overlay__text">Redirecting you to the login page...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <h2>Student Signup</h2>
                        <form onSubmit={handleSubmit}>
                             <div className="ss-form-row">
                                <div className="ss-input-wrapper">
                                    <i className="ss-input-icon"><IconUser /></i>
                                    <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required className="ss-input" />
                                </div>
                                 <div className="ss-input-wrapper">
                                    <i className="ss-input-icon"><IconUser /></i>
                                    <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required className="ss-input" />
                                </div>
                            </div>

                            <div className="ss-form-group">
                                <div className="ss-input-wrapper">
                                    <i className="ss-input-icon"><IconEnvelope /></i>
                                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="ss-input" />
                                </div>
                            </div>
                            
                             <div className="ss-input-wrapper">
                                <i className="ss-input-icon"><IconPhone /></i>
                                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="ss-input" />
                            </div>

                            <div className="ss-form-group" style={{marginTop: '1rem'}}>
                                <div className="ss-input-wrapper">
                                    <i className="ss-input-icon"><IconLock /></i>
                                    <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="ss-input" />
                                    <i className="ss-eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <IconEyeOff /> : <IconEye />}</i>
                                </div>
                            </div>

                            <div className="ss-form-group">
                                <div className="ss-input-wrapper">
                                    <i className="ss-input-icon"><IconLock /></i>
                                    <input type={confirmPasswordVisible ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="ss-input" />
                                    <i className="ss-eye-icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>{confirmPasswordVisible ? <IconEyeOff /> : <IconEye />}</i>
                                </div>
                            </div>

                            <button type="submit" className="ss-submit-btn" disabled={loading}>{loading ? 'Signing Up...' : 'Create Account'}</button>
                        </form>
                        
                        <div className="ss-divider">or</div>

                        <div className="ss-google-btn-wrapper" ref={googleButtonRef}></div>

                        {error && <p className="ss-error-message">{error}</p>}
                        
                        <div className="ss-links">
                            <a href="/studLogin" className="ss-link">Already have an account? Log In</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default StudSignup;
