import React, { useEffect } from "react";
import { motion } from "framer-motion";

// --- INLINE ICONS (Self-contained, no extra imports needed) ---
const IconBookOpen = ({ size = 28 }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
const IconCreditCard = ({ size = 28 }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);
const IconCalendar = ({ size = 28 }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="m9 16 2 2 4-4"></path>
  </svg>
);
const IconChart = ({ size = 28 }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3v18h18"></path>
    <path d="m19 9-5 5-4-4-3 3"></path>
  </svg>
);

const stepsData = [
  {
    step: 1,
    icon: IconBookOpen,
    title: "Choose Your Course",
    description: "Select the CFA course that fits as per your preparation needs.",
  },
  {
    step: 2,
    icon: IconCreditCard,
    title: "Complete Payment",
    description: "Secure your access to mock tests with the payment process.",
  },
  {
    step: 3,
    icon: IconCalendar,
    title: "Schedule Your Test",
    description: "Choose a convenient date and time to take your mock test.",
  },
  {
    step: 4,
    icon: IconChart,
    title: "Get Your Results",
    description: "Receive detailed insights and analysis to track your progress.",
  },
];

// --- INLINE CSS FOR THE COMPONENT ---
const HowItWorksCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --hiw-color-primary: #101D42;
    --hiw-color-accent: #FCA311;
    --hiw-color-text-dark: #141414;
    --hiw-color-text-light: #6c757d;
    --hiw-color-bg-section: #FFFFFF;
    --hiw-color-border: #e9ecef;
  }

  .hiw-section {
    width: 100%;
    padding: 6rem 1.5rem;
    font-family: 'Poppins', sans-serif;
    background-color: var(--hiw-color-bg-section);
    overflow: hidden;
  }

  .hiw-container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .hiw-header {
    margin-bottom: 5rem;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
  }

  .hiw-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    color: var(--hiw-color-primary);
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .hiw-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--hiw-color-text-light);
  }

  /* --- DESKTOP TIMELINE --- */
  .hiw-timeline-wrapper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  .hiw-timeline-wrapper::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 12.5%;
    right: 12.5%;
    height: 3px;
    background: linear-gradient(90deg, var(--hiw-color-accent), var(--hiw-color-primary));
    border-radius: 2px;
    z-index: 0;
  }

  .hiw-step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hiw-step-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .hiw-step-number {
    width: 80px;
    height: 80px;
    background-color: var(--hiw-color-bg-section);
    border: 3px solid var(--hiw-color-primary);
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--hiw-color-primary);
    z-index: 1;
    transition: all 0.3s ease;
  }

  .hiw-step:hover .hiw-step-number {
    background-color: var(--hiw-color-primary);
    color: white;
    transform: scale(1.1);
    border-color: var(--hiw-color-accent);
  }
  
  .hiw-step-icon {
    margin-top: 2rem;
    color: var(--hiw-color-accent);
  }
  
  .hiw-step-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--hiw-color-text-dark);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .hiw-step-description {
    font-size: 0.95rem;
    color: var(--hiw-color-text-light);
    line-height: 1.6;
    max-width: 250px;
  }

  /* --- RESPONSIVE MOBILE DESIGN --- */
  @media (max-width: 992px) {
    .hiw-timeline-wrapper {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .hiw-timeline-wrapper::before {
      display: none; /* Hide timeline bar on mobile */
    }

    .hiw-step {
      flex-direction: row; /* Align items horizontally */
      align-items: center;
      text-align: left;
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid var(--hiw-color-border);
    }

    .hiw-step-header {
      margin-bottom: 0;
      margin-right: 1.5rem;
      flex-shrink: 0;
    }

    .hiw-step-number {
      width: 50px;
      height: 50px;
      font-size: 1.25rem;
    }

    .hiw-step:hover .hiw-step-number {
      transform: none; /* Disable scale on mobile */
    }

    .hiw-step-icon {
      display: none; /* Hide icon on mobile for a cleaner look */
    }

    .hiw-step-content {
      /* This div is implied in the JSX, let's keep the CSS simple */
    }
    
    .hiw-step-title {
      margin-top: 0;
    }
    
    .hiw-step-description {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .hiw-section {
      padding: 4rem 1rem;
    }
    .hiw-header {
      margin-bottom: 4rem;
    }
  }
`;

const HowItWorks = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = HowItWorksCSS;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  
  // A different animation for desktop to avoid jarring side-in
  const desktopStepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Simple check for mobile screen width
  const isMobile = window.innerWidth <= 992;

  return (
    <section className="hiw-section" id="how-it-works">
      <div className="hiw-container">
        <motion.div
          className="hiw-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="hiw-title">Your Path to Success in 4 Simple Steps</h2>
          <p className="hiw-subtitle">
            Our streamlined process is designed to get you from enrollment to exam-ready with clarity and confidence.
          </p>
        </motion.div>

        <motion.div
          className="hiw-timeline-wrapper"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stepsData.map((step) => {
            const IconComponent = step.icon;
            return (
              <motion.div className="hiw-step" key={step.step} variants={isMobile ? stepVariants : desktopStepVariants}>
                <div className="hiw-step-header">
                  <div className="hiw-step-number">
                    <span>{step.step}</span>
                  </div>
                  <div className="hiw-step-icon">
                    <IconComponent />
                  </div>
                </div>
                <div className="hiw-step-content">
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-description">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

