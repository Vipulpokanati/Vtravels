import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import emailjs from "@emailjs/browser";

const COUPONS = {
  SAVE10: { type: "percentage", value: 10 },
  FLAT50: { type: "flat", value: 50 },
  SAVE20: { type: "percentage", value: 20 },
};

const Payment = ({ token, userId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookedSeats, setBookedSeats] = useState([]);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const bus = location.state?.bus;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (!location.state || !location.state.bookedSeats || !bus) {
      alert("No seats or bus selected.");
      navigate("/");
      return;
    }
    
    const seats = location.state.bookedSeats;
    setBookedSeats(seats);

    const price = bus.price;
    setPricePerSeat(price);

    const total = price * seats.length;
    setTotalPrice(total);
    setFinalPrice(total);

    const fetchUser = async () => {
      try {
        const userRes = await axios.get(
          `https://travels-nkfu.onrender.com/api/users/${userId}`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setFormData({
          username: userRes.data.username,
          email: userRes.data.email,
        });
      } catch (err) {
        console.error("Error fetching user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location.state, navigate, bus, token, userId]);

  const applyCoupon = () => {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (!coupon) {
      setCouponError("❌ Invalid coupon code");
      setDiscountAmount(0);
      setFinalPrice(totalPrice);
      return;
    }

    let discount =
      coupon.type === "percentage"
        ? (totalPrice * coupon.value) / 100
        : coupon.value;

    discount = Math.min(discount, totalPrice);
    setDiscountAmount(discount);
    setFinalPrice(totalPrice - discount);
    setCouponError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendConfirmationEmail = async ({
    userName,
    userEmail,
    bus,
    ticketId,
    successfullyBookedSeats,
    totalPrice,
  }) => {
    try {
      const templateParams = {
        logo_url: "https://www.travelease.in/travelease-logo-square.png",
        user_name: userName,
        bus_name: bus.bus_name,
        bus_number: bus.bus_number,
        origin: bus.origin,
        destination: bus.destination,
        ticket_id: ticketId,
        journey_date: new Date().toISOString().split("T")[0],
        journey_time: formatTime(bus.start_time),
        seat_numbers: successfullyBookedSeats.join(", "),
        total_price: totalPrice,
        current_year: new Date().getFullYear(),
        email: userEmail,
      };

      if (!userEmail) {
        alert("⚠️ No email provided. Cannot send confirmation email.");
        return;
      }

      await emailjs.send(
        "service_wjnken8",
        "template_idforue",
        templateParams,
        "MjuqnA9kYySUFbId7"
      );

      alert("✅ Booking Confirmed! Confirmation email sent.");
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert(
        "⚠️ Booking succeeded, but confirmation email could not be sent."
      );
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    if (!bookedSeats.length) {
      alert("No seats selected");
      setProcessing(false);
      return;
    }

    try {
      const seatNumbers = bookedSeats.map((seat) => String(seat.seat_number));

      const response = await axios.post(
        "https://travels-nkfu.onrender.com/api/bookings/",
        {
          bus_id: bus.id,
          seats: seatNumbers,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const data = response.data;
      console.log("✅ Booking Success:", data);
      alert(data.message);

      const ticketId = data.ticket_id;
      const successfullyBookedSeats = data.seats;
      const total_price = data.total_price;

      await sendConfirmationEmail({
        userName: formData.username,
        userEmail: formData.email,
        bus: data,
        ticketId,
        successfullyBookedSeats,
        totalPrice: total_price,
      });

      const latestBooking = {
        ticketId,
        bookedSeats: successfullyBookedSeats,
        bus: data,
        finalPrice: total_price,
        journeyDate: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem("latestBooking", JSON.stringify(latestBooking));

      navigate("/bookings");
      setBookedSeats([]);
    } catch (err) {
      console.error("❌ Booking failed:", err.response?.data || err.message);
      alert("⚠️ Booking failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      {processing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we confirm your booking...</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors mb-4 group"
            disabled={processing}
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Selection
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Complete Payment
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Review your booking details and complete the payment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Details */}
          <div className="space-y-6">
            {/* Journey Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{bus.bus_name}</h3>
                  <p className="text-gray-500 text-sm">{bus.bus_number}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {bookedSeats.length} Seat{bookedSeats.length > 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatTime(bus.start_time)}</div>
                  <div className="text-gray-700 font-medium mt-1">{bus.origin}</div>
                </div>
                
                <div className="flex-1 mx-4 relative">
                  <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatTime(bus.end_time)}</div>
                  <div className="text-gray-700 font-medium mt-1">{bus.destination}</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="font-semibold text-blue-700">
                    Selected Seats: {bookedSeats.map((seat) => seat.seat_number).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Price per seat</span>
                  <span className="font-semibold">₹{pricePerSeat}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Seats × {bookedSeats.length}</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center py-2 text-green-600">
                    <span>Discount Applied</span>
                    <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={processing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Action */}
<div className="space-y-6">
  {/* Coupon Card */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Coupon</h3>
    
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={processing}
        />
        <button
          onClick={applyCoupon}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          disabled={processing}
        >
          Apply
        </button>
      </div>
      {couponError && (
        <p className="text-red-500 text-sm font-medium">{couponError}</p>
      )}
      
      <div className="text-xs text-gray-500">
        <p>Available coupons: SAVE10, FLAT50, SAVE20</p>
      </div>
    </div>
  </div>

  {/* QR Payment Card */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <div className="text-center mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Scan to Pay</h3>
      <p className="text-2xl font-bold text-blue-600">₹{finalPrice.toFixed(2)}</p>
    </div>
    
    <div className="flex justify-center mb-4">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="bg-white p-3 rounded-lg shadow-sm flex justify-center">
          <QRCode
            value={`upi://pay?pa=6302543439@axl&pn=VipulStore&am=${finalPrice.toFixed(2)}&cu=INR`}
            size={180}
          />
        </div>
      </div>
    </div>
    
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-1">UPI ID</p>
      <p className="font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg break-all">
        6302543439@axl
      </p>
    </div>
  </div>

  {/* Confirm Payment Button */}
  <button
    onClick={handlePayment}
    disabled={processing}
    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
  >
    {processing ? (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
        Processing Payment...
      </div>
    ) : (
      `Confirm & Pay ₹${finalPrice.toFixed(2)}`
    )}
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default Payment;