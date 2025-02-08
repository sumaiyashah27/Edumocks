// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js"; // Import Elements
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe
import Edumocks from './edumocks';  // Landing Page Component
import Login from './components/edumocks/js/login'; // Login Page Component
import StudLogin from './components/edumocks/js/studLogin';
import TeachLogin from './components/edumocks/js/teachLogin'; 
import StudSignup from './components/edumocks/js/studSignup'; 
import TeachSignup from './components/edumocks/js/teachSignup';
import TeachPanel from './components/teacherpanel/teachpanel'; // Login Page Component
import StudPanel from './components/studdash/studpanel'; // Login Page Component
import PrivacyPolicy from './components/edumocks/js/PrivacyPolicy';
import TermsConditions from './components/edumocks/js/TermsConditions';
import RefundPolicy from './components/edumocks/js/RefundPolicy';
import Contact from './components/edumocks/js/contact';
import Studforgot from './components/edumocks/js/Studentforgot'; // Corrected the import
import Teachforgot from './components/edumocks/js/Teacherforgot';
import Payment from "./components/studdash/payment";
import Test from "./components/studdash/test";
import DelayTestPayment from './components/studdash/DelayTestPayment'; 

import './App.css';
// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_live_51OycdmERHQrnMM9imLJNMrKj0ce8aiM5Id3f3Fysv3blGmFeJukWIZ1yvf3j8VJ0WUCOaMgfyJyXcUkJyjDTesNn00y5Rdqcwh");

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for landing page */}
        <Route path="/" element={<Edumocks />} />
        
        {/* Route for login page */}
        <Route path="/login" element={<Login />} />
        <Route path="/studLogin" element={<StudLogin />} />
        <Route path="/teachLogin" element={<TeachLogin />} />
        <Route path="/studSignup" element={<StudSignup />} />
        {/* <Route path="/teachSignup" element={<TeachSignup />} /> */}
        <Route path="/studForget" element={<Studforgot />} /> {/* Updated route */}
        <Route path="/teachForget" element={<Teachforgot />} /> {/* Updated route */}
        <Route path="/privacy-policy" element={<Edumocks pageContent={<PrivacyPolicy />} />} />
        <Route path="/terms-conditions" element={<Edumocks pageContent={<TermsConditions />} />} />
        <Route path="/refund-policy" element={<Edumocks pageContent={<RefundPolicy />} />} />
        <Route path="/contact" element={<Edumocks pageContent={<Contact />} />} />
        {/* ------------------------------------------------------ */}
        <Route path="/teachpanel" element={<TeachPanel />} />
        <Route path="/studpanel" element={<StudPanel />} />
        {/* Wrap the Payment route with Elements */}
        <Route path="/payment" element={<Elements stripe={stripePromise}><Payment /></Elements>} />
          <Route path="/test/:course/:subject" element={<Test />} />
          <Route
            path="/delaytestpayment"
            element={
              <Elements stripe={stripePromise}>
                <DelayTestPayment />
              </Elements>
            }
          />
      </Routes>
    </Router>
  );
};

export default App;
