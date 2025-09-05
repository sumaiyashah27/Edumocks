import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

// --- INLINE CSS STYLES ---
const FaqStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --faq-color-primary: #101D42;
    --faq-color-accent: #FCA311;
    --faq-color-bg: #FFFFFF;
    --faq-color-text-dark: #141414;
    --faq-color-text-light: #6c757d;
    --faq-color-border: #e9ecef;
    --faq-color-text-white: #FFFFFF;
  }

  .faq-section {
    padding: 6rem 1.5rem;
    background-color: var(--faq-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .faq-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* --- Header --- */
  .faq-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .faq-title {
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--faq-color-primary);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }

  .faq-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--faq-color-text-light);
    max-width: 600px;
    margin: 0 auto;
  }

  /* --- Accordion --- */
  .faq-accordion {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .faq-item {
    background-color: #F8F9FA;
    border-radius: 1rem;
    border: 1px solid var(--faq-color-border);
    overflow: hidden;
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    padding: 1.5rem;
    cursor: pointer;
    text-align: left;
    background: none;
    border: none;
    transition: background-color 0.3s ease;
  }

  .faq-question:hover {
    background-color: var(--faq-color-primary);
  }

  .faq-question:hover .faq-question-text,
  .faq-question:hover .faq-number,
  .faq-question:hover .faq-icon {
    color: var(--faq-color-text-white);
  }

  .faq-question-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .faq-number {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--faq-color-text-light);
    transition: color 0.3s ease;
  }

  .faq-item.open .faq-question {
    background-color: var(--faq-color-primary);
  }
  
  .faq-item.open .faq-number,
  .faq-item.open .faq-question-text,
  .faq-item.open .faq-icon {
    color: var(--faq-color-text-white);
  }

  .faq-question-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--faq-color-text-dark);
    transition: color 0.3s ease;
  }
  
  .faq-icon {
    flex-shrink: 0;
    transition: transform 0.3s ease, color 0.3s ease;
    color: var(--faq-color-text-light);
  }
  
  .faq-item.open .faq-icon {
    transform: rotate(180deg);
  }
  
  .faq-answer-container {
    overflow: hidden;
  }
  
  .faq-answer {
    padding: 0 1.5rem 1.5rem;
    font-size: 1rem;
    line-height: 1.8;
    color: var(--faq-color-text-light);
    background-color: #F8F9FA;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .faq-section {
      padding: 4rem 1rem;
    }
    .faq-question {
        padding: 1.25rem;
        gap: 1rem;
    }
    .faq-question-content {
      gap: 1rem;
    }
    .faq-question-text {
        font-size: 1rem;
    }
    .faq-answer {
        padding: 0 1.25rem 1.25rem;
    }
  }
`;

const faqData = [
    { question: "Does EduMocks charge a fee for booking mock tests?", answer: "Yes, we charge a fee based on the course selected. Each test is priced to reflect the comprehensive and up-to-date content provided." },
    { question: "How do I access the mock exams on EduMocks?", answer: "First, select the course you wish to take from our catalog. Afterward, complete the secure payment process and book your test slot to begin." },
    { question: "Are mock exams updated to the latest CFA curriculum?", answer: "Absolutely. Our team of experts ensures that all mock exams are updated regularly to align perfectly with the latest CFA curriculum changes and exam patterns." },
    { question: "Can I track my progress and performance?", answer: "Yes, after completing each test, you can access a detailed performance analysis in your student panel to track your progress and identify areas for improvement." },
    { question: "Do you provide explanations for mock exam questions?", answer: "Yes, we provide detailed, step-by-step solutions and explanations via email after you complete the test to help you understand the concepts thoroughly." },
    { question: "Is there a limit to the number of mock tests I can take?", answer: "No, there is no limit. You can take as many tests as you wish by rescheduling and paying the required amount for each new test." },
];

const AccordionItem = ({ faq, index, isOpen, onClick }) => (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
        <button className="faq-question" onClick={onClick}>
            <div className="faq-question-content">
                <span className="faq-number">0{index + 1}</span>
                <span className="faq-question-text">{faq.question}</span>
            </div>
            <div className="faq-icon"><IconChevronDown /></div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    className="faq-answer-container"
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <p className="faq-answer">{faq.answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


const Questions = () => {
    const [activeIndex, setActiveIndex] = useState(0); // Open first item by default

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = FaqStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                 <motion.div 
                    className="faq-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <p className="faq-subtitle">
                        Find quick answers to common questions below. If you can't find what you're looking for, feel free to contact us directly.
                    </p>
                </motion.div>
                
                <motion.div 
                    className="faq-accordion"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {faqData.map((faq, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <AccordionItem
                                faq={faq}
                                index={index}
                                isOpen={activeIndex === index}
                                onClick={() => handleToggle(index)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Questions;

