import React from 'react';
import { Container, Row, Col, Nav, Navbar, NavItem } from 'react-bootstrap';
import '../css/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <Container fluid className="privacy-policy-container">
      <Row>
        <Col md={3} className="toc-container">
          <Navbar className="toc-navbar">
            <Nav className="flex-column">
            <h5 style={{color: '#c80d18'}}>Table of Content</h5>
              <NavItem>
                <Nav.Link href="#introduction">Introduction</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#information-collection">Information We Collect</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#how-we-use">How We Use Your Information</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#data-protection">Data Protection</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#sharing-information">Sharing of Information</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#your-rights">Your Rights</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#policy-changes">Changes to This Privacy Policy</Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link href="#contact-us">Contact Us</Nav.Link>
              </NavItem>
            </Nav>
          </Navbar>
        </Col>

        <Col md={9}>
          {/* Title Above the Content */}
          <div className="privacy-policy-title" style={{ padding: '5px 10px'}}>
            <h1 style={{color: '#100b5c'}}>Privacy Policy</h1>
          </div>

          <div className="privacy-policy-content">
            <section id="introduction" className="section">
              <h2>Introduction</h2>
              <p>
                At Edumocks, we value the privacy of our users. This Privacy Policy outlines the types of information
                we collect and how it is used. By using our platform, you agree to the collection and use of information
                in accordance with this policy.
              </p>
            </section>

            <section id="information-collection" className="section">
              <h2>Information We Collect</h2>
              <ul>
                <li><strong>Personal Information:</strong> When you sign up, we may collect personal information such as your name, email address, and other relevant details.</li>
                <li><strong>Usage Data:</strong> We collect information on how you interact with Edumocks, including device information, browsing behavior, and session data.</li>
                <li><strong>Cookies:</strong> We use cookies to improve user experience and to track usage patterns on the platform.</li>
              </ul>
            </section>

            <section id="how-we-use" className="section">
              <h2>How We Use Your Information</h2>
              <p>
                The information we collect is used for various purposes, including:
              </p>
              <ul>
                <li>Providing and maintaining the service</li>
                <li>Improving the functionality and user experience</li>
                <li>Sending updates and important notices</li>
                <li>Personalizing your experience</li>
              </ul>
            </section>

            <section id="data-protection" className="section">
              <h2>Data Protection</h2>
              <p>
                We take reasonable steps to protect your personal information from unauthorized access, alteration, disclosure,
                or destruction. However, please note that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section id="sharing-information" className="section">
              <h2>Sharing of Information</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your information with trusted partners
                to help improve our services, but only under strict confidentiality agreements.
              </p>
            </section>

            <section id="your-rights" className="section">
              <h2>Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access and update your personal data</li>
                <li>Request the deletion of your personal data</li>
                <li>Withdraw consent to data collection at any time</li>
              </ul>
            </section>

            <section id="policy-changes" className="section">
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section id="contact-us" className="section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or the way we handle your information, feel free to reach out to us at <a href="mailto:contact@edumocks.com">contact@edumocks.com</a>.
              </p>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;
