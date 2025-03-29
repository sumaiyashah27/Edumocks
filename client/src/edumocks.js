import React from 'react';
import './App.css';
import Navbar from './components/edumocks/js/navbar';
import Footer from './components/edumocks/js/footer';
import Home from './components/edumocks/js/home'; 
import About from './components/edumocks/js/about';
import WhyChooseUs from './components/edumocks/js/whychoose';
import Step from './components/edumocks/js/step';
import Features from './components/edumocks/js/features';
import Course from './components/edumocks/js/course';
import Video from './components/edumocks/js/video';
import Data from './components/edumocks/js/data';
import Testimonial from './components/edumocks/js/testimonial';
import Faq from './components/edumocks/js/questions';
import Enquiryform from './components/edumocks/js/form';
import './components/edumocks/css/navbar.css';
import './components/edumocks/css/footer.css';

function edumocks({ pageContent }) {
  return (
    <div >
      <Navbar />
        <div className="App-main">
        {pageContent || (
          <>
            <Home />
            <Course />
            <About />
            <WhyChooseUs />
            <Step />
            <Features />
            <Video videoId="DzvrSz7CFz0" />
            <Data />
            <Testimonial />
            <Faq />
            <Enquiryform />
          </>
        )}
        </div>
      <Footer />
  </div>
  );
}

export default edumocks;

