import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';

const COUPONS = {
  SAVE10: { type: 'percentage', value: 10 },
  FLAT50: { type: 'flat', value: 50 },
  SAVE20: { type: 'percentage', value: 20 },
};

const Payment = ({ token, userId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookedSeats, setBookedSeats] = useState([]);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    // Simulate loading for payment page initialization
    const timer = setTimeout(() => {
      if (!location.state || !location.state.bookedSeats || !location.state.bus) {
        alert('No seats or bus selected.');
        navigate('/');
        return;
      }

      const seats = location.state.bookedSeats;
      setBookedSeats(seats);

      const price = location.state.bus?.price;
      if (!price) {
        alert('Network error. Please try again.');
        navigate(-1);
        return;
      }

      setPricePerSeat(price);
      const total = price * seats.length;
      setTotalPrice(total);
      setFinalPrice(total);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const applyCoupon = () => {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (!coupon) {
      setCouponError('❌ Invalid coupon code');
      setDiscountAmount(0);
      setFinalPrice(totalPrice);
      return;
    }

    let discount =
      coupon.type === 'percentage'
        ? (totalPrice * coupon.value) / 100
        : coupon.value;

    discount = Math.min(discount, totalPrice);
    setDiscountAmount(discount);
    setFinalPrice(totalPrice - discount);
    setCouponError('');
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      for (let seat of bookedSeats) {
        await axios.post(
          'https://travels-nkfu.onrender.com/api/bookings/',
          { seat: seat.id },
          { headers: { Authorization: `Token ${token}` } }
        );
      }
      setTimeout(() => {
        setProcessing(false);
        alert('✅ Booking Confirmed!');
        navigate(`/bookings`);
      }, 1500);
    } catch (error) {
      setProcessing(false);
      alert('⚠️ Payment failed. Please try again.');
    }
  };

  const bus = location.state?.bus;

  // Payment loading skeleton
  const PaymentSkeleton = () => (
    <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="mb-4 h-4 bg-gray-200 rounded w-16"></div>
      
      {/* Header Skeleton */}
      <div className="text-center mb-6">
        <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>

      {/* Bus Summary Skeleton */}
      <div className="bg-gray-100 rounded-xl p-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-3"></div>
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-8 self-center"></div>
          <div className="space-y-2 text-right">
            <div className="h-6 bg-gray-300 rounded w-16 ml-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>

      {/* Pricing Skeleton */}
      <div className="space-y-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>

      {/* Coupon Skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="flex gap-2">
          <div className="flex-grow h-10 bg-gray-200 rounded"></div>
          <div className="w-20 h-10 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* QR Code Skeleton */}
      <div className="my-6 p-5 bg-gray-100 rounded-xl flex flex-col items-center gap-4">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="w-40 h-40 bg-gray-300 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Button Skeleton */}
      <div className="h-12 bg-gray-300 rounded-xl"></div>
    </div>
  );

  // Payment processing animation
  const PaymentProcessing = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
        <p className="text-gray-600 mb-4">Please wait while we confirm your booking</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
        <PaymentSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      {processing && <PaymentProcessing />}
      
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
          disabled={processing}
        >
          ← Back
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          Payment Summary
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Confirm your booking and complete payment
        </p>

        {/* Bus & Seat Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="text-center text-gray-500 text-sm font-light mb-3">
            {bus?.bus_name || 'Bus Provider'}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-left">
              <div className="font-bold text-black text-lg">
                {formatTime(bus.start_time)}
              </div>
              <div className="text-gray-700 text-base">{bus?.origin}</div>
            </div>

            <div className="text-gray-400 text-xl font-semibold mx-4 select-none">→</div>

            <div className="text-right">
              <div className="font-bold text-black text-lg">
                {formatTime(bus.end_time)}
              </div>
              <div className="text-gray-700 text-base">{bus?.destination}</div>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13h18M3 17h18M7 13v4M17 13v4M7 21h10a1 1 0 001-1v-3H6v3a1 1 0 001 1zM7 7h10v6H7z"
                />
              </svg>
              <span>
                {bookedSeats.length} Seat{bookedSeats.length > 1 ? 's' : ''} :{' '}
                {bookedSeats.map(seat => seat.seat_number).join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="space-y-2 mb-6 text-gray-700">
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

          <hr />
          <p className="flex justify-between text-lg font-bold text-blue-700">
            <span>Final Price:</span> <span>₹{finalPrice.toFixed(2)}</span>
          </p>
        </div>

        {/* Coupon Input */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">
            Have a coupon?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              placeholder="Enter coupon code"
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={processing}
            />
            <button
              onClick={applyCoupon}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={processing}
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="text-red-500 text-sm mt-2">{couponError}</p>
          )}
        </div>

        {/* QR Code Section */}
        <div className="my-6 p-5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center gap-4 shadow-sm">
          <h4 className="text-blue-700 font-semibold text-lg">
            Scan to pay ₹{finalPrice.toFixed(2)}
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QRCode
              value={`upi://pay?pa=6302543439@axl&pn=VipulStore&am=${finalPrice.toFixed(2)}&cu=INR`}
              size={160}
            />
          </div>
          <p className="text-gray-600 text-sm">
            UPI ID: <span className="font-medium">6302543439@axl</span>
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
