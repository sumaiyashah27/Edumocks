import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { FaUserAlt, FaBook, FaClipboard, FaChevronRight, FaChevronLeft, FaUsers, FaPoll, FaHourglassStart, FaImage, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { Row, Col, Container, Button } from "react-bootstrap";

const TeachPanel = () => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [teacher, setTeacher] = useState({
    teachId: "",
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    const _id = localStorage.getItem("_id");
    const teachId = localStorage.getItem("teachId");
    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    const email = localStorage.getItem("email");

    if (!email) {
      console.error("User not found. Redirecting to login");
      navigate("/teachLogin");
    } else {
      setTeacher({ _id, teachId, firstname, lastname, email });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/teachLogin");
  };

  const handleToggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  return (
    <Container fluid style={{ padding: 0, overflowX: "hidden" }}>
      <Row style={{ margin: 0 }}>
        {/* Left Sidebar Panel */}
        <Col
          xs={12}
          md={3}
          lg={2}
          style={{
            backgroundColor: "#100B5C",
            padding: "20px",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            width: isSidebarClosed ? "80px" : "250px",
            height: "100%",
            boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            transition: "width 0.3s ease",
            overflowY: "auto",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px", color: "#FFF" }}>
            {!isSidebarClosed && `Welcome, ${teacher.firstname}`}
          </div>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              { icon: <FaUserAlt />, label: "Dashboard", section: "dashboard" },
              { icon: <FaUsers />, label: "Students", section: "students" },
              { icon: <FaBook />, label: "Courses", section: "courses" },
              { icon: <FaClipboard />, label: "Topics", section: "subjects" },
              { icon: <FaImage />, label: "Images", section: "images" },
              { icon: <FaQuestionCircle />, label: "Questions", section: "questions" },
              { icon: <FaUsers />, label: "Student Enrollment", section: "studentenroll" },
              { icon: <FaPoll />, label: "Student Results", section: "studtestresult" },
              { icon: <FaHourglassStart />, label: "Rescheduled Tests", section: "delaytests" },
            ].map(({ icon, label, section }) => (
              <li key={section} style={{ marginBottom: "20px" }}>
                <Link
                  to={`/teachpanel/${section}`}
                  style={{
                    textDecoration: "none",
                    color: location.pathname.includes(section) ? "#FFF" : "#CCC",
                    backgroundColor: location.pathname.includes(section) ? "#007bff" : "",
                    padding: "10px",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    borderRadius:'8px'
                  }}
                >
                  <span style={{ marginRight: isSidebarClosed ? "100px" : "10px" }}>{icon}</span>
                  {!isSidebarClosed && label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt /> {!isSidebarClosed && "Logout"}
            </Button>
          </div>
        </Col>

        {/* Right Content Panel */}
        <Col
          xs={12}
          md={9}
          lg={10}
          style={{
            padding: "20px",
            marginLeft: isSidebarClosed ? "150px" : "auto",
            transition: "margin-left 0.3s ease",
            paddingTop: "20px",
          }}
        >
          <Outlet />
        </Col>
      </Row>

      {/* Sidebar Toggle Button */}
      <Button
        variant="link"
        onClick={handleToggleSidebar}
        style={{
          position: "fixed",
          top: "20px",
          left: isSidebarClosed ? "85px" : "270px",
          fontSize: "1.5rem",
          padding: 0,
          backgroundColor: "#C80D18",
          border: "none",
          borderRadius: "8px",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
        }}
      >
        {isSidebarClosed ? <FaChevronRight /> : <FaChevronLeft />}
      </Button>
    </Container>
  );
};

export default TeachPanel;