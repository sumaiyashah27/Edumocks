import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaShieldAlt, FaTag, FaCreditCard, FaLeaf } from 'react-icons/fa'; // Added icons
import './css/Payment.css'; // Import the new CSS file

const stripePromise = loadStripe("pk_live_51RMu2NJPPiGk7fZMSIPMB0WZoMDtxGxGpwNi5lJn0QUwLzx6Yd0Umm5gwmCcuKSpQc5NpebxElr2iQA2b41qmC8X00gDyY5Son");

const Payment = () => {
    // --- ALL YOUR EXISTING STATE AND LOGIC REMAINS UNCHANGED ---
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const navigate = useNavigate();
    const { courseId, selectedSubjects, totalPrice } = location.state || {};
    const [studentData, setstudentData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [finalPrice, setFinalPrice] = useState(totalPrice);
    const studentId = localStorage.getItem('_id');

    // --- Dynamically load Razorpay script (UNCHANGED) ---
    useEffect(() => {
        if (typeof window.Razorpay === "undefined") {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => console.log("Razorpay script loaded successfully!");
            script.onerror = (error) => console.error("Error loading Razorpay script", error);
            document.body.appendChild(script);
        }
    }, []);

    // --- validateCoupon function (UNCHANGED) ---
    const validateCoupon = async () => {
        try {
            const { data } = await axios.post("/api/coupon/check", { studentId, couponCode });
            if (!data.valid) {
                toast.error("Coupon already used or invalid.");
                return;
            }
            if (couponCode === "CFA10FREE") {
                setFinalPrice(0);
                toast.success("Coupon applied! Payment amount is now $0.");
            } else if (couponCode === "99%OFF") {
                const discountAmount = totalPrice * 0.99;
                setFinalPrice(Math.max(0, totalPrice - discountAmount));
                toast.success("99% discount applied successfully!");
            }
            setIsCouponApplied(true);
            await axios.post("/api/coupon/save", { studentId, couponCode });
        } catch (error) {
            toast.error("Error validating coupon.");
        }
    };

    // --- handleStripePayment function (UNCHANGED) ---
    const handleStripePayment = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);
        try {
            if (finalPrice === 0) {
                await axios.post("/api/studenroll/enroll", {
                    enrollments: [{ studentId, selectedCourse: courseId, selectedSubjects: selectedSubjects.map((subject) => subject._id), paymentStatus: "success", paymentId: "FREE_COUPON", amount: 0, orderId: "COUPON_ORDER" }]
                });
                setPaymentStatus("success");
                toast.success("Enrollment Successful! Coupon Applied.");
                const emailResponse = await axios.post('/api/enrollmail/send-enrollemail', { studentId, selectedCourse, selectedSubjects });
                if (emailResponse.status === 200) toast.success('Confirmation email sent!');
                else toast.error('Error sending confirmation email.');
                try {
                    await axios.post('/api/payment/send-invoice', { studentId, courseId, subjects: selectedSubjects.map(s => ({ _id: s._id, name: s.name, price: s.price })), currency: 'USD', subtotal: selectedSubjects.reduce((a, s) => a + Number(s.price || 0), 0), discount: selectedSubjects.reduce((a, s) => a + Number(s.price || 0), 0), tax: 0, total: 0, paymentMethod: 'Free Coupon', paymentId: 'FREE_COUPON', orderId: 'COUPON_ORDER' }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                    toast.success('Invoice emailed!');
                } catch (e) {
                    console.error('Invoice email failed:', e);
                    toast.error('Failed to send invoice email.');
                }
                navigate("/studpanel/dashboard", { state: { studentId, firstName: studentData.firstname } });
            } else {
                const { data } = await axios.post("/api/payment/create-payment-intent", { amount: finalPrice * 100 });
                const { clientSecret } = data;
                const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardElement) } });
                if (result.error) {
                    setPaymentStatus("failed");
                    toast.error("Payment failed: " + result.error.message);
                    return;
                }
                if (result.paymentIntent.status === "succeeded") {
                    await axios.post("/api/studenroll/enroll", {
                        enrollments: [{ studentId, selectedCourse: courseId, selectedSubjects: selectedSubjects.map((subject) => subject._id), paymentStatus: "success", paymentId: result.paymentIntent.id, amount: finalPrice, orderId: result.paymentIntent.id }]
                    });
                    setPaymentStatus("success");
                    toast.success("Payment successful. You are enrolled!");
                    await axios.post('/api/enrollmail/send-enrollemail', { studentId, selectedCourse, selectedSubjects });
                    toast.success('Confirmation email sent to the student!');
                    try {
                        await axios.post('/api/payment/send-invoice', { studentId, courseId, subjects: selectedSubjects.map(s => ({ _id: s._id, name: s.name, price: s.price })), currency: 'USD', subtotal: selectedSubjects.reduce((a, s) => a + Number(s.price || 0), 0), discount: (totalPrice - finalPrice) > 0 ? (totalPrice - finalPrice) : 0, tax: 0, total: finalPrice, paymentMethod: 'Stripe', paymentId: result.paymentIntent.id, orderId: result.paymentIntent.id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                        toast.success('Invoice emailed!');
                    } catch (e) {
                        console.error('Invoice email failed:', e);
                        toast.error('Failed to send invoice email.');
                    }
                    navigate("/studpanel/dashboard", { state: { studentId, firstName: studentData.firstname } });
                }
            }
        } catch (error) {
            setPaymentStatus("failed");
            toast.error("Payment failed: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- handleRazorpayPayment function (UNCHANGED) ---
    const handleRazorpayPayment = async () => {
        if (typeof window.Razorpay === "undefined") {
            toast.warning("Razorpay script is not loaded.");
            return;
        }
        if (finalPrice === 0) {
            try {
                await axios.post("/api/studenroll/enroll", {
                    enrollments: [{ studentId: studentData._id, selectedCourse: courseId, selectedSubjects: selectedSubjects.map((subject) => subject._id), paymentStatus: "success", paymentId: "FREE_COUPON", amount: 0, orderId: "COUPON_ORDER" }]
                });
                setPaymentStatus("success");
                toast.success("Enrollment Successful! Coupon Applied.");
                await axios.post('/api/enrollmail/send-enrollemail', { studentId, selectedCourse: selectedCourse, selectedSubjects: selectedSubjects });
                toast.success('Confirmation email sent to the student!');
                try {
                    await axios.post('/api/payment/send-invoice', { studentId, courseId, subjects: selectedSubjects.map(s => ({ _id: s._id, name: s.name, price: s.price })), currency: 'USD', subtotal: selectedSubjects.reduce((a, s) => a + Number(s.price || 0), 0), discount: selectedSubjects.reduce((a, s) => a + Number(s.price || 0), 0), tax: 0, total: 0, paymentMethod: 'Free Coupon', paymentId: 'FREE_COUPON', orderId: 'COUPON_ORDER' }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                    toast.success('Invoice emailed!');
                } catch (e) {
                    console.error('Invoice email failed:', e);
                    toast.error('Failed to send invoice email.');
                }
                navigate("/studpanel/dashboard", { state: { studentId, firstName: studentData.firstname } });
            } catch (error) {
                toast.error("Enrollment failed. Please try again.");
            }
            return;
        }
        try {
            const paymentAmount = currency === "USD" ? convertCurrency(finalPrice, "USD", "INR") : finalPrice;
            const options = {
                key: "rzp_live_JJkQjWOq28xTOp",
                amount: paymentAmount * 100,
                currency: "INR",
                name: "EduMocks",
                description: "Course Enrollment",
                handler: async function (response) {
                    try {
                        await axios.post("/api/studenroll/enroll", {
                            enrollments: [{ studentId: studentData._id, selectedCourse: courseId, selectedSubjects: selectedSubjects.map((subject) => subject._id), paymentStatus: "success", paymentId: response.razorpay_payment_id, amount: finalPrice, orderId: "done with razorpay acc" }]
                        });
                        setPaymentStatus("success");
                        toast.success("Payment Successful. You are enrolled!");
                        await axios.post('/api/enrollmail/send-enrollemail', { studentId, selectedCourse: selectedCourse, selectedSubjects: selectedSubjects });
                        toast.success('Confirmation email sent to the student!');
                        try {
                            await axios.post('/api/payment/send-invoice', { studentId, courseId, subjects: selectedSubjects.map(s => ({ _id: s._id, name: s.name, price: s.price })), currency: 'INR', subtotal: selectedSubjects.reduce((a, s) => a + Number(s.price || 0), 0), discount: (totalPrice - finalPrice) > 0 ? (totalPrice - finalPrice) : 0, tax: 0, total: finalPrice, paymentMethod: 'Razorpay', paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id || 'done with razorpay acc' }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                            toast.success('Invoice emailed!');
                        } catch (e) {
                            console.error('Invoice email failed:', e);
                            toast.error('Failed to send invoice email.');
                        }
                        navigate("/studpanel/dashboard", { state: { studentId, firstName: studentData.firstname } });
                    } catch (error) {
                        toast.error("Enrollment failed. Please try again.");
                    }
                },
                prefill: { name: studentData?.firstName, email: studentData?.email },
                theme: { color: "#528FF0" },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Error initiating Razorpay payment!");
        }
    };

    // --- useEffect and convertCurrency (UNCHANGED) ---
    const [currency, setCurrency] = useState("USD");
    useEffect(() => {
        if (!courseId || !selectedSubjects) {
            toast.warning("Invalid course or subjects data.");
            return;
        }
        const token = localStorage.getItem('token');
        axios.get(`/api/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setSelectedCourse(response.data))
            .catch((error) => console.error("Error fetching course:", error));
        axios.get(`/api/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setstudentData(response.data))
            .catch((error) => {
                console.error("Error fetching student data:", error);
                toast.error("Error fetching student data.");
            });
    }, [courseId, selectedSubjects, studentId]);

    const convertCurrency = (amount, fromCurrency, toCurrency) => {
        const usdToInrRate = 86.65;
        if (fromCurrency === "USD" && toCurrency === "INR") return amount * usdToInrRate;
        return amount;
    };


    // --- THE NEW, MODERN JSX STRUCTURE ---
    return (
        <div className="payment-page">
            <div className="payment-container">
                
                {/* Left Side: Order Summary */}
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    {selectedCourse ? (
                        <>
                            <div className="summary-card course-details">
                                <h4>{selectedCourse.name}</h4>
                                <p>Billed to: <strong>{studentData ? `${studentData.firstname} ${studentData.lastname}` : 'Loading...'}</strong></p>
                            </div>

                            <div className="summary-card topics-list">
                                <h5>Selected Topics</h5>
                                <ul>
                                    {selectedSubjects.map((subject) => (
                                        <li key={subject._id}>
                                            <span>{subject.name}</span>
                                            <span>${subject.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="summary-card price-details">
                                <div className="price-line">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                {isCouponApplied && (
                                    <div className="price-line discount">
                                        <span>Discount <FaTag /></span>
                                        <span>-${(totalPrice - finalPrice).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="price-line total">
                                    <span>Total Amount</span>
                                    <span>${finalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Loading course details...</p>
                    )}
                </div>

                {/* Right Side: Payment Details */}
                <div className="payment-details">
                    <h3><FaShieldAlt /> Secure Payment</h3>
                    
                    <div className="coupon-section">
                        <label htmlFor="coupon">Have a coupon?</label>
                        <div className="coupon-input-group">
                            <input 
                                type="text" 
                                id="coupon"
                                value={couponCode} 
                                onChange={(e) => setCouponCode(e.target.value)} 
                                placeholder="Enter coupon code" 
                                disabled={isCouponApplied}
                            />
                            <button onClick={validateCoupon} disabled={isCouponApplied}>
                                {isCouponApplied ? 'Applied' : 'Apply'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="payment-methods">
                        {/* Stripe Payment Form */}
                        <div className="stripe-section">
                            <h5><FaCreditCard /> International Credit/Debit Card</h5>
                            <CardElement className="card-element" />
                            <button onClick={handleStripePayment} disabled={isProcessing} className="btn-pay btn-stripe">
                                {isProcessing ? "Processing..." : `Pay $${finalPrice.toFixed(2)}`}
                            </button>
                        </div>
                        
                        <div className="separator">OR</div>

                        {/* Razorpay Payment Button */}
                        <div className="razorpay-section">
                             <h5><FaLeaf /> UPI, Wallet, Netbanking (for India)</h5>
                            <button onClick={handleRazorpayPayment} disabled={isProcessing} className="btn-pay btn-razorpay">
                                Proceed with Razorpay
                            </button>
                        </div>
                    </div>

                    {paymentStatus && (
                        <div className={`payment-status ${paymentStatus}`}>
                           {paymentStatus === 'success' ? 'Payment Successful! Redirecting...' : 'Payment Failed. Please try again.'}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
};

// You need to wrap the Payment component with Elements provider in your Routes file or wherever you render it.
// This is just the component itself.
const PaymentPage = () => (
    <Elements stripe={stripePromise}>
        <Payment />
    </Elements>
);

export default PaymentPage;