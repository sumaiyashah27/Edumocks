import React, { useState } from "react";
import '../css/video.css'; // Ensure your CSS is properly linked
import { FaPlay } from 'react-icons/fa';  // Import the FaPlay icon from react-icons

const VideoPlayer = ({ videoId }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleVideoPlay = () => {
    setIsVideoPlaying(true); // Video starts playing
  };

  return (
    <div className="content-container">
      <div className={`video-device-frame ${isVideoPlaying ? 'playing' : ''}`}>
        <iframe
          title="YouTube Video"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isVideoPlaying ? 1 : 0}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        {!isVideoPlaying && (
          <button className="play-button" onClick={toggleVideoPlay}>
               <FaPlay size={40} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
