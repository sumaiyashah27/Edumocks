// src/components/studdash/DelayTestPayment.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import { FaBook, FaCalendarAlt, FaClock, FaCreditCard, FaLeaf, FaShieldAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./css/DelayTestPayment.css";

const stripePromise = loadStripe(
  "pk_live_51RMu2NJPPiGk7fZMSIPMB0WZoMDtxGxGpwNi5lJn0QUwLzx6Yd0Umm5gwmCcuKSpQc5NpebxElr2iQA2b41qmC8X00gDyY5Son"
);

const DelayTestPaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // Pull values from location.state safely
  const {
    studentId,
    selectedCourse,
    selectedSubject,
    delayAmount = 0,
    testDate,
    testTime,
  } = location.state || {};

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [testDateState, setTestDate] = useState(testDate || "");
  const [testTimeState, setTestTime] = useState(testTime || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currency] = useState("USD");

  // Fetch minimal data we need
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        if (!studentId) {
          toast.error("Missing studentId.");
          return;
        }
        await axios.get(`/api/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const [courseResponse, subjectResponse] = await Promise.all([
          axios.get("/api/course", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/subject", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCourses(Array.isArray(courseResponse.data) ? courseResponse.data : []);
        setSubjects(Array.isArray(subjectResponse.data) ? subjectResponse.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  // Load Razorpay script once
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.Razorpay === "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay script loaded successfully!");
      script.onerror = (error) => console.error("Error loading Razorpay script", error);
      document.body.appendChild(script);
    }
  }, []);

  const getCourseName = (courseId) =>
    courses.find((c) => c._id === courseId)?.name || "Unknown Course";

  const getSubjectName = (subjectId) =>
    subjects.find((s) => s._id === subjectId)?.name || "Unknown Subject";

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    if (!testDateState || !testTimeState) {
      toast.warn("Please select the new test date and time.");
      return;
    }
    setIsProcessing(true);
    try {
      const amountCents = Math.round(Number(delayAmount || 0) * 100);
      const { data } = await axios.post("/api/payment/create-payment-intent", { amount: amountCents });
      const { clientSecret } = data || {};

      if (!clientSecret) {
        throw new Error("Unable to initiate payment. Missing client secret.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setPaymentStatus("failed");
        toast.error(result.error.message || "Payment failed.");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await axios.post("/api/delayTest", {
          studentId,
          selectedCourse,
          selectedSubject,
          testDate: testDateState,
          testTime: testTimeState,
          amount: delayAmount,
          paymentId: result.paymentIntent.id,
          orderId: result.paymentIntent.id,
        });

        await axios.put("/api/scheduleTest", {
          studentId,
          selectedCourse,
          selectedSubject,
          testDate: testDateState,
          testTime: testTimeState,
        });

        setPaymentStatus("success");
        toast.success("Payment successful! Test rescheduled.");
        navigate("/studpanel/dashboard", { state: { studentId } });
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus("failed");
      toast.error("Payment failed: " + (error?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const usdToInrRate = 85.54;
    if (fromCurrency === "USD" && toCurrency === "INR") return amount * usdToInrRate;
    return amount;
  };

  const handleRazorpayPayment = async () => {
    if (!testDateState || !testTimeState) {
      toast.warn("Please select the new test date and time.");
      return;
    }
    setIsProcessing(true);
    try {
      const paymentAmount = currency === "USD" ? convertCurrency(delayAmount, "USD", "INR") : delayAmount;
      const finalAmountPaise = Math.round(Number(paymentAmount || 0) * 100);

      const { data } = await axios.post("/api/payment/create-razorpay-order", {
        amount: finalAmountPaise,
        currency: "INR",
      });

      const order = data?.order;
      if (!order?.id) {
        throw new Error("Failed to create Razorpay order.");
      }

      const options = {
        key: "rzp_live_RKbSpQQ1FsT9uC",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Edumocks Test Reschedule",
        description: "Reschedule Test Payment",
        handler: async (response) => {
          try {
            await axios.post("/api/delayTest", {
              studentId,
              selectedCourse,
              selectedSubject,
              testDate: testDateState,
              testTime: testTimeState,
              amount: delayAmount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });

            await axios.put("/api/scheduleTest", {
              studentId,
              selectedCourse,
              selectedSubject,
              testDate: testDateState,
              testTime: testTimeState,
            });

            toast.success("Payment successful!");
            navigate("/studpanel/dashboard", { state: { studentId } });
          } catch (err) {
            console.error(err);
            toast.error("Failed to update schedule after payment.");
          }
        },
        prefill: { name: "Student", email: "student@example.com" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Razorpay payment failed: " + (error?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Left: Reschedule Details */}
        <div className="order-summary">
          <h3>Test Reschedule Details</h3>
          <div className="summary-card details-list">
            <div className="detail-item">
              <FaBook className="detail-icon" />
              <div>
                <span>Course</span>
                <strong>{getCourseName(selectedCourse)}</strong>
              </div>
            </div>
            <div className="detail-item">
              <FaBook className="detail-icon" />
              <div>
                <span>Subject</span>
                <strong>{getSubjectName(selectedSubject)}</strong>
              </div>
            </div>
          </div>

          <div className="summary-card price-details">
            <div className="price-line total">
              <span>Reschedule Fee</span>
              <span>${Number(delayAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment & New Schedule */}
        <div className="payment-details">
          <h3>
            <FaShieldAlt /> Secure Payment & Scheduling
          </h3>

          <div className="form-section">
            <label>Select New Test Date & Time</label>
            <div className="date-time-group">
              <div className="input-with-icon">
                <FaCalendarAlt />
                <input
                  type="date"
                  value={testDateState}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
                />
              </div>
              <div className="input-with-icon">
                <FaClock />
                <input
                  type="time"
                  value={testTimeState}
                  onChange={(e) => setTestTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="payment-methods">
            {/* Stripe */}
            <div className="stripe-section">
              <h5>
                <FaCreditCard /> International Credit/Debit Card
              </h5>
              <CardElement className="card-element" />
              <button
                onClick={handlePayment}
                disabled={isProcessing || !testDateState || !testTimeState}
                className="btn-pay btn-stripe"
              >
                {isProcessing ? "Processing..." : `Pay $${Number(delayAmount || 0).toFixed(2)}`}
              </button>
            </div>

            <div className="separator">OR</div>

            {/* Razorpay */}
            <div className="razorpay-section">
              <h5>
                <FaLeaf /> UPI, Wallet, Netbanking (for India)
              </h5>
              <button
                onClick={handleRazorpayPayment}
                disabled={isProcessing || !testDateState || !testTimeState}
                className="btn-pay btn-razorpay"
              >
                Proceed with Razorpay
              </button>
            </div>
          </div>

          {paymentStatus && (
            <div className={`payment-status ${paymentStatus}`}>
              {paymentStatus === "success"
                ? "Payment Successful! Redirecting..."
                : "Payment Failed. Please try again."}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

const DelayTestPayment = () => (
  <Elements stripe={stripePromise}>
    <DelayTestPaymentComponent />
  </Elements>
);

export default DelayTestPayment;
