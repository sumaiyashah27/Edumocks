import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // For responsive layout
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className="terms-page" style={{marginTop: '100px'}}>
      <Container>
        <Row className="header-row">
          <Col>
            <h1 className="page-title">Terms and Conditions</h1>
            <p className="page-subtitle">
              Please read these Terms and Conditions carefully before using our services. By using our platform, you agree to abide by the following terms.
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <p>
              Welcome to <strong>Edumocks</strong>. These Terms and Conditions govern your access to and use of the Edumocks website, including all its features, services, and content. By accessing or using the platform, you agree to comply with these terms. If you do not agree with these terms, you must not use our services.
            </p>
            <p>
              Edumocks offers a platform for CFA Level 1 and Level 2 mock test preparations. All content, tests, and resources are designed to enhance your readiness for the actual CFA exams. Our platform is accessible online and provides various test types and study resources to support your exam preparation.
            </p>

            <p>
              As a user, you are responsible for providing accurate and complete registration information to ensure seamless access to the platform. You are also responsible for safeguarding your account credentials, including username and password, and for all activities that occur under your account. You must engage in lawful activities and avoid fraudulent, abusive, or harmful behavior while using our services. Additionally, you must not upload, share, or distribute content that violates intellectual property rights or is unlawful. You must comply with all applicable laws while using the platform.
            </p>

            <p>
              We take your privacy seriously and are committed to protecting your personal information. Edumocks only collects data that is necessary to provide you with the best possible user experience. The types of data we collect include personal information for account creation and communication purposes, usage data to analyze and improve website performance, and cookies for personalizing your experience. Your data will not be shared with third parties except as stated in our <Link to="/privacy-policy">Privacy Policy</Link>. We encourage you to review our full privacy practices.
            </p>

            <p>
              Edumocks offers both free and premium subscription plans. For premium access, payments are processed securely through trusted third-party payment gateways. Subscription fees are billed on a monthly or annual basis, depending on your selected plan. All payments made for premium services are final and non-refundable. Edumocks reserves the right to modify subscription fees at any time, and any changes will be communicated to you before the next billing cycle. Access to premium services will only be granted upon successful payment. If you have any questions regarding payment or billing, feel free to contact our support team.
            </p>

            <p>
              We reserve the right to suspend or terminate your account if we detect any violation of these Terms and Conditions. Violations may include engaging in fraudulent or harmful activities, misuse of our platform or any of its services, and infringing intellectual property rights. If your account is terminated, access to all services will be revoked, and any fees paid are non-refundable. If you wish to dispute any suspension or termination, please contact our support team.
            </p>

            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of India. Any legal action or proceeding arising from your use of the services shall be subject to the exclusive jurisdiction of the courts located in mumbai, India.
            </p>

            <p>
              Edumocks reserves the right to update or modify these Terms and Conditions at any time. Any changes will be reflected here, with the revised date of the update displayed. We recommend that you review these terms periodically to stay informed of any updates.
            </p>

            <p>
              If you have any questions or concerns regarding these Terms and Conditions, please feel free to reach out to us via email at <strong>support@edumocks.com</strong>.
            </p>
          </Col>
        </Row>

        {/* Footer Section */}
        <Row className="footer-row">
          <Col className="text-center">
            <p>
              By using Edumocks, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsConditions;
