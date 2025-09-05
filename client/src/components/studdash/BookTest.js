import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../studdash/css/booktest.css"; // <-- path adjust if needed

const BookYourTest = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/course")
      .then((res) => setCourses(res.data || []))
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  }, []);

  const placeholder =
    "https://via.placeholder.com/640x360.png?text=Course+Image";
  const priceToUSD = (v) => `$ ${Number(v || 0).toLocaleString("en-IN")}`;

  const handleBookTest = (course) => {
    // Open detailed view / selection page
    sessionStorage.setItem("selectedCourse", JSON.stringify(course));
    window.open("/book-test-view", "_blank");
  };

  return (
    <div className="booktest">
      <header className="bt-header">
        <h1 className="bt-title">Book Your Test</h1>
      </header>

      <main className="bt-container">
        <section className="bt-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <article className="bt-card bt-skeleton" key={`sk-${i}`}>
                  <div className="bt-media">
                    <div className="bt-media-box" />
                  </div>
                  <div className="bt-body">
                    <div className="sk-line sk-1" />
                    <div className="sk-line sk-2" />
                    <div className="sk-btn" />
                  </div>
                </article>
              ))
            : courses.length > 0
            ? courses.map((c) => (
                <article
                  className="bt-card"
                  key={c._id}
                  onClick={() => handleBookTest(c)}
                >
                  <div className="bt-media">
                    <div className="bt-media-box">
                      <img
                        src={c.image || placeholder}
                        alt={c.name}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <div className="bt-ribbon">
                      {Number(c.price) > 0
                        ? priceToUSD(c.price)
                        : "Per-topic pricing"}
                    </div>
                  </div>

                  <div className="bt-body">
                    <h3 className="bt-name">{c.name}</h3>
                    <button
                      className="bt-cta"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookTest(c);
                      }}
                      aria-label={`Book test for ${c.name}`}
                    >
                      <span className="bt-cta-inner">
                        <FaBook />
                        Book Test
                      </span>
                    </button>
                  </div>
                </article>
              ))
            : (
              <div className="bt-empty">
                <h3>No courses available right now</h3>
                <p>Please check back soon.</p>
              </div>
            )}
        </section>
      </main>
    </div>
  );
};

export default BookYourTest;
