import React, { useEffect } from "react";
import { motion } from "framer-motion";

// --- INLINE ICONS (Self-contained, no extra imports needed) ---
const FaBook = ({ size = 24 }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM104 352c-6.6 0-12-5.4-12-12s5.4-12 12-12h144c6.6 0 12 5.4 12 12s-5.4 12-12 12H104zm0-64c-6.6 0-12-5.4-12-12s5.4-12 12-12h144c6.6 0 12 5.4 12 12s-5.4 12-12 12H104zm0-64c-6.6 0-12-5.4-12-12s5.4-12 12-12h144c6.6 0 12 5.4 12 12s-5.4 12-12 12H104z"></path>
  </svg>
);

const FaChartLine = ({ size = 24 }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308h436zM309.2 214.7L448 353.4V128H64v150.6l103.2-103.2c9.4-9.4 24.6-9.4 33.9 0l34.6 34.6c9.4 9.4 24.6 9.4 33.9 0L309.2 214.7z"></path>
  </svg>
);

const FaGraduationCap = ({ size = 24 }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M622.34 153.2L343.4 27.2c-17.4-7.7-37.4-7.7-54.8 0L17.66 153.2c-1.41 1.2-2.12 2.15-2.25 3.66-2.32 26.45 20.24 49.08 46.69 46.77 1.51-.13 2.46-.84 3.66-2.25l275.3-125.79 275.3 125.79c1.2 1.41 2.15 2.12 3.66 2.25 26.45 2.31 49.08-20.32 46.69-46.77-.13-1.51-.84-2.46-2.25-3.66zM320 336c-54.16 0-97.74-26.85-127.42-64H320l127.42 64H320zM320 240c-22.09 0-40 17.91-40 40s17.91 40 40 40 40-17.91 40-40-17.91-40-40-40zm-1.2 203.41L12.28 316.59C4.45 312.8 0 305.23 0 296.92v-9.33c0-8.31 4.45-15.88 12.28-19.69l306.52-126.88c17.45-7.23 37.95-7.23 55.4 0l306.52 126.88c7.83 3.81 12.28 11.38 12.28 19.69v9.33c0 8.31-4.45 15.88-12.28 19.69L321.2 443.41c-17.45 7.22-37.95 7.22-55.4 0z"></path>
  </svg>
);

const content = [
  { id: 1, icon: FaBook, heading: "Realistic Mock Exams", text: "Prepare under true exam conditions to build confidence and master your timing." },
  { id: 2, icon: FaChartLine, heading: "AI-Powered Analytics", text: "Receive actionable insights to pinpoint weaknesses and focus your study efforts effectively." },
  { id: 3, icon: FaGraduationCap, heading: "Expert-Led Strategy", text: "Gain access to proven strategies from Kunal Doshi, CFA, to maximize your score." },
];

// --- INLINE CSS FOR THE COMPONENT ---
const WhyChooseUsCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --wcu-color-primary: #101D42; /* A deeper, professional blue */
    --wcu-color-accent: #FCA311;
    --wcu-color-text-dark: #141414;
    --wcu-color-text-light: #6c757d;
    --wcu-color-bg-section: #F8F9FA;
    --wcu-color-card-bg: #FFFFFF;
    --wcu-color-border: #e9ecef;
  }

  .wcu-section {
    width: 100%;
    padding: 6rem 1.5rem;
    font-family: 'Poppins', sans-serif;
    background-color: var(--wcu-color-bg-section);
    overflow: hidden;
  }

  .wcu-container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  /* --- Header Content --- */
  .wcu-header {
    margin-bottom: 4rem;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .wcu-tagline {
    color: var(--wcu-color-accent);
    font-weight: 600;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  
  .wcu-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    color: var(--wcu-color-primary);
    line-height: 1.2;
    margin-bottom: 1.25rem;
  }
  
  .wcu-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--wcu-color-text-light);
  }

  /* --- Features Grid --- */
  .wcu-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  /* --- Feature Card --- */
  .wcu-card {
    background-color: var(--wcu-color-card-bg);
    border-radius: 1rem;
    padding: 2.5rem;
    text-align: left;
    border: 1px solid var(--wcu-color-border);
    box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.07);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .wcu-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
  }

  .wcu-card-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(252, 163, 17, 0.1), rgba(252, 163, 17, 0.2));
    color: var(--wcu-color-accent);
    margin-bottom: 1.5rem;
  }

  .wcu-card-heading {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--wcu-color-text-dark);
    margin-bottom: 0.5rem;
  }
  
  .wcu-card-text {
    font-size: 0.95rem;
    color: var(--wcu-color-text-light);
    line-height: 1.6;
  }

  /* --- Responsive Design --- */
  @media (max-width: 992px) {
    .wcu-features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .wcu-section {
      padding: 4rem 1rem;
    }
    .wcu-header {
      margin-bottom: 3rem;
    }
    .wcu-card {
      padding: 2rem;
    }
  }
`;

const WhyChooseUs = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = WhyChooseUsCSS;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.15,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="wcu-section" id="why-us">
      <div className="wcu-container">
        <motion.div 
          className="wcu-header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          
          <h2 className="wcu-title">Why Edumocks is Your Key to CFA Success</h2>
          <p className="wcu-description">
            We are more than a prep course; we are your strategic partner. Our platform, guided by <strong>Kunal Doshi, CFA</strong>, is built on a singular mission: to ensure you pass with confidence.
          </p>
        </motion.div>

        <div className="wcu-features-grid">
          {content.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div 
                className="wcu-card" 
                key={item.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="wcu-card-icon">
                  <IconComponent />
                </div>
                <h3 className="wcu-card-heading">{item.heading}</h3>
                <p className="wcu-card-text">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;