import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconEnvelope = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconEyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;


// --- INLINE CSS STYLES ---
const SignupStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --ts-color-primary: #101D42;
    --ts-color-accent: #FCA311;
    --ts-color-bg: #F8F9FA;
    --ts-color-bg-card: #FFFFFF;
    --ts-color-text-dark: #141414;
    --ts-color-text-light: #FFFFFF;
    --ts-color-text-muted: #6c757d;
    --ts-color-border: #e9ecef;
    --ts-color-error: #dc3545;
    --ts-color-success: #28a745;
  }

  .ts-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--ts-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .ts-container {
    max-width: 900px;
    width: 100%;
  }

  .ts-card {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    background-color: var(--ts-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* Left Branding Panel */
  .ts-branding-panel {
    background: linear-gradient(135deg, var(--ts-color-primary), #1a2a4c);
    color: var(--ts-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .ts-branding-panel h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .ts-branding-panel p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  /* Right Form Panel */
  .ts-form-panel {
    padding: 2.5rem;
    position: relative;
  }
  
  .ts-form-panel h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--ts-color-text-dark);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .ts-form-group {
    margin-bottom: 1rem;
  }
  
  .ts-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .ts-input-wrapper {
    position: relative;
  }
  
  .ts-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1px solid var(--ts-color-border);
    border-radius: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }
  
  .ts-input:focus {
    outline: none;
    border-color: var(--ts-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }
  
  .ts-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ts-color-text-muted);
  }

  .ts-eye-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--ts-color-text-muted);
  }
  
  .ts-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--ts-color-accent);
    color: var(--ts-color-primary);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }
  
  .ts-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }
  
  .ts-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.25rem 0;
    color: var(--ts-color-text-muted);
    font-size: 0.8rem;
  }

  .ts-divider::before, .ts-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--ts-color-border);
  }

  .ts-divider:not(:empty)::before { margin-right: .5em; }
  .ts-divider:not(:empty)::after { margin-left: .5em; }
  
  .ts-google-btn-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .ts-links {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .ts-link {
    color: var(--ts-color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .ts-link:hover { text-decoration: underline; }
  
  .ts-error-message {
    color: var(--ts-color-error);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .ts-success-overlay {
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
  
  .ts-success-overlay__icon { color: var(--ts-color-success); }
  .ts-success-overlay__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ts-color-primary);
    margin-top: 1.5rem;
  }
  .ts-success-overlay__text {
    color: var(--ts-color-text-muted);
    margin-top: 0.5rem;
  }
  

  /* Responsive */
  @media (max-width: 900px) {
    .ts-card { grid-template-columns: 1fr; }
    .ts-branding-panel { display: none; }
    .ts-form-panel { padding: 2.5rem; }
  }
   @media (max-width: 576px) {
    .ts-form-row { grid-template-columns: 1fr; }
    .ts-form-panel { padding: 1.5rem; }
  }
`;

const TeachSignup = () => {
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
            const googleUserData = await axios.post('/api/teacher/gsignup', { token });
            if (googleUserData.data.success) {
                setIsSubmitted(true);
                setTimeout(() => window.location.href = '/teachLogin', 3000);
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
            const response = await axios.post('/api/teacher/signup', formData);
            if (response.data.success) {
                setIsSubmitted(true);
                setTimeout(() => window.location.href = '/teachLogin', 3000);
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
        <section className="ts-section">
            <motion.div className="ts-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="ts-card">
                    <div className="ts-branding-panel">
                        <h1>Teacher Registration</h1>
                        <p>Join our team of expert educators and start making an impact today.</p>
                    </div>
                    <div className="ts-form-panel">
                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div className="ts-success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="ts-success-overlay__icon"><IconCheckCircle /></div>
                                    <h3 className="ts-success-overlay__title">Signup Successful!</h3>
                                    <p className="ts-success-overlay__text">Redirecting you to the login page...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <h2>Create Teacher Account</h2>
                        <form onSubmit={handleSubmit}>
                             <div className="ts-form-row">
                                <div className="ts-input-wrapper">
                                    <i className="ts-input-icon"><IconUser /></i>
                                    <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required className="ts-input" />
                                </div>
                                 <div className="ts-input-wrapper">
                                    <i className="ts-input-icon"><IconUser /></i>
                                    <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required className="ts-input" />
                                </div>
                            </div>

                            <div className="ts-form-group">
                                <div className="ts-input-wrapper">
                                    <i className="ts-input-icon"><IconEnvelope /></i>
                                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="ts-input" />
                                </div>
                            </div>
                            
                             <div className="ts-input-wrapper">
                                <i className="ts-input-icon"><IconPhone /></i>
                                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="ts-input" />
                            </div>

                            <div className="ts-form-group" style={{marginTop: '1rem'}}>
                                <div className="ts-input-wrapper">
                                    <i className="ts-input-icon"><IconLock /></i>
                                    <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="ts-input" />
                                    <i className="ts-eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <IconEyeOff /> : <IconEye />}</i>
                                </div>
                            </div>

                            <div className="ts-form-group">
                                <div className="ts-input-wrapper">
                                    <i className="ts-input-icon"><IconLock /></i>
                                    <input type={confirmPasswordVisible ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="ts-input" />
                                    <i className="ts-eye-icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>{confirmPasswordVisible ? <IconEyeOff /> : <IconEye />}</i>
                                </div>
                            </div>

                            <button type="submit" className="ts-submit-btn" disabled={loading}>{loading ? 'Signing Up...' : 'Create Account'}</button>
                        </form>
                        
                        <div className="ts-divider">or</div>

                        <div className="ts-google-btn-wrapper" ref={googleButtonRef}></div>

                        {error && <p className="ts-error-message">{error}</p>}
                        
                        <div className="ts-links">
                            <a href="/teachLogin" className="ts-link">Already have an account? Log In</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default TeachSignup;
