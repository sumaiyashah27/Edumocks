import React, { useState } from "react";
import { Container, Row, Col, Button, Carousel, Badge, Modal } from "react-bootstrap";

const videos = [
  { id: 1, title: "How to Sign Up on EduMocks", videoUrl: "https://www.youtube.com/embed/DzvrSz7CFz0" },
  { id: 2, title: "How to Book a Mock Test", videoUrl: "https://www.youtube.com/embed/GPO-mUlmREY" },
  { id: 3, title: "How to Find Your Confirmation Email", videoUrl: "https://www.youtube.com/embed/iQ5LU8-Cg28" },
  { id: 4, title: "How to Reschedule Your Mock Test", videoUrl: "https://www.youtube.com/embed/ErFu0TD733g" },
  { id: 5, title: "How to Schedule & Attend Your Mock Test", videoUrl: "https://www.youtube.com/embed/xBYciGU-RBw" },
];


const VideoSection = () => {
  const [isAllVisible, setIsAllVisible] = useState(false); // State to toggle video visibility

  const toggleVideos = () => {
    setIsAllVisible(!isAllVisible);
  };

  return (
    <Container className="mt-4" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "3px" }}>
      {/* Video Section */}
      <h2 className="text-start fs-5" style={{ backgroundColor: "#100b5c", color: "#fff", padding: "20px" }}>
        VIDEO LIBRARY
      </h2>
      <div className="d-none d-md-block">
        {/* For Larger Screens */}
        <Row>
          {videos
            .slice(0, isAllVisible ? videos.length : 6)
            .map((video, index) => (
              <Col md={4} className="mb-4" key={video.id}>
                <div className="card h-100 shadow-md position-relative" style={{ border: "none" }}>
                  {index < 2 && (
                    <Badge
                      bg="danger"
                      className="position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        fontSize: "0.8rem",
                      }}
                    >
                      Latest
                    </Badge>
                  )}
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      width: "100%",
                      height: "200px",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                    }}
                  ></iframe>
                  <div className="card-body">
                    <h6 className="card-title">{video.title}</h6>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
        <div className="text-center">
          <Button style={{backgroundColor:'rgb(16, 11, 92)', border: 'none'}} variant="primary" onClick={toggleVideos}>
            {isAllVisible ? "Show Less" : "Load More"}
          </Button>
        </div>
      </div>
      <div className="d-block d-md-none">
        {/* For Smaller Screens */}
        <Carousel>
          {videos.map((video, index) => (
            <Carousel.Item key={video.id}>
              <iframe
                src={video.videoUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "200px",
                }}
              ></iframe>
              <Carousel.Caption>
                <h6 className="text-light bg-dark p-2">{video.title}</h6>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Container>
  );
};

export default VideoSection;
