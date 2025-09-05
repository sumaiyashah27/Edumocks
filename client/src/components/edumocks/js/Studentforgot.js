import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconEnvelope = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconEyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

// --- INLINE CSS STYLES ---
const ForgotStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --sf-color-primary: #101D42;
    --sf-color-accent: #FCA311;
    --sf-color-bg: #F8F9FA;
    --sf-color-bg-card: #FFFFFF;
    --sf-color-text-dark: #141414;
    --sf-color-text-light: #FFFFFF;
    --sf-color-text-muted: #6c757d;
    --sf-color-border: #e9ecef;
    --sf-color-error: #dc3545;
    --sf-color-success: #28a745;
  }

  .sf-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--sf-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .sf-container {
    max-width: 900px;
    width: 100%;
  }

  .sf-card {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    background-color: var(--sf-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* Left Branding Panel */
  .sf-branding-panel {
    background: linear-gradient(135deg, var(--sf-color-primary), #1a2a4c);
    color: var(--sf-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .sf-branding-panel h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .sf-branding-panel p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  /* Right Form Panel */
  .sf-form-panel {
    padding: 3rem;
    position: relative;
  }
  
  .sf-form-panel h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--sf-color-text-dark);
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .sf-subtitle {
    text-align: center;
    color: var(--sf-color-text-muted);
    margin-bottom: 2rem;
  }

  .sf-form-group {
    margin-bottom: 1.25rem;
  }
  
  .sf-input-wrapper {
    position: relative;
  }
  
  .sf-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    border: 1px solid var(--sf-color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .sf-input:focus {
    outline: none;
    border-color: var(--sf-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }
  
  .sf-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--sf-color-text-muted);
  }

  .sf-eye-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--sf-color-text-muted);
  }
  
  .sf-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--sf-color-accent);
    color: var(--sf-color-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .sf-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }
  
  .sf-links {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .sf-link {
    color: var(--sf-color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .sf-link:hover { text-decoration: underline; }
  
  .sf-error-message {
    color: var(--sf-color-error);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .sf-success-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    z-index: 10;
  }
  
  .sf-success-overlay__icon { color: var(--sf-color-success); }
  .sf-success-overlay__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--sf-color-primary);
    margin-top: 1.5rem;
  }
  .sf-success-overlay__text {
    color: var(--sf-color-text-muted);
    margin-top: 0.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sf-card { grid-template-columns: 1fr; }
    .sf-branding-panel { display: none; }
    .sf-form-panel { padding: 2.5rem; }
  }
`;

const Studforgot = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailSuccess, setShowEmailSuccess] = useState(false);
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = ForgotStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // MOCK API CALL
            await new Promise(resolve => setTimeout(resolve, 1000));
            // const response = await axios.post('/api/student/verify-email', { email });
            // if (response.data.success) {
                setShowEmailSuccess(true);
                setTimeout(() => {
                    setShowEmailSuccess(false);
                    setStep(2);
                }, 2000);
            // } else {
            //     setError(response.data.message || 'Email not found.');
            // }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
             // MOCK API CALL
            await new Promise(resolve => setTimeout(resolve, 1000));
            // const response = await axios.post('/api/student/reset-password', { email, newPassword });
            // if (response.data.success) {
                setShowPasswordSuccess(true);
                setTimeout(() => {
                    window.location.href = '/studLogin';
                }, 2000);
            // } else {
            //     setError(response.data.message || 'Failed to reset password.');
            // }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <section className="sf-section">
            <motion.div className="sf-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="sf-card">
                    <div className="sf-branding-panel">
                        <h1>Forgot Password?</h1>
                        <p>No worries, we'll help you get back on track. Follow the steps to reset your password.</p>
                    </div>
                    <div className="sf-form-panel">
                        <AnimatePresence>
                             {showEmailSuccess && (
                                <motion.div className="sf-success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="sf-success-overlay__icon"><IconCheckCircle /></div>
                                    <h3 className="sf-success-overlay__title">Email Verified!</h3>
                                    <p className="sf-success-overlay__text">Proceed to reset your password.</p>
                                </motion.div>
                            )}
                            {showPasswordSuccess && (
                                <motion.div className="sf-success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="sf-success-overlay__icon"><IconCheckCircle /></div>
                                    <h3 className="sf-success-overlay__title">Password Reset!</h3>
                                    <p className="sf-success-overlay__text">Redirecting to login...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
                                    <h2>Enter Your Email</h2>
                                    <p className="sf-subtitle">We'll send instructions to your email.</p>
                                    <form onSubmit={handleEmailSubmit}>
                                        <div className="sf-form-group">
                                            <div className="sf-input-wrapper">
                                                <i className="sf-input-icon"><IconEnvelope /></i>
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="sf-input"/>
                                            </div>
                                        </div>
                                        <button type="submit" className="sf-submit-btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify Email'}</button>
                                    </form>
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
                                    <h2>Reset Your Password</h2>
                                    <p className="sf-subtitle">Enter a new, secure password.</p>
                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="sf-form-group">
                                            <div className="sf-input-wrapper">
                                                <i className="sf-input-icon"><IconLock /></i>
                                                <input type={passwordVisible ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required className="sf-input"/>
                                                <i className="sf-eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <IconEyeOff /> : <IconEye />}</i>
                                            </div>
                                        </div>
                                        <div className="sf-form-group">
                                            <div className="sf-input-wrapper">
                                                <i className="sf-input-icon"><IconLock /></i>
                                                <input type={confirmPasswordVisible ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required className="sf-input"/>
                                                <i className="sf-eye-icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>{confirmPasswordVisible ? <IconEyeOff /> : <IconEye />}</i>
                                            </div>
                                        </div>
                                        <button type="submit" className="sf-submit-btn" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {error && <p className="sf-error-message">{error}</p>}
                        <div className="sf-links">
                            <a href="/studLogin" className="sf-link">Back to Login</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Studforgot;
