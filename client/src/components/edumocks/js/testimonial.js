import React from "react";
import { Carousel } from "react-bootstrap";
import "../css/testimonial.css"; // Custom CSS for styling

const testimonials = [
  { name: "Amit Desai", opinion: "Edumocks helped me prepare effectively for CFA. The mock tests are spot on!" },
  { name: "Sophia Williams", opinion: "A fantastic platform! The study materials are very well-organized." },
  { name: "Rajiv Kumar", opinion: "I scored exceptionally well in CFA thanks to Edumocks. Highly recommended!" },
  { name: "Olivia Brown", opinion: "Great for practice exams. The user interface is intuitive and easy to use." },
  { name: "Ananya Sharma", opinion: "Edumocks has everything a CFA aspirant needs. Simply amazing!" },
  { name: "Liam Johnson", opinion: "The mock exams simulate real scenarios perfectly. Brilliant resource!" },
  { name: "Priya Patel", opinion: "It's my go-to platform for CFA preparation. Fantastic experience!" },
  { name: "Ethan Wilson", opinion: "Edumocks has set a benchmark for preparation platforms. Love it!" },
  { name: "Neha Mehta", opinion: "Absolutely love the question bank and analytics. Made studying so much easier!" },
  { name: "Mia Martinez", opinion: "The detailed explanations for each question are extremely helpful." },
  { name: "Arjun Verma", opinion: "I recommend Edumocks to all my peers. The mock tests are a game-changer!" },
  { name: "Isabella Davis", opinion: "One of the best tools for CFA preparation I’ve come across." },
];

const TestimonialsCarousel = () => {
  const chunkTestimonials = (data, chunkSize) => {
    const result = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  const testimonialChunks = chunkTestimonials(testimonials, 3);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container text-center">
        <h2 className="testimonials-title">What Our Students Say</h2>
        <Carousel
          interval={4000}
          pause="hover"
          className="testimonial-carousel"
          indicators={false}
          nextIcon={<span className="carousel-button carousel-button-right">›</span>}
          prevIcon={<span className="carousel-button carousel-button-left">‹</span>}
        >
          {testimonialChunks.map((chunk, index) => (
            <Carousel.Item key={index}>
              <div className="testimonial-row d-flex justify-content-center">
                {chunk.map((testimonial, idx) => (
                  <div key={idx} className="testimonial-card">
                    <span className="quote-icon">“</span>
                    <p className="testimonial-opinion">{testimonial.opinion}</p>
                    <h5 className="testimonial-name">{testimonial.name}</h5>
                    <p className="testimonial-role">CFA Aspirant</p>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
