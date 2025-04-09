// DeleteConfirmationModal.tsx
import { useState } from 'react';
import { Modal, Button, Form, InputGroup  } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const DeleteConfirmationModal = ({ show, onClose, onConfirm, studentId }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/student/${studentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        onConfirm(); // e.g., fetchStudents()
        onClose();
        setPassword('');
        setError('');
      } else {
        setError(data.message || 'Incorrect password');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };


  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="password">
          <Form.Label>Enter password to confirm deletion</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>
        {error && <p className="text-danger mt-2">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
