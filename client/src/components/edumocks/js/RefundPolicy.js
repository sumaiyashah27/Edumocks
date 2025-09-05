import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- INLINE CSS STYLES ---
const RefundPolicyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap');

  :root {
    --rp-color-primary: #101D42;
    --rp-color-accent: #FCA311;
    --rp-color-bg: #F8F9FA;
    --rp-color-card-bg: #FFFFFF;
    --rp-color-text-dark: #141414;
    --rp-color-text-body: #343a40;
    --rp-color-text-muted: #6c757d;
    --rp-color-border: #e9ecef;
    --rp-color-success: #28a745;
    --rp-color-danger: #dc3545;
  }

  .rp-section {
    padding: 4rem 1.5rem;
    background-color: var(--rp-color-bg);
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rp-container {
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
  }

  .rp-card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    background-color: var(--rp-color-card-bg);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* --- Left Info Panel --- */
  .rp-info-panel {
    background: linear-gradient(135deg, var(--rp-color-primary), #1a2a4c);
    color: white;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .rp-info-panel h1 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  
  .rp-info-panel p {
    font-size: 1rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.8);
  }
  
  /* --- Right Content Panel --- */
  .rp-content-panel {
    padding: 3rem;
    font-family: 'Source Serif 4', serif;
    color: var(--rp-color-text-body);
  }
  
  .rp-content-section {
    margin-bottom: 2rem;
  }
  
  .rp-content-section:last-child {
    margin-bottom: 0;
  }
  
  .rp-content-section h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--rp-color-primary);
    margin-bottom: 1rem;
  }
  
  .rp-content-section p, .rp-content-section li {
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  
  .rp-content-section a {
    color: var(--rp-color-accent);
    font-weight: 600;
    text-decoration: none;
  }
  
  .rp-custom-list {
    list-style: none;
    padding: 0;
  }

  .rp-custom-list li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .rp-list-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: white;
    margin-top: 5px;
  }
  
  .rp-list-icon.success { background-color: var(--rp-color-success); }
  .rp-list-icon.danger { background-color: var(--rp-color-danger); }
  
  /* --- Responsive --- */
  @media (max-width: 992px) {
    .rp-card {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .rp-section {
      padding: 4rem 1rem;
    }
    .rp-info-panel, .rp-content-panel {
        padding: 2rem;
    }
  }
`;

const RefundPolicy = () => {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = RefundPolicyStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <section className="rp-section">
            <div className="rp-container">
                 <motion.div 
                    className="rp-card"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="rp-info-panel">
                        <h1>Refund Policy</h1>
                        <p>Our commitment to fairness and clarity. Please read our policy carefully to understand the conditions for refunds.</p>
                    </div>

                    <div className="rp-content-panel">
                         <section className="rp-content-section">
                            <h2>Eligibility for a Refund</h2>
                            <ul className="rp-custom-list">
                                <li>
                                    <div className="rp-list-icon success"><IconCheck /></div>
                                    <span>The mock test has been purchased but not yet accessed or started.</span>
                                </li>
                                <li>
                                    <div className="rp-list-icon success"><IconCheck /></div>
                                    <span>Persistent technical issues from our end prevent access, and our team cannot resolve it within 48 hours.</span>
                                </li>
                                 <li>
                                    <div className="rp-list-icon success"><IconCheck /></div>
                                    <span>You were incorrectly charged or made a duplicate payment.</span>
                                </li>
                            </ul>
                        </section>
                        
                        <section className="rp-content-section">
                            <h2>Non-Refundable Circumstances</h2>
                             <ul className="rp-custom-list">
                                <li>
                                    <div className="rp-list-icon danger"><IconX /></div>
                                    <span>You have already accessed, started, or completed the test content.</span>
                                </li>
                                <li>
                                    <div className="rp-list-icon danger"><IconX /></div>
                                    <span>More than 7 days have passed since your purchase date.</span>
                                </li>
                                 <li>
                                    <div className="rp-list-icon danger"><IconX /></div>
                                    <span>You changed your mind or no longer wish to take the test.</span>
                                </li>
                            </ul>
                        </section>
                        
                        <section className="rp-content-section">
                            <h2>How to Request a Refund</h2>
                            <p>To request a refund, please email <a href="mailto:support@edumocks.com">support@edumocks.com</a> within 7 days of purchase with your order details. Our team will respond within 5 business days.</p>
                        </section>

                        <section className="rp-content-section">
                           <p>By using Edumocks, you agree to this policy. For more details, please view our <a href="/terms-conditions">Terms and Conditions</a>.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default RefundPolicy;

