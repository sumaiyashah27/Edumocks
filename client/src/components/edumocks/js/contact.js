import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;


// --- INLINE CSS STYLES ---
const ContactStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --c-color-primary: #101D42;
    --c-color-accent: #FCA311;
    --c-color-bg: #F8F9FA;
    --c-color-bg-card: #FFFFFF;
    --c-color-text-dark: #141414;
    --c-color-text-light: #FFFFFF;
    --c-color-text-muted: #6c757d;
    --c-color-border: #e9ecef;
  }

  .c-section {
    padding: 6rem 1.5rem;
    background-color: var(--c-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .c-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .c-header {
    text-align: center;
    margin-bottom: 4rem;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .c-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    color: var(--c-color-primary);
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .c-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--c-color-text-muted);
  }

  /* --- Unified Contact Card --- */
  .c-card {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    background-color: var(--c-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* --- Left Info Panel --- */
  .c-info-panel {
    background: linear-gradient(135deg, var(--c-color-primary), #1a2a4c);
    color: var(--c-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .c-info-panel__title {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .c-info-panel__description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    margin-bottom: 2.5rem;
  }

  .c-info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .c-info-item__icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .c-info-item__text {
    font-size: 1rem;
    font-weight: 500;
  }

  /* --- Right Form Panel --- */
  .c-form-panel {
    padding: 3rem;
    position: relative;
  }

  .c-form-group {
    margin-bottom: 1.25rem;
  }

  .c-input, .c-textarea {
    width: 100%;
    padding: 0.85rem 1.25rem;
    border: 1px solid var(--c-color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .c-input:focus, .c-textarea:focus {
    outline: none;
    border-color: var(--c-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }

  .c-textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .c-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--c-color-accent);
    color: var(--c-color-text-light);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .c-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }

  /* --- Success Message Overlay --- */
  .c-success-message {
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
  }
  
  .c-success-message__icon {
    color: #28a745;
  }
  
  .c-success-message__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--c-color-primary);
    margin-top: 1.5rem;
  }

  .c-success-message__text {
    color: var(--c-color-text-muted);
    margin-top: 0.5rem;
  }
  
  /* --- Responsive --- */
  @media (max-width: 992px) {
    .c-card {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .c-section {
      padding: 4rem 1rem;
    }
    .c-info-panel, .c-form-panel {
      padding: 2rem;
    }
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = ContactStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="c-section" id="contact">
      <div className="c-container">
        <motion.div 
          className="c-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="c-title">Get in Touch</h2>
          <p className="c-subtitle">
            We’d love to hear from you! Whether you have a question, need support, or want to explore how we can work together — our team is ready to help.
          </p>
        </motion.div>

        <motion.div 
          className="c-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="c-info-panel">
            <h3 className="c-info-panel__title">Contact Information</h3>
            <p className="c-info-panel__description">
              Fill up the form and our team will get back to you within 24 hours. This Company is under EDUINVEST ACADEMY.
            </p>
            <div className="c-info-item">
              <div className="c-info-item__icon"><IconMail /></div>
              <span className="c-info-item__text">support@edumocks.com</span>
            </div>
          </div>
          
          <div className="c-form-panel">
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  className="c-success-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="c-success-message__icon"><IconCheckCircle /></div>
                  <h4 className="c-success-message__title">Message Sent!</h4>
                  <p className="c-success-message__text">Thank you for reaching out. We'll get back to you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit}>
              <div className="c-form-group">
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="c-input" required />
              </div>
              <div className="c-form-group">
                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="c-input" required />
              </div>
              <div className="c-form-group">
                <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className="c-textarea" required></textarea>
              </div>
              <button type="submit" className="c-submit-btn">Send Message</button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
