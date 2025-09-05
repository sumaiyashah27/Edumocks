// src/components/StudPanel.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios'; // Uncomment when you enable real API calls

/* ---------------------------
   SVG ICONS (self-contained)
   --------------------------- */
const IconDashboard = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const IconBookTest = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7z"></path></svg>
);
const IconSchedule = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const IconMaterial = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);
const IconProfile = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const IconSupport = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const IconLogout = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const IconChevronLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const IconMenu = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

/* ---------------------------
   Styles (inline string)
   --------------------------- */
const StudPanelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :root {
    --sp-color-primary: #101D42;
    --sp-color-accent: #FCA311;
    --sp-color-bg: #F8F9FA;
    --sp-color-text-light: #FFFFFF;
    --sp-color-text-muted: #adb5bd;
    --sp-color-border: rgba(255, 255, 255, 0.08);
  }

  * { box-sizing: border-box; }

  .sp-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: 'Poppins', sans-serif;
    background-color: var(--sp-color-bg);
    color: #212529;
  }

  /* Sidebar */
  .sp-sidebar {
    background-color: var(--sp-color-primary);
    color: var(--sp-color-text-light);
    display: flex;
    flex-direction: column;
    width: 260px;
    transition: width 0.3s ease;
    min-width: 80px;
    overflow: hidden;
  }

  .sp-sidebar.collapsed { width: 80px; }

  .sp-sidebar .sp-sidebar-header {
    padding: 1.25rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid var(--sp-color-border);
    background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
  }

  .sp-logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .sp-sidebar-nav {
    list-style: none;
    margin: 0;
    padding: 0.75rem 0;
    flex: 1 1 auto;
    overflow-y: auto;
  }

  .sp-nav-link {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.65rem 1.25rem;
    margin: 0.4rem 0.5rem;
    border-radius: 0.6rem;
    color: var(--sp-color-text-muted);
    text-decoration: none;
    transition: all 0.18s ease;
    font-size: 0.95rem;
  }

  .sp-nav-link .sp-nav-icon { display: inline-flex; align-items:center; justify-content:center; width: 28px; }

  .sp-nav-link:hover { background: rgba(255,255,255,0.04); color: var(--sp-color-text-light); transform: translateX(2px); }

  .sp-nav-link.active {
    background: var(--sp-color-accent);
    color: var(--sp-color-primary);
    font-weight: 600;
  }

  .sp-sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--sp-color-border);
  }

  .sp-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    width: 100%;
    background: transparent;
    border: none;
    color: var(--sp-color-text-muted);
    padding: 0.6rem 1rem;
    border-radius: 0.6rem;
    cursor: pointer;
  }
  .sp-logout-btn:hover { background: rgba(255,255,255,0.04); color: var(--sp-color-text-light); }

  /* Main area */
  .sp-main-content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .sp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: #fff;
    border-bottom: 1px solid #e9ecef;
  }

  .sp-header h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--sp-color-primary);
    margin: 0;
  }

  .sp-mobile-toggle { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; }

  .sp-outlet-container {
    padding: 1.25rem;
    overflow-y: auto;
    height: calc(100vh - 68px);
    background: transparent;
  }

  /* responsive */
  @media (max-width: 768px) {
    .sp-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 260px;
      transform: translateX(-100%);
      z-index: 1200;
      box-shadow: 0 12px 30px rgba(16,29,66,0.35);
    }

    .sp-sidebar.open {
      transform: translateX(0);
    }

    .sp-sidebar.collapsed { width: 260px; }
  }
`;

/* ---------------------------
   Menu items
   --------------------------- */
const menuItems = [
  { name: 'Dashboard', path: '/studpanel/dashboard', icon: IconDashboard },
  { name: 'Book Test', path: '/studpanel/book-test', icon: IconBookTest },
  { name: 'Schedule Test', path: '/studpanel/schedule-test', icon: IconSchedule },
  { name: 'Study Material', path: '/studpanel/material', icon: IconMaterial },
  { name: 'Profile', path: '/studpanel/profile', icon: IconProfile },
  { name: 'Support', path: '/studpanel/support', icon: IconSupport },
];

/* ---------------------------
   Component
   --------------------------- */
const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

const StudPanel = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // inject styles once
    const styleEl = document.createElement('style');
    styleEl.id = 'studpanel-styles';
    styleEl.innerHTML = StudPanelStyles;
    document.head.appendChild(styleEl);

    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);

    // fetch student details (mocked using localStorage; replace with real API if needed)
    const fetchStudent = async () => {
      const studentId = localStorage.getItem('_id');
      const token = localStorage.getItem('token');
      if (!studentId || !token) {
        // redirect to login page
        navigate('/studLogin', { replace: true });
        return;
      }
      try {
        // Example: replace with actual API call
        // const resp = await axios.get(`/api/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` }});
        // setStudentName(`${resp.data.firstname} ${resp.data.lastname}`);
        const firstname = localStorage.getItem('firstname') || 'Student';
        setStudentName(firstname);
      } catch (err) {
        console.error('Error loading student:', err);
        localStorage.clear();
        navigate('/studLogin', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();

    return () => {
      window.removeEventListener('resize', onResize);
      const existing = document.getElementById('studpanel-styles');
      if (existing) document.head.removeChild(existing);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/studLogin', { replace: true });
  };

  const onNavigateClick = () => {
    if (isMobile) setMobileSidebarOpen(false);
  };

  // determine sidebar class for desktop collapsed state
  const desktopSidebarClass = !isMobile && sidebarCollapsed ? 'collapsed' : '';

  return (
    <div className="sp-layout" aria-live="polite">
      {/* Sidebar (desktop) */}
      <AnimatePresence>
        {/* Mobile: animated modal-like sidebar */}
        {isMobile ? (
          mobileSidebarOpen && (
            <motion.aside
              className={`sp-sidebar open`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="navigation"
              aria-label="Mobile main navigation"
            >
              <div className="sp-sidebar-header">
                <span className="sp-logo-text">Edumocks</span>
              </div>

              <ul className="sp-sidebar-nav" role="menu" aria-label="Mobile navigation">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onNavigateClick}
                        className={({ isActive }) => `sp-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <span className="sp-nav-icon" aria-hidden="true"><Icon /></span>
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <div className="sp-sidebar-footer">
                <button onClick={handleLogout} className="sp-logout-btn" aria-label="Logout">
                  <span className="sp-nav-icon"><IconLogout /></span>
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          )
        ) : (
          // Desktop sidebar (always present — supports collapse)
          <aside className={`sp-sidebar ${desktopSidebarClass}`} role="navigation" aria-label="Main navigation">
            <div className="sp-sidebar-header">
              {!sidebarCollapsed && <span className="sp-logo-text">Edumocks</span>}
              {sidebarCollapsed && <span aria-hidden="true" style={{ fontWeight: 700 }}>E</span>}
            </div>

            <ul className="sp-sidebar-nav" role="menu" aria-label="Primary navigation">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onNavigateClick}
                      className={({ isActive }) => `sp-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="sp-nav-icon" aria-hidden="true"><Icon /></span>
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div className="sp-sidebar-footer">
              <button onClick={handleLogout} className="sp-logout-btn" aria-label="Logout">
                <span className="sp-nav-icon"><IconLogout /></span>
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="sp-main-content">
        <header className="sp-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile ? (
              <button
                className="sp-mobile-toggle"
                onClick={() => setMobileSidebarOpen((s) => !s)}
                aria-label={mobileSidebarOpen ? 'Close menu' : 'Open menu'}
              >
                <IconMenu />
              </button>
            ) : (
              <button
                className="sp-mobile-toggle"
                onClick={() => setSidebarCollapsed((s) => !s)}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={sidebarCollapsed ? 'Expand' : 'Collapse'}
                style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}
              >
                <IconChevronLeft />
              </button>
            )}

            <h1 style={{ marginLeft: 4 }}>Welcome, {isLoading ? '...' : studentName}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* You can place profile / quick actions here */}
            <button
              onClick={() => navigate('/studpanel/profile')}
              aria-label="Open profile"
              className="sp-mobile-toggle"
              title="Profile"
            >
              <IconProfile />
            </button>
          </div>
        </header>

        <div className="sp-outlet-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudPanel;
