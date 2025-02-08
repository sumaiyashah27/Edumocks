import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/LoginPage.css'; // Import custom CSS

const LoginPage = () => {
  return (
    <Container fluid className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="login-card shadow-lg border-0 rounded">
            <Card.Body>
              <h2 className="text-center mb-4 text-white">Welcome to Edumocks</h2>
              <p className="text-center text-white mb-4">Select your role to continue</p>
              <div className="d-flex justify-content-between">
                <Button as={Link} to="/studLogin" variant="light" className="w-48 login-button">
                  Student
                </Button>
                <Button as={Link} to="/teachLogin" variant="light" className="w-48 login-button">
                  Teacher
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
