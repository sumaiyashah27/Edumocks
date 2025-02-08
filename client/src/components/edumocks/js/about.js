import React from "react";
import { motion } from "framer-motion";
import aboutImg from "../../edumocks/assets/about.png";

const AboutUs = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#f8f9fa",
        minHeight: "100vh",
        overflow: "hidden",
        padding: "2rem",
      }}
      id="about"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "2rem",
            fontWeight: "bold",
            color: "#100b5c",
            fontSize: "2rem",
          }}
        >
          <span style={{ color: "#c80d18" }}>Empowering</span> Minds with Edumocks
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "left",
            gap: "3rem",
            flexWrap: "wrap", // Ensures layout is responsive on small screens
          }}
        >
          {/* Image Section with Scroll-triggered Slide-in Animation */}
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={aboutImg}
              alt="About Us"
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
            />
          </motion.div>

          {/* Text Section with Scroll-triggered Slide-in Animation */}
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ padding: "1rem", maxWidth: "600px" }}
          >
            <h3
              style={{
                fontWeight: "bold",
                color: "#100b5c",
                fontSize: "1.75rem",
              }}
            >
              <span style={{ fontSize: "2rem", fontWeight: "bold" }}>W</span>ho We
              Are
            </h3>
            <p
              style={{
                lineHeight: "1.8",
                color: "#555",
                textAlign: "justify",
                fontSize: "1rem",
              }}
            >
              Edumocks is a cutting-edge educational platform dedicated to
              revolutionizing the way students learn and educators teach. With
              our interactive mock tests, gamified learning experiences, and
              personalized progress tracking, we bridge the gap between education
              and engagement. Our mission is to empower minds, inspire innovation,
              and nurture future leaders.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
