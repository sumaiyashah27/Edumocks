import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- INLINE CSS STYLES ---
const TermsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap');

  :root {
    --tc-color-primary: #101D42;
    --tc-color-accent: #FCA311;
    --tc-color-bg: #F8F9FA;
    --tc-color-card-bg: #FFFFFF;
    --tc-color-text-dark: #141414;
    --tc-color-text-body: #343a40;
    --tc-color-text-muted: #6c757d;
    --tc-color-border: #e9ecef;
  }

  .tc-section {
    padding: 4rem 1.5rem;
    background-color: var(--tc-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .tc-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .tc-card {
    background-color: var(--tc-color-card-bg);
    border-radius: 1.5rem;
    padding: clamp(2rem, 5vw, 4rem);
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.1);
  }

  .tc-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--tc-color-border);
  }
  
  .tc-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    color: var(--tc-color-primary);
    line-height: 1.2;
    margin: 0;
  }

  .tc-subtitle {
    font-size: 1.1rem;
    color: var(--tc-color-text-muted);
    margin-top: 1rem;
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .tc-content-section {
    font-family: 'Source Serif 4', serif;
    color: var(--tc-color-text-body);
    margin-bottom: 2.5rem;
  }
  
  .tc-content-section:last-child {
    margin-bottom: 0;
  }
  
  .tc-content-section h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--tc-color-primary);
    margin-bottom: 1.5rem;
  }
  
  .tc-content-section p {
    line-height: 1.9;
    margin-bottom: 1rem;
  }
  
  .tc-content-section a {
    color: var(--tc-color-accent);
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .tc-content-section a:hover {
    opacity: 0.8;
  }
  
  /* --- Responsive --- */
  @media (max-width: 768px) {
    .tc-section {
      padding: 4rem 1rem;
    }
     .tc-card {
        padding: 2rem;
     }
  }
`;

const TermsConditions = () => {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = TermsStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <section className="tc-section">
            <div className="tc-container">
                 <motion.div 
                    className="tc-card"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <header className="tc-header">
                        <h1 className="tc-title">Terms and Conditions</h1>
                        <p className="tc-subtitle">
                            Please read these terms carefully before using our services. Your access to and use of the service is conditioned on your acceptance of these terms.
                        </p>
                    </header>

                    <div className="tc-content-body">
                         <section className="tc-content-section">
                            <h2>1. Introduction</h2>
                            <p>Welcome to <strong>Edumocks</strong>. These Terms and Conditions govern your use of the Edumocks website and its services. By accessing or using our platform, you agree to comply with and be bound by these terms. If you disagree with any part of the terms, you must not use our services.</p>
                        </section>
                        
                        <section className="tc-content-section">
                            <h2>2. User Responsibilities</h2>
                             <p>You are responsible for providing accurate registration information and for safeguarding your account credentials. You agree to use our services for lawful purposes only and to not engage in any activity that is fraudulent, abusive, or harmful. You must not upload or distribute any content that violates intellectual property rights or is otherwise unlawful.</p>
                        </section>
                        
                        <section className="tc-content-section">
                            <h2>3. Privacy and Data</h2>
                            <p>We are committed to protecting your personal information. Our data collection is limited to what is necessary to provide you with the best user experience. For detailed information on our data practices, please review our full <a href="/privacy-policy">Privacy Policy</a>.</p>
                        </section>

                        <section className="tc-content-section">
                            <h2>4. Payments and Subscriptions</h2>
                             <p>Access to premium services requires payment, processed through secure third-party gateways. All payments are final and non-refundable, as detailed in our <a href="/refund-policy">Refund Policy</a>. Edumocks reserves the right to modify subscription fees at any time, with changes communicated prior to your next billing cycle.</p>
                        </section>

                        <section className="tc-content-section">
                            <h2>5. Termination</h2>
                             <p>We reserve the right to suspend or terminate your account if you violate these Terms and Conditions. This includes engaging in fraudulent activities, misusing the platform, or infringing on intellectual property rights. Upon termination, access to all services will be revoked.</p>
                        </section>

                        <section className="tc-content-section">
                            <h2>6. Governing Law</h2>
                             <p>These Terms are governed by the laws of India. Any legal action or proceeding related to your use of our services shall be subject to the exclusive jurisdiction of the courts located in Mumbai, India.</p>
                        </section>
                        
                        <section className="tc-content-section">
                            <h2>7. Contact Information</h2>
                            <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@edumocks.com">support@edumocks.com</a>.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TermsConditions;

