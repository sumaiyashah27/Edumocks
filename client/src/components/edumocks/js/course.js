import React, { useState, useEffect } from "react";
import "../../studdash/css/booktest.css";
import axios from "axios";
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const BookYourTest = ({ onScheduleTest }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // (kept—used elsewhere if needed)
  const [subjects, setSubjects] = useState([]);               // (kept)
  const [selectedSubjects, setSelectedSubjects] = useState([]); // (kept)
  const [totalPrice, setTotalPrice] = useState(0);            // (kept)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student, setStudent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    axios.get("/api/course")
      .then((response) => setCourses(response.data || []))
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setFetchError("Couldn't load courses. Please try again.");
      })
      .finally(() => setIsLoading(false));

    const studentId = localStorage.getItem('_id');
    if (studentId) {
      setIsLoggedIn(true);
      axios.get(`/api/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => setStudent(response.data))
        .catch((error) => console.error("Error fetching student data:", error));
    }

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBookTest = (course) => {
    axios.get(`/api/subject?courseId=${course._id}`)
      .then((response) => {
        const courseWithSubjects = { ...course, subjects: response.data };
        sessionStorage.setItem("selectedCourse", JSON.stringify(course));
        window.open("/book-test-view", "_blank");
      })
      .catch((error) => {
        console.error("Error fetching Topics:", error);
      });
  };

  useEffect(() => {
    if (selectedCourse && selectedCourse.subjects) {
      setSelectedSubjects(selectedCourse.subjects);
      if (selectedCourse.price > 0) {
        setTotalPrice(selectedCourse.price);
      } else {
        const total = selectedCourse.subjects.reduce((sum, subject) => sum + (subject.price || 0), 0);
        setTotalPrice(parseFloat(total.toFixed(2)));
      }
    }
  }, [selectedCourse]);

  const handleCheckboxChange = (subject) => {
    const isSelected = selectedSubjects.find((s) => s._id === subject._id);
    if (isSelected) {
      setSelectedSubjects(selectedSubjects.filter((s) => s._id !== subject._id));
      setTotalPrice((prevPrice) => parseFloat((prevPrice - (subject.price || 0)).toFixed(2)));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
      setTotalPrice((prevPrice) => parseFloat((prevPrice + (subject.price || 0)).toFixed(2)));
    }
  };

  const handlePayment = async () => {
    if (selectedSubjects.length === 0) {
      setErrorMessage("Please select at least one topic.");
      return;
    } else {
      setErrorMessage("");
    }

    navigate("/payment", {
      state: {
        studentId: student?._id,
        courseId: selectedCourse._id,
        selectedSubjects: selectedSubjects,
        totalPrice: totalPrice
      }
    });
  };

  const getGridStyle = () => {
    const isDesktop = screenWidth >= 1024;
    const cols = isDesktop ? Math.min(3, Math.max(1, courses.length)) : 1;

    return {
      display: "grid",
      gridTemplateColumns: isDesktop ? `repeat(${cols}, minmax(280px, 1fr))` : "1fr",
      gap: "28px",
      padding: "8px",
      justifyContent: isDesktop ? "center" : "stretch",
      justifyItems: isDesktop ? "center" : "stretch",
      maxWidth: isDesktop ? "1200px" : "100%",
      margin: "0 auto",
    };
  };

  const cardBase = {
    width: "100%",
    maxWidth: "360px",
    background: "rgba(255,255,255,0.86)",
    backdropFilter: "blur(6px)",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(20, 22, 60, 0.12)",
    transition: "transform 0.35s ease, box-shadow 0.35s ease",
    cursor: "pointer",
    border: "1px solid rgba(16,11,92,0.06)",
  };

  const priceToUSD = (val) => `$ ${Number(val || 0).toLocaleString("en-IN")}`;
  const placeholder = "https://via.placeholder.com/640x360.png?text=Course+Image";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% -10%, #EEF2FF 0%, rgba(255,255,255,0) 60%), radial-gradient(900px 500px at 100% 0%, #E6FFFA 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%)",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: "#1F2430",
      }}
    >
      {/* Page header */}
      <div style={{ textAlign: "center", padding: "56px 16px 18px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 12px",
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(14,10,90,0.06) 0%, rgba(200,13,24,0.06) 100%)",
            fontSize: 12,
            fontWeight: 700,
            color: "#3F3F77",
            letterSpacing: 0.6
          }}
        >
          <FaBook /> QUICK PRACTICE SLOTS OPEN
        </div>

        <h1
          style={{
            fontSize: "clamp(30px, 3.8vw, 44px)",
            fontWeight: 900,
            color: "#0E0A5A",
            marginTop: 14,
            lineHeight: 1.15
          }}
        >
          Book Your Test
        </h1>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={getGridStyle()}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="pretty-card skeleton-card">
                  <div className="skeleton-banner" />
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ width: "70%" }} />
                    <div className="skeleton-line" style={{ width: "40%" }} />
                    <div className="skeleton-btn" />
                  </div>
                </div>
              ))
            : courses.length > 0
            ? courses.map((course) => (
                // ========= START: Main Change - Added a wrapper =========
                <div key={course._id} style={{ position: "relative", paddingTop: "20px" }}>
                  
                  {/* Price ribbon - Moved here and repositioned */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      padding: "8px 16px", // Adjusted padding
                      borderRadius: 999,   // Pill shape
                      fontWeight: 800,
                      fontSize: 16,        // Slightly smaller font for balance
                      background: "linear-gradient(135deg, #0EA5E9 0%, #22C55E 100%)",
                      color: "#FFFFFF",
                      boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)",
                      whiteSpace: "nowrap" // Prevent text wrapping
                    }}
                  >
                    {Number(course.price) > 0 ? priceToUSD(course.price) : "Per-topic pricing"}
                  </div>

                  <div
                    className="pretty-card"
                    style={cardBase}
                    onClick={() => handleBookTest(course)}
                  >
                    {/* Media */}
                    <div style={{ width: "100%", overflow: "hidden" }}>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(14,10,90,0.06) 0%, rgba(14,10,90,0) 60%, rgba(14,10,90,0.06) 100%)",
                          pointerEvents: "none"
                        }}
                      />
                      <img
                        src={course.image || placeholder}
                        alt={course.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                          display: "block",
                          background: "#F7F8FC"
                        }}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                      
                      {/* Ribbon removed from here */}
                      
                    </div>

                    {/* Body */}
                    <div style={{ padding: 18, textAlign: "left" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E255E", lineHeight: 1.35, minHeight: '48px' /* Added to align titles */ }}>
                        {course.name}
                      </h3>

                      {/* CTA only */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookTest(course);
                        }}
                        className="cta-btn"
                        style={{
                          marginTop: 14,
                          width: "100%",
                          background: "linear-gradient(135deg, #C80D18 0%, #F43F5E 100%)",
                          color: "#fff",
                          padding: "12px 16px",
                          fontSize: 14,
                          fontWeight: 800,
                          border: "none",
                          borderRadius: 12,
                          cursor: "pointer",
                          boxShadow: "0 12px 30px rgba(200,13,24,0.25)"
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <FaBook /> Book Test
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
                // ========= END: Main Change =========
              ))
            : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
                  <h3 style={{ color: "#0E0A5A", fontWeight: 800, fontSize: 18 }}>No courses available right now</h3>
                  <p style={{ color: "#565B78", marginTop: 6 }}>Please check back soon.</p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default BookYourTest;