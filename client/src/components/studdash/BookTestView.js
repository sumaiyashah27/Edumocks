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

    console.log('course',student);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Fetch student data if logged in
        const studentId = localStorage.getItem('_id');
        if (studentId) {
            setIsLoggedIn(true);
            axios.get(`/api/student/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => setStudent(response.data))
                .catch((error) => console.error("Error fetching student data:", error));
        }

    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem("selectedCourse");
        if (stored) {
            setCourse(JSON.parse(stored));
        }
    }, []); 

    const handlePayment = async () => {
        if (selectedSubjects.length === 0) {
          setErrorMessage("Please select at least one Topics.");
          return;
        } else {
          setErrorMessage("");
        }
      
        let studentId = student?._id;
        let courseId = course?._id;
      
        if (!studentId) {
          studentId = localStorage.getItem('_id');
        }
      
        if (!isLoggedIn) {
          navigate("/studLogin", { 
            state: { 
              from: "/payment",
              studentId,
              courseId,
              selectedSubjects,
              totalPrice 
            } 
          });
        } else {
          navigate("/payment", { 
            state: { 
              studentId,
              courseId,
              selectedSubjects,
              totalPrice 
            } 
          });
        }
      };
      
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
            setTotalPrice((prevPrice) => parseFloat((prevPrice - subject.price).toFixed(2)));
        } else {
            setSelectedSubjects([...selectedSubjects, subject]);
            setTotalPrice((prevPrice) => parseFloat((prevPrice + subject.price).toFixed(2)));
        }
    };

    if (!course) return <p>Loading Course Info...</p>;

    return (
    <div
        style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background:
            "radial-gradient(1200px 600px at 10% -10%, #EEF2FF 0%, rgba(255,255,255,0) 60%), radial-gradient(900px 500px at 100% 0%, #E6FFFA 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%)",
        }}
    >
        {course && (
        <div
            className="container"
            style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: 24,
            }}
        >
            {/* Header / Course summary */}
            <div
            style={{
                gridColumn: "1 / -1",
                background: "white",
                border: "1px solid #edf0f5",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(16, 24, 40, 0.06)",
                padding: "24px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                rowGap: 12,
            }}
            >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background:
                    "linear-gradient(135deg, rgba(14,10,90,0.08) 0%, rgba(200,13,24,0.08) 100%)",
                }}
                />
                <div>
                <h2
                    style={{
                    margin: 0,
                    fontSize: "clamp(20px, 2.6vw, 28px)",
                    fontWeight: 900,
                    color: "#100B5C",
                    lineHeight: 1.2,
                    letterSpacing: 0.2,
                    }}
                >
                    Select Topics for {course.name}
                </h2>
                <div
                    style={{
                    marginTop: 6,
                    fontSize: 14,
                    color: "#5b607a",
                    }}
                >
                    Choose topic(s) below. Your price updates automatically.
                </div>
                </div>
            </div>

            {/* price pill (course-level) */}
            <div
                style={{
                padding: "10px 14px",
                background:
                    course.price > 0
                    ? "linear-gradient(135deg, #0EA5E9 0%, #22C55E 100%)"
                    : "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 900,
                fontSize: 18,
                boxShadow: "0 10px 22px rgba(16,185,129,0.18)",
                letterSpacing: 0.3,
                }}
            >
                {course.price > 0 ? `Course Price: $${course.price}` : "Per-topic pricing"}
            </div>
            </div>

            {/* Left: subjects list + (optional) Select All */}
            <div
            style={{
                background: "white",
                border: "1px solid #edf0f5",
                borderRadius: 16,
                boxShadow: "0 8px 24px rgba(16, 24, 40, 0.05)",
                padding: 20,
            }}
            >
            {course.price === 0 && (
                <div
                style={{
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#F8FAFF",
                    border: "1px solid #E6E9F5",
                    padding: "10px 12px",
                    borderRadius: 12,
                }}
                >
                <label
                    style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#202021",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    userSelect: "none",
                    }}
                >
                    <input
                    type="checkbox"
                    checked={selectedSubjects.length === course.subjects.length}
                    onChange={() => {
                        if (selectedSubjects.length === course.subjects.length) {
                        setSelectedSubjects([]);
                        setTotalPrice(0);
                        } else {
                        setSelectedSubjects(course.subjects);
                        const total = course.subjects.reduce(
                            (sum, subject) => sum + (subject.price || 0),
                            0
                        );
                        setTotalPrice(parseFloat(total.toFixed(2)));
                        }
                    }}
                    style={{
                        accentColor: "#C80D18",
                        width: 20,
                        height: 20,
                    }}
                    />
                    Select all topics
                </label>
                </div>
            )}

            {/* Subject tiles */}
            <ul
                className="subject-list"
                style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
                }}
            >
                {course.subjects.map((subject) => (
                <li
                    key={subject._id}
                    style={{
                    borderRadius: 14,
                    border: "1px solid #edf0f5",
                    boxShadow: "0 6px 16px rgba(16, 24, 40, 0.05)",
                    padding: "14px 16px",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    background: "#FFFFFF",
                    }}
                    onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(16,24,40,0.10)";
                    }}
                    onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(16,24,40,0.05)";
                    }}
                >
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                    }}
                    >
                    <label
                        style={{
                        fontSize: "1.05rem",
                        color: "#1f275f",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        lineHeight: 1.25,
                        }}
                    >
                        <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(subject)}
                        checked={selectedSubjects.some((s) => s._id === subject._id)}
                        disabled={course.price > 0}
                        style={{ accentColor: "#C80D18", width: 18, height: 18 }}
                        />
                        {subject.name}
                    </label>

                    {typeof subject.price === "number" && course.price === 0 && (
                        <div
                        style={{
                            fontWeight: 900,
                            color: "#059669",
                            fontSize: 16,
                            background: "#ECFDF5",
                            border: "1px solid #D1FAE5",
                            padding: "6px 10px",
                            borderRadius: 10,
                        }}
                        >
                        ${subject.price}
                        </div>
                    )}
                    </div>

                    {subject.description && (
                    <div
                        className="book-test-p"
                        style={{
                        marginTop: 10,
                        fontSize: 14,
                        color: "#4a5268",
                        textAlign: "left",
                        }}
                    >
                        <span style={{ fontWeight: 800, color: "#1F2937" }}>
                        Description:&nbsp;
                        </span>
                        <div
                        style={{ display: "inline" }}
                        dangerouslySetInnerHTML={{ __html: subject.description || "" }}
                        />
                    </div>
                    )}
                </li>
                ))}
            </ul>

            {errorMessage && (
                <p
                style={{
                    color: "#B91C1C",
                    fontWeight: 800,
                    marginTop: 16,
                    textAlign: "center",
                }}
                >
                {errorMessage}
                </p>
            )}
            </div>

            {/* Right: sticky summary / CTA */}
            <aside
            style={{
                position: "sticky",
                top: 24,
                alignSelf: "start",
                background: "white",
                border: "1px solid #edf0f5",
                borderRadius: 16,
                boxShadow: "0 8px 24px rgba(16, 24, 40, 0.05)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minHeight: 160,
            }}
            >
            <div>
                <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 700 }}>
                Total Price
                </div>
                <div
                style={{
                    marginTop: 6,
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#0E766E",
                    lineHeight: 1,
                }}
                >
                ${parseFloat(totalPrice).toFixed(2)}
                </div>
                {course.price > 0 && (
                <div
                    style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#6B7280",
                    }}
                >
                    Fixed course price (topic selection disabled)
                </div>
                )}
            </div>

            <button
                className="popup-button"
                onClick={handlePayment}
                style={{
                background:
                    "linear-gradient(135deg, #C80D18 0%, #F43F5E 100%)",
                color: "#fff",
                padding: "12px 18px",
                fontSize: 16,
                fontWeight: 900,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 14px 32px rgba(200, 13, 24, 0.25)",
                transition: "transform 0.25s ease, filter 0.25s ease",
                }}
                onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.filter = "brightness(1.05)";
                }}
                onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.filter = "brightness(1)";
                }}
            >
                Book Test
            </button>
            </aside>
        </div>
        )}
    </div>
    );

};

export default BookTestView;