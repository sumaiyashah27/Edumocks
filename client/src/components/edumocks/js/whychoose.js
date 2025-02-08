import React, { useState, useRef, useEffect } from "react";
import { FaBook, FaChartLine, FaGraduationCap } from "react-icons/fa";

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Set to 1 for the second item to be active by default
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const content = [
    {
      icon: <FaBook size={32} color={activeIndex === 0 ? "#fff" : "#100b5c"} />,
      heading: "Realistic Mock Exams",
      text: "Prepare like you're already in the exam room. Our practice tests mirror the real CFA exam to help you feel ready and confident.",
    },
    {
      icon: <FaChartLine size={32} color={activeIndex === 1 ? "#fff" : "#100b5c"} />,
      heading: "Personalized Performance Analytics",
      text: "Understand your strengths and weaknesses with detailed performance metrics to tailor your study plan.",
    },
    {
      icon: <FaGraduationCap size={32} color={activeIndex === 2 ? "#fff" : "#100b5c"} />,
      heading: "Expert Tips and Strategies",
      text: "Gain exclusive access to CFA exam tips and strategies from top performers. Learn the tricks to maximize your score!",
    },
  ];

  return (
    <div
      ref={sectionRef}
      style={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        justifyContent: "space-around",
        alignItems: "center",
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundColor: "#f9f9f9",
      }}
      id="why-us"
    >
      {/* Left Shape Section */}
      <div
        style={{
          backgroundColor: "#100b5c",
          clipPath: isSmallScreen ? "none" : "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%, 0% 50%)",
          width: isSmallScreen ? "100%" : "300px",
          minHeight: isSmallScreen ? "auto" : "70vh",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          marginBottom: isSmallScreen ? "20px" : "0",
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>WHY CHOOSE US?</h2>
        {!isSmallScreen && (
          <div
            style={{
              backgroundColor: "#5750ba",
              clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%, 0% 50%)",
              width: "300px",
              height: "70vh",
              position: "absolute",
              top: "-20px",
              left: "-20px",
              zIndex: -1,
              opacity: 0.5,
            }}
          ></div>
        )}
      </div>

      {/* Content Section */}
      <div style={{ width: isSmallScreen ? "100%" : "60%" }}>
        <p style={{ fontWeight: "bold", color: "#100b5c", textAlign: isSmallScreen ? "center" : "left" }}>
          Join thousands of successful candidates who have relied on our
          resources to enhance their exam readiness. Let's make your CFA
          journey smoother and more effective!
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {content.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                alignItems: isSmallScreen ? "center" : "start",
                backgroundColor: activeIndex === index ? "#100b5c" : "#fff",
                color: activeIndex === index ? "#fff" : "#100b5c",
                padding: "20px",
                borderRadius: "15px",
                cursor: "pointer",
                transition: "transform 0.3s ease, background-color 0.3s ease",
                transform: activeIndex === index && !isSmallScreen ? "scale(1.05)" : "scale(1)",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              <div style={{ marginBottom: isSmallScreen ? "10px" : "0", marginRight: isSmallScreen ? "0" : "15px" }}>
                {item.icon}
              </div>
              <div>
                <h5 style={{ fontWeight: "bold" }}>{item.heading}</h5>
                <p style={{ margin: 0 }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
