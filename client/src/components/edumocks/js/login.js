import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconStudent = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconTeacher = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"></circle><path d="M12 11c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4z"></path><path d="M16 11.5a2.5 2.5 0 0 0 0-5"></path><path d="M8 11.5a2.5 2.5 0 0 1 0-5"></path></svg>;


// --- INLINE CSS STYLES ---
const LoginPageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --lp-color-primary: #101D42;
    --lp-color-accent: #FCA311;
    --lp-color-bg: #F8F9FA;
    --lp-color-bg-card: #FFFFFF;
    --lp-color-text-dark: #141414;
    --lp-color-text-light: #FFFFFF;
    --lp-color-text-muted: #6c757d;
    --lp-color-border: #e9ecef;
  }

  .lp-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--lp-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .lp-container {
    max-width: 900px;
    width: 100%;
  }

  .lp-card {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    background-color: var(--lp-color-bg-card);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.15);
  }

  /* --- Left Branding Panel --- */
  .lp-branding-panel {
    background: linear-gradient(135deg, var(--lp-color-primary), #1a2a4c);
    color: var(--lp-color-text-light);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .lp-branding-panel h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .lp-branding-panel p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  /* --- Right Form Panel --- */
  .lp-form-panel {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .lp-form-panel h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--lp-color-text-dark);
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .lp-form-panel .lp-subtitle {
    font-size: 1rem;
    color: var(--lp-color-text-muted);
    text-align: center;
    margin-bottom: 2rem;
  }

  .lp-role-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .lp-role-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    border: 1px solid var(--lp-color-border);
    border-radius: 0.75rem;
    text-decoration: none;
    color: var(--lp-color-text-dark);
    transition: all 0.3s ease;
  }

  .lp-role-card:hover {
    transform: translateY(-4px);
    border-color: var(--lp-color-accent);
    box-shadow: 0 10px 20px -10px rgba(252, 163, 17, 0.3);
  }
  
  .lp-role-icon {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background-color: var(--lp-color-bg);
    color: var(--lp-color-primary);
  }

  .lp-role-info h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
  
  .lp-role-info p {
    font-size: 0.9rem;
    color: var(--lp-color-text-muted);
    margin: 0;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .lp-card {
      grid-template-columns: 1fr;
    }
    .lp-branding-panel {
      padding: 2.5rem;
    }
     .lp-form-panel {
      padding: 2.5rem;
    }
  }
`;

const roles = [
    { name: "Student", description: "Access your dashboard and courses.", icon: IconStudent, path: "/studLogin" },
    { name: "Teacher", description: "Manage courses and student progress.", icon: IconTeacher, path: "/teachLogin" }
]

const LoginPage = () => {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = LoginPageStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <section className="lp-section">
            <motion.div 
                className="lp-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="lp-card">
                    <div className="lp-branding-panel">
                        <h1>Welcome to Edumocks</h1>
                        <p>Your centralized hub for effective and insightful CFA exam preparation.</p>
                    </div>
                    <div className="lp-form-panel">
                        <h2>Select Your Role</h2>
                        <p className="lp-subtitle">Please choose your role to proceed.</p>
                        <div className="lp-role-selector">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <a href={role.path} key={role.name} className="lp-role-card">
                                        <div className="lp-role-icon"><Icon /></div>
                                        <div className="lp-role-info">
                                            <h3>{role.name}</h3>
                                            <p>{role.description}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default LoginPage;

