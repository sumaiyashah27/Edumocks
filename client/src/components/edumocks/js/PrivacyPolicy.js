import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;


// --- INLINE CSS STYLES ---
const PrivacyPolicyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap');

  :root {
    --pp-color-primary: #101D42;
    --pp-color-accent: #FCA311;
    --pp-color-bg: #F8F9FA;
    --pp-color-card-bg: #FFFFFF;
    --pp-color-text-dark: #141414;
    --pp-color-text-body: #343a40;
    --pp-color-text-muted: #6c757d;
    --pp-color-border: #e9ecef;
  }

  .pp-section {
    padding: 4rem 1.5rem;
    background-color: var(--pp-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .pp-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 4rem;
    align-items: flex-start;
  }

  /* --- Table of Contents (Desktop) --- */
  .pp-toc-desktop {
    position: sticky;
    top: 100px;
  }
  
  .pp-toc-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--pp-color-text-dark);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--pp-color-border);
  }
  
  .pp-toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .pp-toc-link {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--pp-color-text-muted);
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }
  
  .pp-toc-link:hover {
    background-color: var(--pp-color-bg);
    color: var(--pp-color-primary);
  }
  
  .pp-toc-link.active {
    color: var(--pp-color-accent);
    background-color: #fff5e6;
    border-left-color: var(--pp-color-accent);
  }

  /* --- Main Content --- */
  .pp-content-card {
    background-color: var(--pp-color-card-bg);
    border-radius: 1.5rem;
    padding: clamp(1.5rem, 5vw, 3.5rem);
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.1);
  }

  .pp-header {
    margin-bottom: 3rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--pp-color-border);
  }
  
  .pp-title {
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--pp-color-primary);
    line-height: 1.2;
    margin: 0;
  }

  .pp-last-updated {
    font-size: 0.9rem;
    color: var(--pp-color-text-muted);
    margin-top: 0.75rem;
  }
  
  .pp-content-section {
    font-family: 'Source Serif 4', serif;
    color: var(--pp-color-text-body);
    margin-bottom: 3rem;
  }
  
  .pp-content-section h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--pp-color-primary);
    margin-bottom: 1.5rem;
  }
  
  .pp-content-section p, .pp-content-section li {
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  
  .pp-content-section ul {
    list-style-position: outside;
    padding-left: 1.5rem;
  }
  
  .pp-content-section a {
    color: var(--pp-color-accent);
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .pp-content-section a:hover {
    opacity: 0.8;
  }
  
  /* --- Responsive Design --- */
  .pp-toc-mobile { display: none; }

  @media (max-width: 992px) {
    .pp-container {
      grid-template-columns: 1fr;
    }
    .pp-toc-desktop { display: none; }
    .pp-toc-mobile {
      display: block;
      margin-bottom: 2.5rem;
      position: relative;
    }
    .pp-toc-mobile-header {
        background-color: #fff;
        padding: 1rem 1.5rem;
        border: 1px solid var(--pp-color-border);
        border-radius: 0.75rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
    }
    .pp-toc-mobile-header svg {
        transition: transform 0.3s ease;
    }
    .pp-toc-mobile-header.open svg {
        transform: rotate(180deg);
    }
    .pp-toc-mobile-list {
        background-color: #fff;
        border: 1px solid var(--pp-color-border);
        border-radius: 0.75rem;
        margin-top: 0.5rem;
        position: absolute;
        width: 100%;
        z-index: 10;
        box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
        padding: 0.5rem;
    }
  }
`;

const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collection', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'data-protection', title: 'Data Protection' },
    { id: 'sharing-information', title: 'Sharing of Information' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'policy-changes', title: 'Changes to This Policy' },
    { id: 'contact-us', title: 'Contact Us' },
];

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
    const observer = useRef(null);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = PrivacyPolicyStyles;
        document.head.appendChild(styleElement);

        observer.current = new IntersectionObserver((entries) => {
            const visibleSection = entries.find((entry) => entry.isIntersecting)?.target;
            if (visibleSection) {
                setActiveSection(visibleSection.id);
            }
        }, { rootMargin: '-20% 0px -80% 0px' }); // Trigger when section is in the top 20% of the viewport

        const elements = document.querySelectorAll('.pp-content-section');
        elements.forEach((el) => observer.current.observe(el));

        return () => {
            document.head.removeChild(styleElement);
            elements.forEach((el) => {
              if(observer.current) {
                observer.current.unobserve(el)
              }
            });
        };
    }, []);

    const handleLinkClick = (id) => {
        setIsMobileTocOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Adjust this value for header height etc.
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
      
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
    };
    
    const TocLinks = ({ isMobile = false }) => (
        <ul className="pp-toc-list">
            {sections.map(({ id, title }) => (
                <li key={id}>
                    <a 
                        href={`#${id}`} 
                        className={`pp-toc-link ${activeSection === id ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleLinkClick(id); }}
                    >
                        {title}
                    </a>
                </li>
            ))}
        </ul>
    );

    return (
        <section className="pp-section">
            <div className="pp-container">
                {/* --- Desktop Table of Contents --- */}
                <aside className="pp-toc-desktop">
                    <h3 className="pp-toc-title">Table of Contents</h3>
                    <TocLinks />
                </aside>
                
                <main>
                    {/* --- Mobile Table of Contents --- */}
                     <div className="pp-toc-mobile">
                        <div 
                            className={`pp-toc-mobile-header ${isMobileTocOpen ? 'open' : ''}`}
                            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                        >
                            <span>Table of Contents</span>
                            <IconChevronDown />
                        </div>
                        <AnimatePresence>
                        {isMobileTocOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="pp-toc-mobile-list"
                            >
                                <TocLinks isMobile />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    <motion.div 
                        className="pp-content-card"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <header className="pp-header">
                            <h1 className="pp-title">Privacy Policy</h1>
                            <p className="pp-last-updated">Last Updated: September 5, 2025</p>
                        </header>

                        <div className="pp-content-body">
                             <section id="introduction" className="pp-content-section">
                                <h2>1. Introduction</h2>
                                <p>At Edumocks ("we", "our", "us"), we value the privacy of our users. This Privacy Policy outlines the types of information we collect from you when you use our platform and how it is used, stored, and protected. By using our services, you agree to the collection and use of information in accordance with this policy.</p>
                            </section>

                            <section id="information-collection" className="pp-content-section">
                                <h2>2. Information We Collect</h2>
                                <p>To provide and improve our services, we collect the following types of information:</p>
                                <ul>
                                    <li><strong>Personal Information:</strong> When you register for an account, we may collect personal details such as your full name, email address, and payment information.</li>
                                    <li><strong>Usage Data:</strong> We automatically collect data on how you interact with our platform. This includes your IP address, device type, browser information, pages visited, time spent on pages, and other diagnostic data.</li>
                                    <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to monitor activity on our service and hold certain information to enhance and personalize your user experience.</li>
                                </ul>
                            </section>

                            <section id="how-we-use" className="pp-content-section">
                                <h2>3. How We Use Your Information</h2>
                                <p>The information we collect is used for various purposes:</p>
                                <ul>
                                    <li>To provide, maintain, and improve our services.</li>
                                    <li>To manage your account and provide customer support.</li>
                                    <li>To send you important updates, security alerts, and administrative messages.</li>
                                    <li>To personalize your learning experience and recommend relevant content.</li>
                                    <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                                </ul>
                            </section>

                             <section id="data-protection" className="pp-content-section">
                                <h2>4. Data Protection</h2>
                                <p>We implement a variety of security measures to maintain the safety of your personal information. We use industry-standard encryption to protect sensitive data transmitted online, and we also protect your information offline. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.</p>
                            </section>

                            <section id="sharing-information" className="pp-content-section">
                                <h2>5. Sharing of Information</h2>
                                <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
                            </section>

                            <section id="your-rights" className="pp-content-section">
                                <h2>6. Your Rights</h2>
                                <p>You have certain rights regarding your personal information. You have the right to:</p>
                                <ul>
                                    <li>Access, update, or delete the information we have on you.</li>
                                    <li>Request that we correct any information you believe is inaccurate.</li>
                                    <li>Withdraw your consent to our processing of your personal data at any time.</li>
                                </ul>
                            </section>

                            <section id="policy-changes" className="pp-content-section">
                                <h2>7. Changes to This Privacy Policy</h2>
                                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.</p>
                            </section>

                            <section id="contact-us" className="pp-content-section">
                                <h2>8. Contact Us</h2>
                                <p>If you have any questions about this Privacy Policy or how we handle your information, please contact us at <a href="mailto:support@edumocks.com">support@edumocks.com</a>.</p>
                            </section>
                        </div>
                    </motion.div>
                </main>
            </div>
        </section>
    );
};

export default PrivacyPolicy;

