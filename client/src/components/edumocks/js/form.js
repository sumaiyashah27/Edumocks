import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconCheckCircleLarge = () => <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

// --- INLINE CSS STYLES ---
const ContactFormStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --cf-color-primary: #101D42;
    --cf-color-accent: #FCA311;
    --cf-color-bg: #F8F9FA;
    --cf-color-bg-card: #FFFFFF;
    --cf-color-text-dark: #141414;
    --cf-color-text-light: #6c757d;
    --cf-color-border: #dee2e6;
    --cf-color-success: #28a745;
    --cf-color-error: #dc3545;
  }

  .cf-section {
    padding: 6rem 1.5rem;
    background-color: var(--cf-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .cf-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .cf-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .cf-title {
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--cf-color-primary);
    line-height: 1.2;
  }
  
  .cf-title span {
    color: var(--cf-color-accent);
  }

  .cf-card {
    background-color: var(--cf-color-bg-card);
    border-radius: 1.5rem;
    padding: 3rem;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
    position: relative;
    overflow: hidden;
  }
  
  .cf-form-group {
    margin-bottom: 1.5rem;
  }
  
  .cf-label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--cf-color-text-dark);
  }
  
  .cf-input-wrapper {
    position: relative;
  }

  .cf-input, .cf-select, .cf-textarea {
    width: 100%;
    padding: 0.85rem 1.25rem;
    border: 1px solid var(--cf-color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
    -webkit-appearance: none;
  }
  
  .cf-input:focus, .cf-select:focus, .cf-textarea:focus {
    outline: none;
    border-color: var(--cf-color-accent);
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.2);
  }

  .cf-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .cf-valid-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--cf-color-success);
  }
  
  .cf-error-message {
    font-size: 0.85rem;
    color: var(--cf-color-error);
    margin-top: 0.5rem;
  }

  .cf-submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--cf-color-accent);
    color: var(--cf-color-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    margin-top: 1rem;
  }
  
  .cf-submit-btn:hover {
    background-color: #e1900f;
    transform: translateY(-2px);
  }

  /* Success Message Overlay */
  .cf-success-message {
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
  }
  
  .cf-success-message__icon {
    color: var(--cf-color-success);
  }
  
  .cf-success-message__title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--cf-color-primary);
    margin-top: 1.5rem;
  }

  .cf-success-message__text {
    color: var(--cf-color-text-light);
    margin-top: 0.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    .cf-section {
      padding: 4rem 1rem;
    }
    .cf-card {
      padding: 2rem;
    }
  }
`;

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', course: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validations = {
    name: (name) => /^[a-zA-Z\s]{3,}$/.test(name.trim()),
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase()),
    course: (course) => course !== '',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentErrors = {};
    if (!validations.name(formData.name)) currentErrors.name = 'Name must be at least 3 characters and contain no numbers.';
    if (!validations.email(formData.email)) currentErrors.email = 'Please enter a valid email address.';
    if (!validations.course(formData.course)) currentErrors.course = 'Please select a course.';
    
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      console.log('Form Submitted:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', course: '', reason: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };
  
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = ContactFormStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section className="cf-section">
      <div className="cf-container">
        <motion.div 
          className="cf-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="cf-title">
            Get in touch with <span>Us</span>
          </h2>
        </motion.div>

        <motion.div 
          className="cf-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  className="cf-success-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="cf-success-message__icon"><IconCheckCircleLarge /></div>
                  <h3 className="cf-success-message__title">Submission Received!</h3>
                  <p className="cf-success-message__text">Thank you! We'll be in touch shortly.</p>
                </motion.div>
              )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} noValidate>
            <div className="cf-form-group">
              <label htmlFor="name" className="cf-label">Full Name</label>
              <div className="cf-input-wrapper">
                <input id="name" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className="cf-input" />
                <AnimatePresence>
                  {validations.name(formData.name) && (
                     <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="cf-valid-icon"><IconCheck/></motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.name && <p className="cf-error-message">{errors.name}</p>}
            </div>

            <div className="cf-form-group">
              <label htmlFor="email" className="cf-label">Email Address</label>
              <div className="cf-input-wrapper">
                 <input id="email" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="cf-input" />
                 <AnimatePresence>
                  {validations.email(formData.email) && (
                     <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="cf-valid-icon"><IconCheck/></motion.div>
                  )}
                </AnimatePresence>
              </div>
               {errors.email && <p className="cf-error-message">{errors.email}</p>}
            </div>

            <div className="cf-form-group">
              <label htmlFor="course" className="cf-label">Preferred Course</label>
               <div className="cf-input-wrapper">
                  <select id="course" name="course" value={formData.course} onChange={handleChange} className="cf-select">
                    <option value="" disabled>Select a course</option>
                    <option value="CFA Level 1">CFA Level 1</option>
                    <option value="CFA Level 2">CFA Level 2</option>
                  </select>
               </div>
               {errors.course && <p className="cf-error-message">{errors.course}</p>}
            </div>
            
            <div className="cf-form-group">
              <label htmlFor="reason" className="cf-label">Your Query (Optional)</label>
              <textarea id="reason" name="reason" placeholder="Tell us how we can help..." value={formData.reason} onChange={handleChange} className="cf-textarea" />
            </div>

            <button type="submit" className="cf-submit-btn">Submit Inquiry</button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
