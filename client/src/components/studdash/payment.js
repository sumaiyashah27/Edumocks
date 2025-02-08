import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_live_51OycdmERHQrnMM9imLJNMrKj0ce8aiM5Id3f3Fysv3blGmFeJukWIZ1yvf3j8VJ0WUCOaMgfyJyXcUkJyjDTesNn00y5Rdqcwh");

const Payment = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId,courseId, selectedSubjects, totalPrice } = location.state || {};
  const [studentData, setstudentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState(""); // Coupon code input ke liye
  const [isCouponApplied, setIsCouponApplied] = useState(false); // Track karega agar coupon apply ho gaya hai

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

  const validateCoupon = () => {
    if (couponCode === "FREE100") { // Yahan aap apne valid coupon codes rakh sakte hain
      setIsCouponApplied(true); // Coupon apply ho gaya
      toast.success("Coupon applied! Payment amount is now $0.");
    } else {
      toast.error("Invalid coupon code. Please try again.");
    }
  };
  const [currency, setCurrency] = useState("USD"); // Default currency is USD
  
  // Handle Stripe payment
  const handleStripePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      if (isCouponApplied) {
         // Log data before sending
        console.log("Sending data to /api/studenroll (Coupon Applied):", {
          studentId: studentData._id,
          selectedCourse: courseId,
          selectedSubject: selectedSubjects.map((subject) => subject._id),
          paymentStatus: "success",
          paymentId: "FREE_COUPON",
          amount: 0,
          orderId: "COUPON_ORDER",
        });
        // Enroll student directly if coupon is applied
        await axios.post("/api/studenroll/enroll", {
          enrollments: [{
            studentId: studentData._id,
            selectedCourse: courseId,
            selectedSubjects: selectedSubjects.map((subject) => subject._id), // Fixed key name
            paymentStatus: "success",
            paymentId: "FREE_COUPON",
            amount:  0 ,
            orderId:"COUPON_ORDER",
          }]
        });
        setPaymentStatus("success");
        toast.success("Enrollment Successful! Coupon Applied.");
        console.log("📤 Sending Email API Request:", {
          studentId,
          selectedCourse: selectedCourse,
          selectedSubject: selectedSubjects,
        });
        // Call email API
        const emailResponse =await axios.post('/api/enrollmail/send-enrollemail', {
          studentId,
          selectedCourse: selectedCourse,
          selectedSubjects: selectedSubjects,
        });
        if (emailResponse.status === 200) {
          console.log("📨 Email sent successfully!");
          toast.success('Confirmation email sent!');
        } else {
          console.error("⚠️ Email API returned a non-success response:", emailResponse.data);
          toast.error('Error sending confirmation email.');
        }
        toast.success('Confirmation email sent to the student!');

        navigate("/studpanel", {
          state: { studentId, firstName: studentData.firstname },
        });
      } else {
        // Proceed with Stripe payment
        const { data } = await axios.post("/api/payment/create-payment-intent", {
          amount: totalPrice * 100,
        });

        const { clientSecret } = data;
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (result.error) {
          console.error(result.error.message);
          setPaymentStatus("failed");
          alert("Payment failed: " + result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            // Log data before sending
            console.log("Sending data to /api/studenroll/ (Stripe Payment):", {
              studentId: studentData._id,
              selectedCourse: courseId,
              selectedSubject: selectedSubjects.map((subject) => subject._id),
              paymentStatus: "success",
              paymentId: result.paymentIntent.id,
              amount: totalPrice,
              orderId: result.paymentIntent.id,
            });
            await axios.post("/api/studenroll/enroll", {
              enrollments: [{
                studentId: studentData._id,
                selectedCourse: courseId,
                selectedSubject: selectedSubjects.map((subject) => subject._id),
                paymentStatus: "success",
                paymentId: result.paymentIntent.id,
                amount: totalPrice,
                orderId: result.paymentIntent.id,
              }]
            });
            
            setPaymentStatus("success");
            toast.success("Payment successful. You are enrolled!");
            console.log("📤 Sending Email API Request:", {
              studentId,
              selectedCourse: selectedCourse,
              selectedSubjects: selectedSubjects,
            });
            // Call email API
            await axios.post('/api/enrollmail/send-enrollemail', {
              studentId,
              selectedCourse: selectedCourse,
              selectedSubject: selectedSubjects,
            });
            toast.success('Confirmation email sent to the student!');
            navigate("/studpanel", {
              state: { studentId, firstName: studentData.firstname },
            });
          }
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentStatus("failed");
      alert("Payment failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay script is not loaded.");
      return;
    }

    if (isCouponApplied) {
      // Enroll student directly if coupon applied
      try {
         // Log data before sending
        console.log("Sending data to /api/studenroll (Coupon Applied):", {
          studentId: studentData._id,
          selectedCourse: courseId,
          selectedSubject: selectedSubjects.map((subject) => subject._id),
          paymentStatus: "success",
          paymentId: "FREE_COUPON",
          amount: 0,
          orderId: "COUPON_ORDER",
        });
        await axios.post("/api/studenroll/enroll", {
          enrollments: [{
            studentId: studentData._id,
            selectedCourse: courseId,
            selectedSubjects: selectedSubjects.map((subject) => subject._id), // ✅ Correct key (selectedSubjects)
            paymentStatus: "success",
            paymentId: "FREE_COUPON",
            amount: 0,
            orderId: "COUPON_ORDER",
          }]
          
        });
        
        setPaymentStatus("success");
        toast.success("Enrollment Successful! Coupon Applied.");
        // Call email API
        await axios.post('/api/enrollmail/send-enrollemail', {
          studentId,
          selectedCourse: selectedCourse,
          selectedSubjects: selectedSubjects,
        });
        toast.success('Confirmation email sent to the student!');
        navigate("/studpanel", {
          state: { studentId, firstName: studentData.firstname },
        });
      } catch (error) {
        console.error("Error saving coupon enrollment to database:", error);
        console.log("Enrollment failed. Please try again.");
      }
      return;
    }

    try {
      const paymentAmount =
        currency === "USD"
          ? convertCurrency(totalPrice, "USD", "INR")
          : totalPrice;

      const options = {
        key: "rzp_live_DwM6A80CoAIf8E", // Razorpay live key
        amount: paymentAmount * 100,
        currency: "INR",
        name: "EduMocks",
        description: "Test Payment",
        handler: async function (response) {
          try {
             // Log data before sending
             await axios.post("/api/studenroll/enroll", {
              enrollments: [{
                studentId: studentData._id,
                selectedCourse: courseId,
                selectedSubjects: selectedSubjects.map((subject) => subject._id), // ✅ Fixed key name
                paymentStatus: "success",
                paymentId: response.razorpay_payment_id,
                amount: totalPrice,
                orderId: response.razorpay_order_id,
              }]
            });
            
            setPaymentStatus("success");
            toast.success("Payment Successful. You are enrolled!");
            // Call email API
            await axios.post('/api/enrollmail/send-enrollemail', {
              studentId,
              selectedCourse: selectedCourse,
              selectedSubjects: selectedSubjects,
           });
            toast.success('Confirmation email sent to the student!');  
            navigate("/studpanel", {
              state: { studentId, firstName: studentData.firstname },
            });
          } catch (error) {
            console.error("Error saving Razorpay payment to database:", error);
            console.log("Enrollment failed. Please try again.");
          }
        },
        prefill: {
          name: studentData?.firstName,
          email: studentData?.email,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      console.log("Error initiating Razorpay payment!");
    }
  }; 
  
  useEffect(() => {
    if (!courseId || !selectedSubjects) {
      alert("Invalid course or subjects data.");
      return;
    }
    axios.get(`/api/course/${courseId}`)
      .then((response) => {
        setSelectedCourse(response.data);
      })
      .catch((error) => console.error("Error fetching course:", error));

    axios.get(`/api/student/${studentId}`)
      .then((response) => {
        setstudentData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        alert("Error fetching student data.");
      });
  }, [courseId, selectedSubjects]);

 
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

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px", backgroundColor: "#f3f4f6", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", fontFamily: "'Roboto', sans-serif", color: "#333" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#333", fontSize: "32px", fontWeight: "600", marginBottom: "30px", letterSpacing: "-0.5px" }}>Course Payment</h2>
        {/* student Details */}
        <div style={{ marginBottom: "30px", fontSize: "16px", color: "#555", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
          {/* <p><strong>student ID:</strong> {studentId}</p> */}
          {studentData ? (
            <>
              <p><strong>Name:</strong> {studentData.firstname} {studentData.lastname}</p>
            </>
          ) : (
            <p>Loading student details...</p>
          )}
        </div>
        {/* Course and Payment Details */}
        <div style={{ backgroundColor: "#eef6ff", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
          {selectedCourse ? (
            <>
              <p><strong>Course Name:</strong> {selectedCourse.name}</p>
              <div style={{ backgroundColor: "#f0fff4", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
                <h3 style={{ color: "#555", fontSize: "22px", fontWeight: "500", marginBottom: "15px" }} >
                  Selected Subjects
                </h3>
                <ul style={{ paddingLeft: "20px", listStyleType: "none", marginBottom: "15px", fontSize: "18px", color: "#333" }}>
                  {selectedSubjects.map((subject) => (
                    <li key={subject._id}>{subject.name} : ${subject.price}</li>
                  ))}
                </ul>
                {/* <p><strong>Total Price:</strong> ${totalPrice}</p> */}
                <p><strong>Total Price:</strong> ${totalPrice}</p>
                {isCouponApplied && (
                  <p style={{ color: "green", fontWeight: "600" }}>
                    Coupon Applied: Total Amount is now $0
                  </p>
                )}
                <p><strong>Final Price:</strong> ${isCouponApplied ? "0.00" : totalPrice}</p>
              </div>
            </>
          ) : (
            <p>Loading course details...</p>
          )}
        </div>
        {/* Payment Details */}
        <div style={{ backgroundColor: "#ffffff", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h3 style={{ color: "#555", fontSize: "22px", fontWeight: "500", marginBottom: "20px" }}>Payment Details</h3>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", color: "#333", fontWeight: "600" }}>Enter Coupon Code:</label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter your coupon code"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={validateCoupon}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Apply Coupon
            </button>
          </div>

          {/* Stripe Payment */}
          <CardElement options={{style: {base: { fontSize: "16px", color: "#333", padding: "12px", borderRadius: "5px", border: "1px solid #ddd", marginBottom: "20px"}}}} />
          <button onClick={handleStripePayment} disabled={isProcessing} style={{ width: "100%", padding: "15px", backgroundColor: isProcessing ? "#cccccc" : "#4CAF50", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", cursor: isProcessing ? "not-allowed" : "pointer", transition: "background-color 0.3s ease", marginTop: "20px", fontWeight: "600" }}>
            {isProcessing ? "Processing..." : "Proceed to Stripe Payment"}
          </button>
          {/* Razorpay Payment */}
          <button onClick={handleRazorpayPayment} style={{ width: "100%", padding: "15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", marginTop: "20px", fontWeight: "600" }}>
          Proceed to Razorpay
          </button>
          {paymentStatus === "success" && (
            <p style={{ color: "#4CAF50", fontSize: "16px", textAlign: "center", marginTop: "20px", fontWeight: "600" }}>
              Payment Successful! Enrollment Complete.
            </p>
          )}
          {paymentStatus === "failed" && (
            <p style={{ color: "#F44336", fontSize: "16px", textAlign: "center", marginTop: "20px", fontWeight: "600" }}>
              Payment Failed. Please try again.
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Payment;