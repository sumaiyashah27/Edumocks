import React from 'react';
import { Accordion } from 'react-bootstrap'; // Correct import
import '../css/Faq.css'; // Custom CSS for styling
import image from '../assets/faq-pic.png'; // Image for FAQ section

const Questions = () => {
  const faqData = [
    { 
      question: "Does EduMocks charge a fee for booking mock tests?", 
      answer: "Yes, we charge a fee based on the course selected." 
    },
    { 
      question: "How do I access the mock exams on EduMocks?", 
      answer: "First, select the course you wish to take. Afterward, pay the specified amount and book your test to begin." 
    },
    { 
      question: "Are the mock exams on EduMocks updated according to the latest CFA curriculum?", 
      answer: "Yes, the mock exams are updated regularly to align with the latest CFA curriculum." 
    },
    { 
      question: "Can I track my progress and performance on EduMocks?", 
      answer: "Yes, after taking the test, you can track your progress and performance in your student panel." 
    },
    { 
      question: "Do you provide explanations and solutions for the mock exam questions?", 
      answer: "Yes, we provide detailed solutions and explanations via email after you complete the test." 
    },
    { 
      question: "Is there any limit to the number of mock tests I can take on EduMocks?", 
      answer: "No, there is no limit. You can take as many tests as you wish by rescheduling and paying the required amount for rescheduling." 
    },
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <div className="row">
          {/* Image Column (Hidden on Small Screens) */}
          <div className="col-md-6 d-none d-md-block faq-image">
            <img src={image} alt="FAQ" className="img-fluid" />
          </div>

          {/* FAQ Accordion Column */}
          <div className="col-12 col-md-6">
            <h2 className="mb-4" style={{color: '#100b5c'}}>Frequently Asked Questions</h2>
            <Accordion>
              {faqData.map((faq, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header >{faq.question}</Accordion.Header>
                  <Accordion.Body>{faq.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Questions;
