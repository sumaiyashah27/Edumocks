import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconHelpCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconBarChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const IconSend = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;


// --- INLINE CSS STYLES ---
const FeatureStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --fts-color-primary: #101D42;
    --fts-color-accent: #FCA311;
    --fts-color-bg: #FFFFFF;
    --fts-color-bg-alt: #F8F9FA;
    --fts-color-text-dark: #141414;
    --fts-color-text-light: #6c757d;
    --fts-color-border: #e9ecef;
  }

  .fts-section {
    padding: 6rem 1.5rem;
    background-color: var(--fts-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .fts-container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .fts-header {
    margin-bottom: 4rem;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .fts-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    color: var(--fts-color-primary);
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .fts-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--fts-color-text-light);
  }

  .fts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  /* --- Feature Card --- */
  .fts-card {
    background-color: var(--fts-color-bg-alt);
    border-radius: 1rem;
    padding: 2.5rem;
    text-align: left;
    border: 1px solid var(--fts-color-border);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .fts-card:hover {
     transform: translateY(-8px);
     box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
  }
  
  .fts-card__icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: linear-gradient(145deg, var(--fts-color-primary), #1a2a4c);
    color: white;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 20px -10px var(--fts-color-primary);
  }
  
  .fts-card__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--fts-color-text-dark);
  }
  
  .fts-card__description {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--fts-color-text-light);
  }
  
  @media (max-width: 992px) {
    .fts-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .fts-section {
      padding: 4rem 1rem;
    }
    .fts-card {
        padding: 2rem;
    }
  }
`;

const features = [
  { icon: IconCalendar, title: "Exam Schedule", description: "Stay updated with official schedules, deadlines, and key dates so you never miss a milestone on your journey." },
  { icon: IconHelpCircle, title: "Unique Questions", description: "Challenge yourself with a vast, high-quality question bank designed to mirror the real exam's complexity and style." },
  { icon: IconClock, title: "Timed Examinations", description: "Simulate the pressure of test day with full-length mock exams under realistic time constraints to perfect your pacing." },
  { icon: IconBarChart, title: "Progress Tracking", description: "Visualize your performance with detailed analytics. Identify your strengths and pinpoint weak areas for focused study." },
  { icon: IconRefresh, title: "Retest Options", description: "Reinforce learning by retaking specific sections or entire exams. Track your improvement and solidify your knowledge." },
  { icon: IconSend, title: "Instant Test Solution", description: "Receive comprehensive, step-by-step solutions for every question immediately after completing a test." },
];


const FeatureCard = ({ feature, index }) => {
  const { icon: IconComponent, title, description } = feature;

  return (
    <motion.div 
      className="fts-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
        <div className="fts-card__icon"><IconComponent /></div>
        <h3 className="fts-card__title">{title}</h3>
        <p className="fts-card__description">{description}</p>
    </motion.div>
  );
};


const FeatureTabs = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = FeatureStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section className="fts-section" id='features'>
      <div className='fts-container'>
        <motion.div 
          className="fts-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
           <h2 className="fts-title">Everything You Need to Succeed</h2>
           <p className="fts-subtitle">
            Our platform is packed with powerful features designed to streamline your study process and boost your confidence for exam day.
           </p>
        </motion.div>

        <div className="fts-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureTabs;

