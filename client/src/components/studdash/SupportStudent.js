import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer

const SupportStudent = () => {

    const [studentDetails, setStudentDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const studentId = localStorage.getItem('_id');

        if (!studentId) {
            console.error('student not logged in');
            return;
        }

        axios.get(`/api/student/${studentId}`)
            .then((response) => {         
                setStudentDetails((prevDetails) => ({
                    ...prevDetails,
                    firstName: response.data.firstname || '',
                    lastName: response.data.lastname || '',
                    email: response.data.email || '',
                }));
            })
            .catch((error) => {
                console.error('Error fetching student data:', error);
            });
    }, []);

    const handleSendMessage = async () => {
        if (!studentDetails.firstName || !studentDetails.lastName || !studentDetails.email || !message) {
            toast.warn('Please fill in all fields before sending.', { position: "top-right" });
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/support/send-support-message', {
                firstName: studentDetails.firstName,
                lastName: studentDetails.lastName,
                email: studentDetails.email,
                message
            });

            toast.success('Message sent successfully!', { position: "top-right" });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message.', { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="profile-container d-flex flex-column justify-content-center">
            <ToastContainer />
            <Row>
                {/* Sidebar Section */}
                <Col md={12} className="profile-details text-start">
                    <h2>Student Support</h2>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6} className="text-start">
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={studentDetails.firstName}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={studentDetails.lastName}

                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Email Field */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={studentDetails.email}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label> Send Message </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Type your message here"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button style={{backgroundColor:'rgb(16, 11, 92)' , border: 'none'}} variant="success" onClick={handleSendMessage} disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span> Sending...
                                    </>
                                ) : (
                                    'Send'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default SupportStudent;