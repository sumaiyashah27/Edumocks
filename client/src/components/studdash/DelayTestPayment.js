import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";

// Load Stripe with your public key
const stripePromise = loadStripe("pk_live_51OycdmERHQrnMM9imLJNMrKj0ce8aiM5Id3f3Fysv3blGmFeJukWIZ1yvf3j8VJ0WUCOaMgfyJyXcUkJyjDTesNn00y5Rdqcwh");
const DelayTestPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId, selectedCourse, selectedSubject, delayAmount, testDate, testTime } = location.state || {};
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [testDateState, setTestDate] = useState(testDate || "");  
  const [testTimeState, setTestTime] = useState(testTime || "");  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const [currency, setCurrency] = useState("USD"); 

  // Fetch student, course, and subject data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`/api/student/${studentId}`);
        const courseResponse = await axios.get('/api/course');
        const subjectResponse = await axios.get('/api/subject');
        setCourses(courseResponse.data);
        setSubjects(subjectResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false); // Hide loading spinner after data is fetched
      }
    };
    fetchData();
  }, [studentId, selectedCourse, selectedSubject]);
  // Dynamically load Razorpay script
    useEffect(() => {
      if (typeof window.Razorpay === "undefined") {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          console.log("Razorpay script loaded successfully!");
        };
        script.onerror = (error) => {
          console.error("Error loading Razorpay script", error);
        };document.body.appendChild(script);
      }
    }, []);

  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s._id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  // const handlePayment = async (event) => {
  //   event.preventDefault();
  //   setIsProcessing(true);  // Disable the button to prevent multiple clicks
    
  //   try {
  //     // Simulate a successful payment response (for testing)
  //     const fakePaymentResponse = { paymentIntent: { status: "succeeded" }, paymentId: "fakePaymentId", orderId: "fakeOrderId" };
  
  //     // Send data to the backend as if the payment was successful
  //     await axios.post("/api/delayTest", { 
  //       studentId, 
  //       selectedCourse, 
  //       selectedSubject, 
  //       testDate: testDateState, 
  //       testTime: testTimeState, 
  //       amount: delayAmount, 
  //       paymentId: fakePaymentResponse.paymentId, 
  //       orderId: fakePaymentResponse.orderId 
  //     });
  
  //     // Call the API to update the test schedule
  //     await axios.put("/api/scheduleTest", { studentId, selectedCourse, selectedSubject, testDate: testDateState, testTime: testTimeState });
  
  //     setPaymentStatus("success");  // Show success message
  //     alert("Data saved successfully (payment skipped for testing).");
  
  //     navigate("/studpanel", { state: { studentId } });  // Redirect to student panel
  //   } catch (error) {
  //     console.error("Error during testing:", error);
  //     setPaymentStatus("failed");
  //     alert("Error saving data during test: " + error.message);
  //   } finally {
  //     setIsProcessing(false);  // Re-enable button
  //   }
  // };
  

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    try {
      const { data } = await axios.post("/api/payment/create-payment-intent", {
        amount: delayAmount * 100, // Convert to cents
      });
      const { clientSecret, paymentId, orderId } = data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      if (result.error) {
        console.error(result.error.message);
        setPaymentStatus("failed");
        toast.error(result.error.message || "Payment failed. Please try again.");
      } else if (result.paymentIntent.status === "succeeded") {
        await axios.post("/api/delayTest", { studentId, selectedCourse, selectedSubject, testDate: testDateState, testTime: testTimeState, amount: delayAmount, paymentId: paymentId, orderId: orderId });
        await axios.put("/api/scheduleTest", { studentId, selectedCourse, selectedSubject, testDate: testDateState, testTime: testTimeState });

        setPaymentStatus("success");
        toast.success("Payment successful! Test date and time updated.");
        navigate("/studpanel", { state: { studentId } });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setPaymentStatus("failed");
      toast.error("Payment failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const usdToInrRate = 85.54; // Example conversion rate (USD to INR)
    const inrToUsdRate = 1 / usdToInrRate; // Reverse conversion rate
  
    if (fromCurrency === "USD" && toCurrency === "INR") {
      return amount * usdToInrRate; // Convert USD to INR
    } else if (fromCurrency === "INR" && toCurrency === "USD") {
      return amount * inrToUsdRate; // Convert INR to USD
    } else {
      return amount;
    }
  };
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
  
    try {
      const paymentAmount =
        currency === "USD"
          ? convertCurrency(delayAmount, "USD", "INR") // Convert if currency is USD
          : delayAmount;
  
      const finalAmount = Math.round(paymentAmount * 100); // Convert to paise (integer)
  
      // Create Razorpay order with INR amount
      const { data } = await axios.post("/api/payment/create-razorpay-order", {
        amount: finalAmount, // Send integer value in paise
      });
  
      const options = {
        key: "rzp_live_DwM6A80CoAIf8E",
        amount: data.order.amount, // Ensure INR is always used
        currency: "INR",
        order_id: data.order.id,
        name: "Edumocks Test Reschedule",
        description: "Reschedule Test Payment",
        handler: async (response) => {
          await axios.post("/api/delayTest", {
            studentId,
            selectedCourse,
            selectedSubject,
            testDate: testDateState,
            testTime: testTimeState,
            amount: paymentAmount, // Save actual amount
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
          navigate("/studpanel", { state: { studentId } });
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Razorpay payment failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // const handleRazorpayPayment = async () => {
  //   setIsProcessing(true);
  
  //   try {
  //     // Simulated payment response for testing
  //     const fakePaymentResponse = {
  //       razorpay_payment_id: "fake_payment_12345",
  //       razorpay_order_id: "fake_order_67890",
  //       status: "succeeded"
  //     };
  
  //     // Simulate backend call as if payment was successful
  //     await axios.post("/api/delayTest", {
  //       studentId,
  //       selectedCourse,
  //       selectedSubject,
  //       testDate: testDateState,
  //       testTime: testTimeState,
  //       amount: delayAmount,
  //       paymentId: fakePaymentResponse.razorpay_payment_id,
  //       orderId: fakePaymentResponse.razorpay_order_id,
  //     });
  
  //     // Call API to update the test schedule
  //     await axios.put("/api/scheduleTest", {
  //       studentId,
  //       selectedCourse,
  //       selectedSubject,
  //       testDate: testDateState,
  //       testTime: testTimeState,
  //     });
  
  //     alert("Payment simulation successful! Data saved.");
  //     navigate("/studpanel", { state: { studentId } }); // Redirect after success
  //   } catch (error) {
  //     console.error("Error during test payment:", error);
  //     alert("Error saving data during test: " + error.message);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  
  
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", backgroundColor: "#f9fafb", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)", fontFamily: "'Poppins', sans-serif", color: "#333" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "10px", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#1a202c", fontSize: "36px", fontWeight: "600", marginBottom: "20px" }}>Reschedule Test Payment</h2>
        {/* Display student information */}
        {!isLoading && (
          <>
            {/* Display course information */}
            <div style={{ marginBottom: "30px", fontSize: "18px", color: "#555", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
              <p><strong>Course:</strong> {getCourseName(selectedCourse)}</p>
            </div>

            {/* Display subject information */}
            <div style={{ marginBottom: "30px", fontSize: "18px", color: "#555", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
              <p><strong>Subject:</strong> {getSubjectName(selectedSubject)}</p>
            </div>

            {/* Display payment amount */}
            <div style={{ marginBottom: "30px", fontSize: "18px", color: "#555", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
              <p><strong>Amount to Pay:</strong> ${delayAmount}</p> {/* Display the payment amount */}
            </div>

            {/* Test Date and Time Form */}
            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="testDate" style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>Test Date:</label>
              <input type="date" id="testDate" value={testDateState} onChange={(e) => setTestDate(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }} required/>
              <label htmlFor="testTime" style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>Test Time:</label>
              <input type="time" id="testTime" value={testTimeState} onChange={(e) => setTestTime(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }} required/>
            </div>

            {/* Stripe Payment Form */}
            <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)" }}>
              <h3 style={{ color: "#555", fontSize: "24px", fontWeight: "500", marginBottom: "25px" }}>Payment Details</h3>
              <CardElement options={{ style: { base: { fontSize: "16px", color: "#333", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "20px" }}}} />

              <button onClick={handlePayment} disabled={isProcessing} style={{width: "100%", padding: "16px", backgroundColor: isProcessing ? "#cccccc" : "#4CAF50", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", cursor: isProcessing ? "not-allowed" : "pointer", transition: "background-color 0.3s ease, transform 0.2s", marginTop: "20px", fontWeight: "600", boxShadow: isProcessing ? "none" : "0 4px 8px rgba(0, 128, 0, 0.3)" }}>
                {isProcessing ? "Processing..." : "International Credit Card"}
              </button>
              <button onClick={handleRazorpayPayment} disabled={isProcessing} style={{ width: "100%", padding: "16px", backgroundColor: "#ff5722", color: "white", border: "none", borderRadius: "8px", fontSize: "18px" }}>
                Upi, Wallet, credit card netbanking
              </button>
              {/* Payment status message */}
              {paymentStatus === "success" && (
                <p style={{ color: "#4CAF50", fontSize: "16px", textAlign: "center", marginTop: "20px", fontWeight: "600" }}>
                  Payment Successful! Test date and time updated.
                </p>
              )}
              {paymentStatus === "failed" && (
                <p style={{ color: "#F44336", fontSize: "16px", textAlign: "center", marginTop: "20px", fontWeight: "600" }}>
                  Payment Failed! Please try again.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
  <Elements stripe={stripePromise}>
    <DelayTestPayment />
  </Elements>

export default DelayTestPayment;
