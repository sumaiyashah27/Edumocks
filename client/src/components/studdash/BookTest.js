import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    sessionStorage.setItem("selectedCourse", JSON.stringify(course));
    window.open("/book-test-view", "_blank");
  };

  return (
    <>
      <style>{`
        .bty-page {
          min-height: 100vh;
          padding: 36px 18px 80px;
          background:
            radial-gradient(1200px 600px at 20% -10%, #EEF2FF 0%, rgba(255,255,255,0) 60%),
            linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #1F2430;
        }
        .bty-header { text-align:center; margin-bottom: 18px; }
        .bty-title { font-size: clamp(22px, 3.2vw, 34px); font-weight: 900; color: #0E0A5A; }

        .bty-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .bty-grid { display: grid; gap: 18px; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 640px) { .bty-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1100px) { .bty-grid { grid-template-columns: repeat(3, 1fr); } }

        /* wrapper is the positioning context for the ribbon */
        .bty-card-wrapper { position: relative; padding-top: 28px; display:flex; justify-content:center; }

        .bty-card {
          width: 100%;
          max-width: 300px;
          background: rgba(255,255,255,0.96);
          border-radius: 14px;
          overflow: visible;
          box-shadow: 0 14px 40px rgba(16,24,40,0.10);
          border: 1px solid rgba(16,11,92,0.05);
          transition: transform .22s ease, box-shadow .22s ease;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        .bty-card:hover { transform: translateY(-6px); }

        /* ✅ Full image — no crop */
        .bty-media {
          width: 100%;
          background: #F7F8FC;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
        }
        .bty-media img {
          width: 100%;
          height: auto;
          object-fit: contain; /* show full image */
          display: block;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
        }

        .bty-body { padding: 14px; text-align: left; }
        .bty-name { margin: 0 0 10px; font-size: 15px; font-weight: 800; color: #1E255E; min-height: 44px; }

        .bty-cta {
          display:inline-flex; align-items:center; gap:10px; justify-content:center;
          width:100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #C80D18 0%, #F43F5E 100%);
          color: white;
          font-weight: 800;
          font-size: 14px;
        }

        /* ribbon attached to the top-left of the card */
        .bty-ribbon {
          position: absolute;
          top: 8px; /* small offset from top of wrapper */
          left: 12px; /* attached to left edge */
          transform: rotate(-6deg);
          padding: 6px 14px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 13px;
          color: #fff;
          background: linear-gradient(135deg, #0EA5E9 0%, #22C55E 100%);
          border: 3px solid rgba(255,255,255,0.92);
          box-shadow: 0 12px 30px rgba(8,14,37,0.12);
          white-space: nowrap;
          z-index: 3;
          /* ensure ribbon doesn't block pointer events to the card/button */
          pointer-events: none;
        }

        /* When ribbon needs to be interactive (e.g., tooltip), remove pointer-events:none and adjust accordingly */
      `}</style>

      <div className="bty-page">
        <div className="bty-header">
          <h2 className="bty-title">Book Your Test</h2>
        </div>

        <div className="bty-container">
          <div className="bty-grid">
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="bty-card-wrapper">
                    <div className="bty-card"><div className="bty-media" /></div>
                  </div>
                ))
              : courses.length > 0
              ? courses.map((c) => (
                  <div key={c._id} className="bty-card-wrapper">
                    <div className="bty-ribbon">
                      {Number(c.price) > 0 ? priceToUSD(c.price) : "Per-topic pricing"}
                    </div>
                    <article
                      className="bty-card"
                      onClick={() => handleBookTest(c)}
                    >
                      <div className="bty-media">
                        <img
                          src={c.image || placeholder}
                          alt={c.name}
                          onError={(e) => (e.currentTarget.src = placeholder)}
                        />
                      </div>
                      <div className="bty-body">
                        <h3 className="bty-name">{c.name}</h3>
                        <button
                          className="bty-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookTest(c);
                          }}
                        >
                          <FaBook /> Book Test
                        </button>
                      </div>
                    </article>
                  </div>
                ))
              : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
                  <h3>No courses available right now</h3>
                  <p>Please check back soon.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookYourTest;
