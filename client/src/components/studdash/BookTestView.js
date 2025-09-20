import axios from "axios";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookTestView = () => {
  const [course, setCourse] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("_id");
    if (studentId) {
      setIsLoggedIn(true);
      axios
        .get(`/api/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setStudent(response.data))
        .catch((error) => console.error("Error fetching student data:", error));
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCourse");
    if (stored) setCourse(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (course && course.subjects) {
      setSelectedSubjects(course.subjects);

      if (course.price > 0) {
        setTotalPrice(course.price);
      } else {
        const total = course.subjects.reduce((sum, subject) => sum + (subject.price || 0), 0);
        setTotalPrice(parseFloat(total.toFixed(2)));
      }
    }
  }, [course]);

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
      setErrorMessage("Please select at least one Topics.");
      return;
    } else {
      setErrorMessage("");
    }

    let studentId = student?._id;
    let courseId = course?._id;

    if (!studentId) studentId = localStorage.getItem("_id");

    const payload = {
      from: "/payment",
      studentId,
      courseId,
      selectedSubjects,
      totalPrice,
    };

    // Persist payload so it survives full reloads / redirect flows
    try {
      sessionStorage.setItem("preAuthPayload", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not persist preAuthPayload", e);
    }

    if (!isLoggedIn) {
      // pass via location.state for convenience (sessionStorage is fallback)
      navigate("/studLogin", { state: payload });
    } else {
      navigate("/payment", { state: payload });
    }
  };

  if (!course) return <p style={{ padding: 24 }}>Loading Course Info...</p>;

  return (
    <>
      {/* Responsive styles */}
      <style>{`
        :root{
          --bg-1: #FAFBFF;
          --card-bg: #FFFFFF;
          --muted: #6B7280;
          --accent: #C80D18;
          --green: #059669;
          --card-border: #edf0f5;
          --shadow-sm: 0 6px 16px rgba(16,24,40,0.06);
        }

        .btv-page {
          min-height: 100vh;
          padding: 32px 20px;
          background:
            radial-gradient(1200px 600px at 10% -10%, #EEF2FF 0%, rgba(255,255,255,0) 60%),
            radial-gradient(900px 500px at 100% 0%, #E6FFFA 0%, rgba(255,255,255,0) 55%),
            linear-gradient(180deg, var(--bg-1) 0%, #FFFFFF 100%);
          box-sizing: border-box;
        }

        .btv-container {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .btv-header {
          grid-column: 1 / -1;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          padding: 24px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        }

        .btv-title {
          display:flex;
          gap:14px;
          align-items:center;
        }
        .btv-title .badge-sq {
          width:44px; height:44px; border-radius:12px;
          background: linear-gradient(135deg, rgba(14,10,90,0.08) 0%, rgba(200,13,24,0.08) 100%);
        }
        .btv-title h2 { margin:0; font-size:clamp(20px,2.6vw,28px); font-weight:900; color:#100B5C; line-height:1.2; }
        .btv-title p { margin:0; color:var(--muted); font-size:14px; margin-top:6px; }

        .btv-price-pill {
          padding:10px 14px;
          color:#fff;
          border-radius:12px;
          font-weight:900;
          font-size:18px;
          box-shadow: 0 10px 22px rgba(16,185,129,0.12);
        }

        /* left panel (subjects) */
        .btv-left {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          padding: 20px;
        }

        .btv-selectall {
          margin-bottom: 14px;
          display:flex;
          align-items:center;
          gap:10px;
          background:#F8FAFF;
          border:1px solid #E6E9F5;
          padding:10px;
          border-radius:12px;
        }

        .subject-list {
          list-style:none;
          padding:0;
          margin:0;
          display:grid;
          grid-template-columns: 1fr;
          gap:12px;
        }
        .subject-item {
          border-radius:14px;
          border:1px solid var(--card-border);
          box-shadow: var(--shadow-sm);
          padding:14px 16px;
          background:var(--card-bg);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .subject-item:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(16,24,40,0.10); }

        .subject-meta { display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap; }

        .subject-desc { margin-top:10px; color:#4a5268; font-size:14px; text-align:left; }

        /* right sticky summary */
        .btv-right {
          position: sticky;
          top: 24px;
          align-self: start;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          padding: 20px;
          display:flex;
          flex-direction:column;
          gap:16px;
          min-height:160px;
        }
        .btv-right .total-label { font-size:14px; color:var(--muted); font-weight:700; }
        .btv-right .total-value { margin-top:6px; font-size:28px; font-weight:900; color:#0E766E; }

        .btn-book {
          background: linear-gradient(135deg, #C80D18 0%, #F43F5E 100%);
          color: #fff;
          padding:12px 18px;
          font-size:16px;
          font-weight:900;
          border:none;
          border-radius:12px;
          cursor:pointer;
          box-shadow: 0 14px 32px rgba(200,13,24,0.18);
          width:100%;
        }
        .btn-book:hover { transform: translateY(-2px); filter:brightness(1.05); }

        .error-msg { color:#B91C1C; font-weight:800; margin-top:16px; text-align:center; }

        /* Mobile behavior: stack and fixed bottom CTA */
        @media (max-width: 880px) {
          .btv-container { grid-template-columns: 1fr; }
          .btv-right { position: static; width: 100%; }
          .btv-header { padding: 18px; }

          /* bottom CTA bar */
          .btv-bottom-cta {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            border-top: 1px solid var(--card-border);
            padding: 10px;
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 -6px 24px rgba(16,24,40,0.06);
            z-index: 1200;
          }
          .btv-bottom-cta .summary { display:flex; flex-direction:column; gap:2px; }
          .btv-page { padding-bottom: 92px; } /* space for bottom CTA */
        }
      `}</style>

      <div className="btv-page">
        <div className="btv-container">
          {/* Header */}
          <div className="btv-header">
            <div className="btv-title">
              <div className="badge-sq" />
              <div>
                <h2>Select Topics for {course.name}</h2>
                <p>Choose topic(s) below. Your price updates automatically.</p>
              </div>
            </div>

            <div
              className="btv-price-pill"
              style={{
                background:
                  course.price > 0
                    ? "linear-gradient(135deg, #0EA5E9 0%, #22C55E 100%)"
                    : "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              }}
            >
              {course.price > 0 ? `Course Price: $${course.price}` : "Per-topic pricing"}
            </div>
          </div>

          {/* Left: subjects */}
          <div className="btv-left">
            {course.price === 0 && (
              <div className="btv-selectall">
                <label style={{ fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={selectedSubjects.length === course.subjects.length}
                    onChange={() => {
                      if (selectedSubjects.length === course.subjects.length) {
                        setSelectedSubjects([]);
                        setTotalPrice(0);
                      } else {
                        setSelectedSubjects(course.subjects);
                        const total = course.subjects.reduce((sum, subject) => sum + (subject.price || 0), 0);
                        setTotalPrice(parseFloat(total.toFixed(2)));
                      }
                    }}
                    style={{ accentColor: "#C80D18", width: 20, height: 20 }}
                  />
                  Select all topics
                </label>
              </div>
            )}

            <ul className="subject-list">
              {course.subjects.map((subject) => (
                <li
                  key={subject._id}
                  className="subject-item"
                  role="button"
                  aria-pressed={selectedSubjects.some((s) => s._id === subject._id)}
                >
                  <div className="subject-meta">
                    <label style={{ fontSize: "1.05rem", color: "#1f275f", fontWeight: 800, cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(subject)}
                        checked={selectedSubjects.some((s) => s._id === subject._id)}
                        disabled={course.price > 0}
                        style={{ accentColor: "#C80D18", width: 18, height: 18 }}
                      />
                      <span>{subject.name}</span>
                    </label>

                    {typeof subject.price === "number" && course.price === 0 && (
                      <div style={{ fontWeight: 900, color: "var(--green)", fontSize: 16, background: "#ECFDF5", border: "1px solid #D1FAE5", padding: "6px 10px", borderRadius: 10 }}>
                        ${subject.price}
                      </div>
                    )}
                  </div>

                  {subject.description && (
                    <div className="subject-desc">
                      <span style={{ fontWeight: 800, color: "#1F2937" }}>Description:&nbsp;</span>
                      <span dangerouslySetInnerHTML={{ __html: subject.description || "" }} />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {errorMessage && <div className="error-msg">{errorMessage}</div>}
          </div>

          {/* Right: summary / CTA */}
          <aside className="btv-right">
            <div>
              <div className="total-label">Total Price</div>
              <div className="total-value">${parseFloat(totalPrice).toFixed(2)}</div>
              {course.price > 0 && <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>Fixed course price (topic selection disabled)</div>}
            </div>

            <button className="btn-book" onClick={handlePayment}>
              Book Test
            </button>
          </aside>
        </div>

        {/* Mobile bottom CTA (only visible on small screens) */}
        <div className="btv-bottom-cta" style={{ display: "none" }}>
          {/* we will show via CSS media query; but keep inline style default hidden for non-css environments */}
          <div className="summary">
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>${parseFloat(totalPrice).toFixed(2)}</div>
          </div>
          <div style={{ width: 160 }}>
            <button className="btn-book" onClick={handlePayment} style={{ width: "100%" }}>
              Book Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookTestView;
