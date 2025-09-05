import React, { useEffect } from "react";
import { motion } from "framer-motion";

// --- INLINE CSS FOR THE COMPONENT (fixed text-color inheritance) ---
const AboutUsCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --color-primary: #1a2a4c;
    --color-accent: #fca311;
    --color-text-dark: #141414;
    --color-text-light: #555; /* if this is too light, increase contrast to #3b3b3b */
    --color-bg-section: #f0f2f5;
    --color-bg-card: #ffffff;
    --border-radius-lg: 2rem;
    --shadow-strong: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
    --shadow-soft: 0 8px 16px rgba(0, 0, 0, 0.05);
  }

  .about-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 6rem 1.5rem;
    background-color: var(--color-bg-section);
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
  }

  .about-container { max-width: 1100px; width: 100%; }

  .about-header { text-align: center; margin-bottom: 4rem; }

  .about-tagline {
    color: var(--color-accent);
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .about-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.2;
  }

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    align-items: center;
    gap: 2rem;
    position: relative;
  }

  .about-image-wrapper {
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-strong);
    aspect-ratio: 1 / 1;
    position: relative;
    z-index: 1;
    transition: transform 0.4s ease;
  }
  .about-image-wrapper:hover { transform: translateY(-10px); }

  .about-image { width: 100%; height: 100%; object-fit: cover; }

  /* <<< KEY FIX: force readable text color on wrapper so children inherit it <<< */
  .about-text-wrapper {
    background-color: var(--color-bg-card);
    padding: 3rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-soft);
    text-align: left;
    border: 1px solid #e2e8f0;
    margin-left: -4rem;
    z-index: 2;

    /* ensure text is readable even if some global style tries to set body color */
    color: var(--color-text-dark) !important;
  }
  /* give the description an explicit color (extra safety + contrast) */
  .about-description {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--color-text-light);
    margin-bottom: 2rem;
  }

  .about-subtitle {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text-dark);
    margin-bottom: 1.5rem;
    line-height: 1.3;
  }

  .about-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }

  .about-feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
    color: var(--color-text-dark);
  }

  .about-feature-icon {
    background-color: var(--color-accent);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  @media (max-width: 992px) {
    .about-text-wrapper { margin-left: -2rem; padding: 2.5rem; }
    .about-subtitle { font-size: 1.75rem; }
  }

  @media (max-width: 768px) {
    .about-section { padding: 4rem 1rem; }
    .about-title { font-size: 2.25rem; }
    .about-content { grid-template-columns: 1fr; gap: 2rem; }
    .about-image-wrapper { margin-bottom: 0; aspect-ratio: 16 / 9; }
    .about-text-wrapper {
      margin-left: 0;
      margin-top: -3rem;
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const AboutUs = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = AboutUsCSS;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="about-tagline">The Edumocks Advantage</p>
          <h2 className="about-title">Unlock Your CFA Potential</h2>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop"
              alt="A professional guiding a student through financial concepts"
              className="about-image"
            />
          </motion.div>

          <motion.div
            className="about-text-wrapper"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h3 className="about-subtitle">Your Strategic Partner for Exam Success</h3>
            <p className="about-description" style={{ color: "#555" }}>
              Led by the renowned <strong>Kunal Doshi, CFA</strong>, Edumocks is engineered to transform your CFA preparation. We move beyond simple practice—we simulate the real exam environment to build your confidence and perfect your strategy.
            </p>
            <ul className="about-features">
              <li className="about-feature-item">
                <span className="about-feature-icon"><CheckIcon /></span>
                Exam-Identical Mock Tests
              </li>
              <li className="about-feature-item">
                <span className="about-feature-icon"><CheckIcon /></span>
                Performance Analytics
              </li>
              <li className="about-feature-item">
                <span className="about-feature-icon"><CheckIcon /></span>
                Practice - Perfect - Pass Methodology
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
