import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import emailjs from "@emailjs/browser";
import { formatTo12Hour } from './utils/formatTime'
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

  // // Format time like "14:30"
  // const formatTime = (timeStr) => {
  //   if (!timeStr) return "";
  //   const [hour, minute] = timeStr.split(":");
  //   const date = new Date();
  //   date.setHours(hour, minute);
  //   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  // };

  // Load initial data
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

    // Fetch user info
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

  // Apply coupon
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

  // ✅ Send confirmation email
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
        journey_time: formatTo12Hour(bus.start_time),
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
        "service_wjnken8", // 🔹 Replace with your actual EmailJS service ID
        "template_idforue", // 🔹 Replace with your EmailJS template ID
        templateParams,
        "MjuqnA9kYySUFbId7" // 🔹 Replace with your EmailJS public key
      );

      alert("✅ Booking Confirmed! Confirmation email sent.");
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert(
        "⚠️ Booking succeeded, but confirmation email could not be sent."
      );
    }
  };

  // ✅ Handle payment and booking
  const handlePayment = async () => {
    setProcessing(true);

    if (!bookedSeats.length) {
      alert("No seats selected");
      setProcessing(false);
      return;
    }

    try {
      const seatNumbers = bookedSeats.map((seat) => String(seat.seat_number));

      // 🔹 API call to book seats
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
      

      // 🔹 Send confirmation email
      await sendConfirmationEmail({
        userName: formData.username,
        userEmail: formData.email,
        bus: data,
        ticketId,
        successfullyBookedSeats,
        totalPrice: total_price,
      });

      // 🔹 Save latest booking to localStorage
      const latestBooking = {
        ticketId,
        bookedSeats: successfullyBookedSeats,
        bus: data,
        finalPrice: total_price,
        journeyDate: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem("latestBooking", JSON.stringify(latestBooking));

      // 🔹 Navigate to bookings page
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
      <div className="min-h-screen flex items-center justify-center">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      {processing && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">
            Processing Payment...
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
          disabled={processing}
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-700">
          Payment Summary
        </h2>
        <p className="text-center text-gray-500">
          Confirm your booking and complete payment
        </p>

        {/* Bus & Seat Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-center text-gray-500 text-sm font-light mb-3">
            {bus?.bus_name || "Bus Provider"}
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-left">
              <div className="font-bold text-black text-lg">
                {formatTo12Hour(bus.start_time)}
              </div>
              <div className="text-gray-700 text-base">{bus?.origin}</div>
            </div>
            <div className="text-gray-400 text-xl font-semibold mx-4 select-none">
              →
            </div>
            <div className="text-right">
              <div className="font-bold text-black text-lg">
                {formatTo12Hour(bus.end_time)}
              </div>
              <div className="text-gray-700 text-base">{bus?.destination}</div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
              <span>
                {bookedSeats.length} Seat{bookedSeats.length > 1 ? "s" : ""} :{" "}
                {bookedSeats.map((seat) => seat.seat_number).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="space-y-2 text-gray-700">
          <p className="flex justify-between">
            <span>Price per seat:</span> <span>₹{pricePerSeat}</span>
          </p>
          <p className="flex justify-between font-medium">
            <span>Total:</span> <span>₹{totalPrice}</span>
          </p>
          {discountAmount > 0 && (
            <p className="flex justify-between text-green-600">
              <span>Discount:</span> <span>-₹{discountAmount.toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between font-bold text-blue-700 text-lg">
            <span>Final Price:</span> <span>₹{finalPrice.toFixed(2)}</span>
          </p>
        </div>

        {/* Coupon Section */}
<div className="flex gap-2 w-full">
  <input
    type="text"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    placeholder="Enter Coupon Code"
    className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    disabled={processing}
  />
  <button
    onClick={applyCoupon}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex-shrink-0"
    disabled={processing}
  >
    Apply
  </button>
</div>
{couponError && <p className="text-red-500">{couponError}</p>}


        {/* Contact Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Contact Details</h3>
          <input
            type="text"
            name="username"
            placeholder="Name"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={processing}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={processing}
          />
        </div>

        {/* QR Code for Payment */}
        <div className="my-6 p-5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center gap-4 shadow-sm">
          <h4 className="text-blue-700 font-semibold text-lg">
            Scan to pay ₹{finalPrice.toFixed(2)}
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QRCode
              value={`upi://pay?pa=6302543439@axl&pn=VipulStore&am=${finalPrice.toFixed(
                2
              )}&cu=INR`}
              size={160}
            />
          </div>
          <p className="text-gray-600 text-sm">
            UPI ID: <span className="font-medium">6302543439@axl</span>
          </p>
        </div>

        {/* Confirm Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          disabled={processing}
        >
          {processing
            ? "Processing..."
            : `Confirm & Pay ₹${finalPrice.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
