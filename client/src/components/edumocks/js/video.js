import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SELF-CONTAINED, MODERN SVG ICON ---
const IconPlay = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.34267 4.22301C5.00699 3.39832 3.22417 4.27932 3.22417 5.86175V18.1383C3.22417 19.7207 5.00699 20.6017 6.34267 19.777L18.6756 13.6387C19.9513 12.8519 19.9513 11.1481 18.6756 10.3613L6.34267 4.22301Z"/>
    </svg>
);


// --- INLINE CSS STYLES ---
const VideoPlayerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --vp-color-primary: #101D42;
    --vp-color-accent: #FCA311;
    --vp-color-bg: #FFFFFF;
  }

  .vp-section {
    padding: 4rem 1.5rem;
    background-color: var(--vp-color-bg);
    font-family: 'Poppins', sans-serif;
  }

  .vp-container {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .vp-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .vp-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    color: var(--vp-color-primary);
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  /* --- Video Player --- */
  .vp-video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    border-radius: 1.5rem;
    background-color: #000;
    box-shadow: 0 25px 50px -12px rgba(16, 29, 66, 0.2);
  }
  
  .vp-video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .vp-play-button-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: var(--vp-thumbnail-url);
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  
  .vp-play-button {
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    display: grid;
    place-items: center;
    border: none;
    color: var(--vp-color-primary);
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
    padding-left: 5px; /* Optical alignment for play icon */
  }

  .vp-play-button:hover {
    transform: scale(1.1);
    background-color: white;
    animation-play-state: paused;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
    70% { box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
  }
`;

const VideoPlayer = ({ videoId, title }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const thumbnailUrl = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = VideoPlayerStyles;
        document.head.appendChild(styleElement);
        
        // Set the thumbnail URL as a CSS variable
        document.documentElement.style.setProperty('--vp-thumbnail-url', thumbnailUrl);

        return () => {
            document.head.removeChild(styleElement);
            document.documentElement.style.removeProperty('--vp-thumbnail-url');
        };
    }, [thumbnailUrl]);

    return (
        <section className="vp-section">
            <div className="vp-container">
                {title && (
                    <motion.div
                        className="vp-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <h2 className="vp-title">{title}</h2>
                    </motion.div>
                )}
                <motion.div
                    className="vp-video-wrapper"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <AnimatePresence>
                        {!isVideoPlaying && (
                            <motion.div
                                className="vp-play-button-overlay"
                                onClick={() => setIsVideoPlaying(true)}
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <button className="vp-play-button" aria-label="Play Video">
                                    <IconPlay />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {(
                        <iframe
                            title="YouTube Video Player"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

// To use this component, you would render it like this:
// <VideoPlayer videoId="dQw4w9WgXcQ" title="Watch Our Platform Overview" />
export default VideoPlayer;
