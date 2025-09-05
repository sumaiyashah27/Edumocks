import React, { useEffect } from 'react';
import { motion, useInView, useAnimation, animate } from 'framer-motion';
import { useRef } from 'react';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconHelpCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;


// --- INLINE CSS STYLES ---
const DataStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --ods-color-primary: #101D42;
    --ods-color-accent: #FCA311;
    --ods-color-bg-dark: #101D42;
    --ods-color-text-light: #FFFFFF;
    --ods-color-text-muted: #adb5bd;
    --ods-color-border: rgba(255, 255, 255, 0.1);
  }

  .ods-section {
    padding: 6rem 1.5rem;
    background-color: var(--ods-color-bg-dark);
    font-family: 'Poppins', sans-serif;
    color: var(--ods-color-text-light);
  }

  .ods-container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .ods-header {
    margin-bottom: 4rem;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .ods-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .ods-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--ods-color-text-muted);
  }

  .ods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  /* --- Data Card --- */
  .ods-card {
    background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
    border-radius: 1rem;
    padding: 2.5rem;
    text-align: center;
    border: 1px solid var(--ods-color-border);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .ods-card:hover {
     transform: translateY(-8px);
     box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.2);
  }
  
  .ods-card__icon {
    color: var(--ods-color-accent);
    margin-bottom: 1.5rem;
  }
  
  .ods-card__value {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .ods-card__label {
    font-size: 1rem;
    color: var(--ods-color-text-muted);
  }
  
  @media (max-width: 992px) {
    .ods-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      max-width: 400px;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .ods-section {
      padding: 4rem 1rem;
    }
  }
`;

const dataItems = [
    { icon: IconUsers, value: 1000, suffix: "+", label: "Satisfied Students" },
    { icon: IconHelpCircle, value: 10000, suffix: "+", label: "Questions Answered" },
    { icon: IconCheckCircle, value: 95, suffix: "%", label: "Passing Rate" },
]

const Counter = ({ from, to, suffix }) => {
    const nodeRef = useRef();
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if(isInView) {
            const node = nodeRef.current;
            const controls = animate(from, to, {
                duration: 2,
                ease: "easeOut",
                onUpdate(value) {
                    node.textContent = Math.round(value).toLocaleString();
                }
            });
            return () => controls.stop();
        }
    }, [from, to, isInView]);

    return <h2 className="ods-card__value"><span ref={nodeRef}>{from}</span>{suffix}</h2>
}

const Data = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = DataStyles;
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="ods-section" id='data'>
      <div className='ods-container'>
        <motion.div 
          className="ods-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
           <h2 className="ods-title">Our Strength in Numbers</h2>
           <p className="ods-subtitle">
            We are proud of our community's achievements. The data speaks for itself, showcasing the dedication of our students and the effectiveness of our platform.
           </p>
        </motion.div>

        <motion.div 
          className="ods-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {dataItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div 
                  key={index}
                  className="ods-card"
                  variants={itemVariants}
                >
                    <div className="ods-card__icon"><IconComponent /></div>
                    <Counter from={0} to={item.value} suffix={item.suffix}/>
                    <p className="ods-card__label">{item.label}</p>
                </motion.div>
              )
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Data;
