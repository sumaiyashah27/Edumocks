import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="refund-policy-page" style={{marginTop: '90px'}}>
      <Container>
        {/* Header Section */}
        <Row className="header-row mb-4">
          <Col>
            <h1 className="page-title">Refund Policy</h1>
          </Col>
        </Row>

        {/* Refund Policy Content */}
        <Row>
          <Col md={12}>
            <p>
              At Edumocks, we are committed to providing excellent services. However, due to the nature of digital products and services, we have a specific refund policy.
            </p>
            <p>
              Refund requests will be considered only under the following conditions: If the test has been purchased but not yet accessed, if technical issues prevent access, and our support team cannot resolve them, or if there have been incorrect charges or duplicate payments.
            </p>

            <p>
              To request a refund, please send an email to <strong>support@edumocks.com</strong> within 7 days of purchase. Provide your order details, including the purchased test and a brief explanation of the issue. Our support team will review your request and respond within 5 business days.
            </p>

            <p>
              Refunds will not be issued under the following circumstances: If you have accessed and used the test content, if more than 7 days have passed since your purchase, if you change your mind or no longer wish to take the test, or if you fail to complete the test within the allocated time frame.
            </p>

            <p>
              Once a refund is approved, please allow 5-7 business days for processing. Refunds will be issued to the original payment method. Depending on your bank or payment provider, it may take additional time for the funds to appear in your account.
            </p>

            <p>
              If you have any questions or concerns regarding our refund policy, please contact us at <strong>support@edumocks.com</strong> or call us at <strong>+91 7057621416</strong>.
            </p>
          </Col>
        </Row>

        {/* Footer Section */}
        <Row className="footer-row mt-5">
          <Col className="text-center">
            <p>
              By using Edumocks, you acknowledge that you have read, understood, and agree to our Refund Policy.
            </p>
            <Link to="/terms-conditions">
              <button className="btn btn-link">View Terms and Conditions</button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RefundPolicy;
