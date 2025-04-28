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
        <div style={{ padding: "20px" }}>
            {course && (
                <div className="popup container" >
                    <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#100B5C", textAlign: "center", marginBottom: "20px" }}>
                        Select Topics for {course.name}
                    </h2>

                    {course.price === 0 && (
                        <div style={{ marginBottom: "15px", marginLeft:"-1.5rem" }}>
                            <label style={{ fontSize: "1rem", fontWeight: "bold", color: "#202021", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.length === course.subjects.length}  // Only check selected course subjects
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
                                    style={{ accentColor: "#C80D18", width: "20px", height: "20px", marginRight: "8px" }}
                                />
                                Select All Topics
                            </label>
                        </div>
                    )}

                    <div className="row book-now-new">

                        <ul className="subject-list mt-4 row col-md-9" style={{ listStyleType: "none", padding: 0, gap: "10px", justifyContent: "center" }}>
                            {course.subjects.map((subject) => (
                                <li className="col-md-12" key={subject._id} style={{ borderRadius: "8px", padding: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "center", transition: "transform 0.3s ease" }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                                    <label style={{ fontSize: "1.5rem", color: "#c80d18", fontWeight: '800', display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(subject)}
                                            checked={selectedSubjects.some((s) => s._id === subject._id)}
                                            disabled={course.price > 0}  // Disable checkboxes if course has a price
                                            style={{ accentColor: "#C80D18", width: "20px", height: "20px" }}
                                        />
                                        {subject.name}
                                    </label>
                                    <div className="book-test-p mt-3" style={{ textAlign: 'left' }}>
                                        <span style={{ fontWeight: "bolder" }}>Description :-</span>
                                        <div style={{ display: "table" }}
                                            dangerouslySetInnerHTML={{ __html: subject.description || '' }} />
                                    </div>

                                </li>
                            ))}
                        </ul>

                        {errorMessage && (
                            <p style={{ color: "red", fontWeight: "bold", marginTop: "20px", textAlign: "center" }}>
                                {errorMessage}
                            </p>
                        )}

                        <div className="popup-footer col-md-3" style={{ marginTop: "30px", display: "flex", flexDirection: "column" }}>
                            <p style={{ fontSize: "1.2rem", color: "#202021", fontWeight: "bold", marginBottom: "20px", }}>
                                Total Price: ${parseFloat(totalPrice).toFixed(2)}
                            </p>
                            <button className="popup-button" onClick={handlePayment} style={{ backgroundColor: "#C80D18", color: "#fff", padding: "12px 25px", fontSize: "1.2rem", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: "10px", transition: "background-color 0.3s ease, transform 0.3s ease" }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d47b09"; e.currentTarget.style.transform = "scale(1.05)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#C80D18"; e.currentTarget.style.transform = "scale(1)"; }}>
                                Book Test
                            </button>

                            {/* Close Button */}
                            <div style={{ position: "absolute", top: "15px", right: "15px", cursor: "pointer" }}
                                onClick={() => { setCourse(null); setSubjects([]); setSelectedSubjects([]); setTotalPrice(0); }}>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookTestView;