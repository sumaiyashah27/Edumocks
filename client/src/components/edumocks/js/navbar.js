import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Lottie from 'react-lottie';
import hamburgerMenuData from '../json/hamburger-menu.json';
import { Link } from 'react-router-dom'; // Add Link here
import { FaSignInAlt } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll'; // Import ScrollLink for smooth scrolling
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import '../css/navbar.css';

const NavbarComponent = () => {
  const [scroll, setScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(''); // Track active menu item
  const location = useLocation(); // Get current location

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reset active menu on page change
    setActiveMenu('');

    if (location.pathname === '/') {
      setActiveMenu('home');
    } else if (location.pathname === '/about') {
      setActiveMenu('about');
    } else if (location.pathname === '/how-it-works') {
      setActiveMenu('how-it-works');
    } else if (location.pathname === '/our-courses') {
      setActiveMenu('our-courses');
    } else if (location.pathname === '/contact') {
      setActiveMenu('contact');
    }
  }, [location]); // Watch for changes in location

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: hamburgerMenuData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const menuItems = [
    { name: 'Home', path: '/' }, // Scroll to home section
    { name: 'About', path: 'about' }, // Scroll to about section
    { name: 'How It Works', path: 'how-it-works' }, // Scroll to how-it-works section
    { name: 'Our Courses', path: 'our-courses' }, // Scroll to our-courses section
    { name: 'Contact Us', path: '/contact' }, // External page (full page)
  ];

  // Handle login button click
  const handleLoginClick = () => {
    setTimeout(() => {
      window.location.href = '/login';
    },); // Simulate a delay of 2 seconds for the loader
  };

  return (
    <Navbar expand="lg" fixed="top" className={`navbar ${scroll ? 'navbar-scrolled' : ''}`}>
      <Container fluid>
        <Navbar.Brand href="#home" className="brand">
          <img src="/logo192.png" alt="Logo" width="auto" height={50} style={{ backgroundColor: 'white' }} />
        </Navbar.Brand>

        <div className="d-flex d-lg-none ml-auto align-items-center">
          {/* Login Button */}
          <button onClick={handleLoginClick} className="button">
            Login
          </button>

          {/* Toggle Button */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-auto"
          >
            {!isMenuOpen ? (
              <div className={`lottie-container ${scroll ? 'lottie-white' : 'lottie-black'}`}>
                <Lottie options={defaultOptions} height={30} width={30} />
              </div>
            ) : (
              <span className="close-icon">&times;</span>
            )}
          </Navbar.Toggle>
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="ms-auto">
          <Nav className="ms-auto">
            {menuItems.map((item, index) => (
              item.path.startsWith('/') ? (
                <Nav.Link key={index} as={Link} to={item.path}
                  className={`nav-link ${activeMenu === item.path ? 'active' : ''}`}
                  onClick={() => setActiveMenu(item.path)} // Set active on click
                >
                  {item.name}
                </Nav.Link>
              ) : (
                <ScrollLink key={index} to={item.path} smooth={true} duration={500} spy={true} offset={-70}
                  className={`nav-link ${activeMenu === item.path ? 'active' : ''}`}
                  onSetActive={() => setActiveMenu(item.path)} // Update active state when section comes into view
                >
                  {item.name}
                </ScrollLink>
              )
            ))}
          </Nav>
          <Nav.Item className="d-none d-lg-block">
            <button onClick={handleLoginClick} className="button">
              Login
            </button>
          </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
