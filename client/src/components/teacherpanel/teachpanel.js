// src/components/TeachPanel.jsx
import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserAlt,
  FaBook,
  FaClipboard,
  FaChevronRight,
  FaChevronLeft,
  FaUsers,
  FaPoll,
  FaHourglassStart,
  FaImage,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Button } from "react-bootstrap";

/* ---------------------------
   Styles (single injected string)
   --------------------------- */
const TeachPanelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root{
    --tp-bg: #F6F7FB;
    --tp-sidebar: #100B5C;
    --tp-accent: #FCA311;
    --tp-active: #007bff;
    --tp-text-light: #ffffff;
    --tp-muted: #c7cbe0;
    --tp-border: rgba(255,255,255,0.06);
  }

  *{ box-sizing: border-box; }

  .tp-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    font-family: 'Poppins', sans-serif;
    background: var(--tp-bg);
    color: #20242b;
    overflow: hidden;
  }

  /* Sidebar */
  .tp-sidebar {
    background: var(--tp-sidebar);
    color: var(--tp-text-light);
    width: 250px;
    min-width: 80px;
    transition: width 0.28s ease, transform 0.28s ease;
    display:flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 2px 0 18px rgba(16,11,92,0.14);
    overflow-y: auto;
  }

  .tp-sidebar.collapsed { width: 80px; }

  .tp-header {
    margin-bottom: 18px;
  }
  .tp-welcome {
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--tp-text-light);
    white-space: nowrap;
  }

  .tp-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1 1 auto;
  }

  .tp-nav-item { margin-bottom: 12px; }

  .tp-nav-link {
    display:flex;
    align-items:center;
    gap: 12px;
    padding: 10px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--tp-muted);
    transition: all 0.16s ease;
    font-size: 0.98rem;
  }

  .tp-nav-link .tp-icon {
    display: inline-flex;
    align-items:center;
    justify-content:center;
    width: 30px;
    min-width: 30px;
    font-size: 1.05rem;
  }

  .tp-nav-link:hover {
    transform: translateX(4px);
    color: var(--tp-text-light);
    background: rgba(255,255,255,0.03);
  }

  .tp-nav-link.active {
    background: var(--tp-active);
    color: var(--tp-text-light);
    font-weight: 600;
  }

  .tp-sidebar-footer {
    margin-top: 18px;
  }

  .tp-logout {
    width: 100%;
    display:flex;
    align-items:center;
    gap: 10px;
    padding: 9px;
    border-radius: 8px;
    background: transparent;
    color: var(--tp-muted);
    border: none;
    cursor: pointer;
  }
  .tp-logout:hover { background: rgba(255,255,255,0.03); color: var(--tp-text-light); }

  /* Main content */
  .tp-main {
    flex: 1 1 auto;
    display:flex;
    flex-direction: column;
    min-width: 0;
  }

  .tp-topbar {
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding: 14px 20px;
    background: #fff;
    border-bottom: 1px solid #eef0f5;
    box-shadow: 0 1px 0 rgba(0,0,0,0.02);
  }

  .tp-title { font-size: 1.15rem; font-weight: 600; color: #0f2147; margin:0; }

  .tp-actions { display:flex; gap:12px; align-items:center; }

  .tp-content {
    padding: 20px;
    height: calc(100vh - 64px);
    overflow-y: auto;
    background: transparent;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .tp-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      transform: translateX(-110%);
      z-index: 1400;
      width: 260px;
    }
    .tp-sidebar.open {
      transform: translateX(0);
    }

    .tp-sidebar.collapsed { width: 260px; }

    .tp-topbar { padding: 10px 12px; }
    .tp-content { padding: 12px; }
  }
`;

/* ---------------------------
   Menu items
   --------------------------- */
const menuItems = [
  { name: "Dashboard", path: "/teachpanel/dashboard", icon: FaUserAlt, key: "dashboard" },
  { name: "Students", path: "/teachpanel/students", icon: FaUsers, key: "students" },
  { name: "Courses", path: "/teachpanel/courses", icon: FaBook, key: "courses" },
  { name: "Topics", path: "/teachpanel/subjects", icon: FaClipboard, key: "subjects" },
  { name: "Images", path: "/teachpanel/images", icon: FaImage, key: "images" },
  { name: "Questions", path: "/teachpanel/questions", icon: FaQuestionCircle, key: "questions" },
  { name: "Student Enrollment", path: "/teachpanel/studentenroll", icon: FaUsers, key: "studentenroll" },
  { name: "Student Results", path: "/teachpanel/studtestresult", icon: FaPoll, key: "studtestresult" },
  { name: "Scheduled Tests", path: "/teachpanel/scheduledtests", icon: FaHourglassStart, key: "scheduledtests" },
  { name: "Rescheduled Tests", path: "/teachpanel/delaytests", icon: FaHourglassStart, key: "delaytests" },
];

/* ---------------------------
   Component
   --------------------------- */
const sidebarVariants = {
  closed: { x: "-110%" },
  open: { x: 0 },
};

const TeachPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teacher, setTeacher] = useState({
    teachId: "",
    firstname: "",
    lastname: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // inject styles once
    const id = "teachpanel-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.innerHTML = TeachPanelStyles;
      document.head.appendChild(s);
    }

    // read localStorage for auth & details
    const _id = localStorage.getItem("_id");
    const teachId = localStorage.getItem("teachId");
    const firstname = localStorage.getItem("firstname") || "";
    const lastname = localStorage.getItem("lastname") || "";
    const email = localStorage.getItem("email") || "";
    //support@edumocks.com
    // simple auth guard — adjust as needed
    if (!email || email !== "support@edumocks.com") {
      console.error("Unauthorized access. Redirecting to login");
      localStorage.clear();
      navigate("/teachLogin", { replace: true });
      return;
    }

    setTeacher({ _id, teachId, firstname, lastname, email });
    setIsLoading(false);

    // clean up on unmount: optional
    return () => {};
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/teachLogin", { replace: true });
  };

  const handleToggleSidebar = () => {
    // on desktop: collapse; on mobile: toggle open/close
    if (window.innerWidth < 768) {
      setMobileOpen((v) => !v);
    } else {
      setIsSidebarClosed((v) => !v);
    }
  };

  const onNavigate = () => {
    // close mobile sidebar after navigation
    if (window.innerWidth < 768) setMobileOpen(false);
  };

  const desktopClass = isSidebarClosed ? "collapsed" : "";

  return (
    <div className="tp-layout" role="application" aria-label="Teacher panel">
      {/* Sidebar (desktop) */}
      <AnimatePresence>
        {window.innerWidth < 768 ? (
          // mobile animated sidebar
          mobileOpen && (
            <motion.aside
              className={`tp-sidebar open`}
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="navigation"
              aria-label="Mobile main navigation"
            >
              <div className="tp-header">
                <div className="tp-welcome">Welcome, {isLoading ? "..." : teacher.firstname}</div>
              </div>

              <ul className="tp-nav" role="menu">
                {menuItems.map((m) => {
                  const Icon = m.icon;
                  return (
                    <li className="tp-nav-item" key={m.key}>
                      <NavLink
                        to={m.path}
                        className={({ isActive }) => `tp-nav-link ${isActive ? "active" : ""}`}
                        onClick={onNavigate}
                      >
                        <span className="tp-icon" aria-hidden>
                          <Icon />
                        </span>
                        <span>{m.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <div className="tp-sidebar-footer">
                <button className="tp-logout" onClick={handleLogout} aria-label="Logout">
                  <span className="tp-icon">
                    <FaSignOutAlt />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          )
        ) : (
          // desktop sidebar (always present)
          <aside className={`tp-sidebar ${desktopClass}`} role="navigation" aria-label="Main navigation">
            <div className="tp-header">
              <div className="tp-welcome">{!isSidebarClosed ? `Welcome, ${isLoading ? "..." : teacher.firstname}` : "E"}</div>
            </div>

            <ul className="tp-nav" role="menu">
              {menuItems.map((m) => {
                const Icon = m.icon;
                return (
                  <li className="tp-nav-item" key={m.key}>
                    <NavLink
                      to={m.path}
                      className={({ isActive }) => `tp-nav-link ${isActive ? "active" : ""}`}
                      onClick={onNavigate}
                    >
                      <span className="tp-icon" aria-hidden>
                        <Icon />
                      </span>
                      {!isSidebarClosed && <span>{m.name}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div className="tp-sidebar-footer">
              <button className="tp-logout" onClick={handleLogout} aria-label="Logout">
                <span className="tp-icon">
                  <FaSignOutAlt />
                </span>
                {!isSidebarClosed && <span>Logout</span>}
              </button>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="tp-main">
        <div className="tp-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleToggleSidebar}
              aria-label={isSidebarClosed ? "Open sidebar" : "Toggle sidebar"}
              style={{
                background: "var(--tp-accent)",
                border: "none",
                color: "#fff",
                padding: 8,
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {isSidebarClosed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <h2 className="tp-title">Teacher Dashboard</h2>
          </div>

          <div className="tp-actions">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 14, color: "#5d6b8a" }}>{isLoading ? "..." : `${teacher.firstname} ${teacher.lastname}`}</div>
              <button
                onClick={() => navigate("/teachpanel/profile")}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                aria-label="Open profile"
              >
                <FaUserAlt />
              </button>
            </div>
          </div>
        </div>

        <div className="tp-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeachPanel;
