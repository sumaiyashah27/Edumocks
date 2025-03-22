import React, { useState } from 'react';
import '../css/form.css'; // Custom CSS file for styling
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    reason: '',
  });

  const [validFields, setValidFields] = useState({
    name: false,
    email: false,
    course: false,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const lowercaseEmail = value.toLowerCase();
      setFormData((prevData) => ({ ...prevData, email: lowercaseEmail }));
      setValidFields((prevValid) => ({
        ...prevValid,
        email: validateEmail(lowercaseEmail),
      }));
    } else if (name === 'name') {
      setFormData((prevData) => ({ ...prevData, name: value }));
      setValidFields((prevValid) => ({
        ...prevValid,
        name: validateName(value),
      }));
    } else if (name === 'course') {
      setFormData((prevData) => ({ ...prevData, course: value }));
      setValidFields((prevValid) => ({
        ...prevValid,
        course: value !== '',
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validFields.name && validFields.email && validFields.course) {
      toast.success("Form submitted successfully!");
      setFormData({ name: '', email: '', course: '', reason: '' });
      setValidFields({ name: false, email: false, course: false });
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  return (
    <section
      className="contact-form-section"
      style={{ backgroundColor: '#100b5c', color: '#fff' }}
    >
      <div className="container">
        <div className="row">
          {/* Column 1: Heading */}
          <div className="col-lg-6 col-md-12 d-flex align-items-center justify-content-center heading-column">
            <h2 style={{ color: '#fff', textAlign: 'start' }} className='fw-bold display-2'>
              Get in touch with <span style={{ color: '#ffdc5c'}}>Us</span>
            </h2>
          </div>

          {/* Column 2: Form */}
          <div className="col-lg-6 col-md-12 form-column">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Full Name
                  {validFields.name && <FaCheckCircle className="valid-icon" />}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {!validFields.name && formData.name && (
                  <p className="error-message">Name must not contain numbers.</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Email
                  {validFields.email && <FaCheckCircle className="valid-icon" />}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Preferred Course
                  {validFields.course && (
                    <FaCheckCircle className="valid-icon" />
                  )}
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a course</option>
                  <option value="CFA Level 1">CFA Level 1</option>
                  <option value="CFA Level 2">CFA Level 2</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  name="reason"
                  placeholder="What is your query?"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default ContactForm;
