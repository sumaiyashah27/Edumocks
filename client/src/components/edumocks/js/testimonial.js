import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICONS ---
const IconQuote = () => <svg width="48" height="36" viewBox="0 0 48 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.8889 36C15.9259 36 13.2407 34.9259 10.8333 32.7778C8.42593 30.6296 7.22222 28.0741 7.22222 25.1111C7.22222 21.6667 8.11111 18.5185 9.88889 15.6667C11.6667 12.8148 14.1296 9.77778 17.2778 6.55556L21.3333 9.77778C19.2593 12.3333 17.6296 14.6111 16.4444 16.6111C15.2593 18.6111 14.6667 20.8148 14.6667 23.2222H18.8889V36ZM43.5556 36C40.5926 36 37.9074 34.9259 35.5 32.7778C33.0926 30.6296 31.8889 28.0741 31.8889 25.1111C31.8889 21.6667 32.7778 18.5185 34.5556 15.6667C36.3333 12.8148 38.7963 9.77778 41.9444 6.55556L46 9.77778C43.9259 12.3333 42.2963 14.6111 41.1111 16.6111C39.9259 18.6111 39.3333 20.8148 39.3333 23.2222H43.5556V36Z"/></svg>;

// --- INLINE CSS STYLES ---
const TestimonialStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --ts-color-primary: #101D42;
    --ts-color-accent: #FCA311;
    --ts-color-bg-dark: #101D42;
    --ts-color-text-light: #FFFFFF;
    --ts-color-text-muted: #adb5bd;
    --ts-color-border: rgba(255, 255, 255, 0.1);
  }

  .ts-section {
    padding: 6rem 0;
    background-color: var(--ts-color-bg-dark);
    font-family: 'Poppins', sans-serif;
    color: var(--ts-color-text-light);
    overflow: hidden;
  }

  .ts-container {
    max-width: 1600px;
    margin: 0 auto;
  }

  .ts-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 0 1.5rem;
  }
  
  .ts-header h2 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  
  .ts-header p {
    font-size: 1.1rem;
    color: var(--ts-color-text-muted);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .ts-carousel-wrapper {
    display: flex;
  }

  .ts-carousel-track {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .ts-card {
    flex: 0 0 380px;
    background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
    border: 1px solid var(--ts-color-border);
    border-radius: 1.5rem;
    padding: 2.5rem;
    min-height: 280px;
    display: flex;
    flex-direction: column;
  }
  
  .ts-quote-icon {
    color: var(--ts-color-accent);
    margin-bottom: 1.5rem;
  }
  
  .ts-opinion {
    flex-grow: 1;
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  
  .ts-author-info {
    border-top: 1px solid var(--ts-color-border);
    padding-top: 1.5rem;
  }
  
  .ts-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
  
  .ts-role {
    font-size: 0.9rem;
    color: var(--ts-color-text-muted);
    margin: 0;
  }

  @media (max-width: 480px) {
    .ts-card {
      flex-basis: 90vw;
    }
  }
`;

const testimonials = [
  { name: "Amit Desai", opinion: "Edumocks helped me prepare effectively for CFA. The mock tests are spot on!" },
  { name: "Sophia Williams", opinion: "A fantastic platform! The study materials are very well-organized." },
  { name: "Rajiv Kumar", opinion: "I scored exceptionally well in CFA thanks to Edumocks. Highly recommended!" },
  { name: "Olivia Brown", opinion: "Great for practice exams. The user interface is intuitive and easy to use." },
  { name: "Ananya Sharma", opinion: "Edumocks has everything a CFA aspirant needs. Simply amazing!" },
  { name: "Liam Johnson", opinion: "The mock exams simulate real scenarios perfectly. Brilliant resource!" },
  { name: "Priya Patel", opinion: "It's my go-to platform for CFA preparation. Fantastic experience!" },
  { name: "Ethan Wilson", opinion: "Edumocks has set a benchmark for preparation platforms. Love it!" },
  { name: "Neha Mehta", opinion: "Absolutely love the question bank and analytics. Made studying so much easier!" },
  { name: "Mia Martinez", opinion: "The detailed explanations for each question are extremely helpful." },
  { name: "Arjun Verma", opinion: "I recommend Edumocks to all my peers. The mock tests are a game-changer!" },
  { name: "Isabella Davis", opinion: "One of the best tools for CFA preparation I’ve come across." },
];

const CARD_WIDTH = 380;
const GAP = 24;

const TestimonialsCarousel = () => {
    
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = TestimonialStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);
    
    // Duplicate the testimonials to create a seamless loop
    const loopedTestimonials = [...testimonials, ...testimonials];

    const animationKeyframes = [0, -testimonials.length * (CARD_WIDTH + GAP)];
    const animationDuration = testimonials.length * 5; // 5 seconds per card

    return (
        <section className="ts-section" id="testimonials">
            <div className="ts-container">
                <motion.div 
                    className="ts-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <div>
                        <h2>What Our Students Say</h2>
                        <p>Real stories from CFA aspirants who have achieved their goals with our platform.</p>
                    </div>
                </motion.div>

                <div className="ts-carousel-wrapper">
                    <motion.div
                        className="ts-carousel-track"
                        animate={{ x: animationKeyframes }}
                        transition={{
                            duration: animationDuration,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        whileHover={{ animationPlayState: 'paused' }}
                    >
                        {loopedTestimonials.map((testimonial, index) => (
                            <div className="ts-card" key={index}>
                                <div className="ts-quote-icon"><IconQuote /></div>
                                <p className="ts-opinion">{testimonial.opinion}</p>
                                <div className="ts-author-info">
                                    <h5 className="ts-name">{testimonial.name}</h5>
                                    <p className="ts-role">CFA Aspirant</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsCarousel;

