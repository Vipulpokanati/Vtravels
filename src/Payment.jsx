import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
const COUPONS = {
  SAVE10: { type: 'percentage', value: 10, name: '10% Off' },
  FLAT50: { type: 'flat', value: 50, name: 'Flat ₹50 Off' },
  SAVE20: { type: 'percentage', value: 20, name: '20% Off' },
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookedSeats, setBookedSeats] = useState([]);
  const [bus, setBus] = useState(null);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    if (location.state && location.state.bookedSeats) {
      const seats = location.state.bookedSeats;
      const busData = location.state.bus;
      setBookedSeats(seats);
      setBus(busData);

      const price = seats[0]?.price || 500;
      const total = price * seats.length;

      setPricePerSeat(price);
      setTotalPrice(total);
      setFinalPrice(total);
    } else {
      alert('No seats selected. Please book seats first.');
      navigate('/');
    }
  }, [location.state, navigate]);

  const applyCoupon = () => {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      setDiscountAmount(0);
      setFinalPrice(totalPrice);
      setAppliedCoupon(null);
      return;
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (totalPrice * coupon.value) / 100;
    } else if (coupon.type === 'flat') {
      discount = coupon.value;
    }

    discount = Math.min(discount, totalPrice);
    setDiscountAmount(discount);
    setFinalPrice(totalPrice - discount);
    setCouponError('');
    setAppliedCoupon(coupon);
  };

  const handlePayment = () => {
    alert("🎉 Booking Confirmed! Happy Journey!");
    navigate('/bookings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure payment · Instant confirmation</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Booking Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
            
            {bus && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{bus.bus_name}</h3>
                    <p className="text-gray-600 text-sm">{bus.origin} → {bus.destination}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {bus.number}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">Selected Seats:</span>{' '}
                {bookedSeats.map(seat => `Seat ${seat.seat_number}`).join(', ')}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Number of Seats:</span> {bookedSeats.length}
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Price per seat</span>
                <span>₹{pricePerSeat}</span>
              </div>
              <div className="flex justify-between">
                <span>Seats × {bookedSeats.length}</span>
                <span>₹{totalPrice}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon?.name})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply Coupon</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={applyCoupon}
                className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-semibold"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm mt-2">{couponError}</p>
            )}
            {appliedCoupon && !couponError && (
              <p className="text-green-600 text-sm mt-2">
                ✅ {appliedCoupon.name} applied successfully!
              </p>
            )}
          </div>

          {/* Available Coupons */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Coupons</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(COUPONS).map(([code, coupon]) => (
                <div key={code} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 text-center">
                  <div className="font-semibold text-blue-800">{code}</div>
                  <div className="text-sm text-blue-600">{coupon.name}</div>
                </div>
              ))}
            </div>
          </div>

{/* QR Section */}
<div className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
  <div className="text-center">
    <h4 className="text-xl font-bold text-gray-800 mb-6">
      Scan to pay ₹{finalPrice.toFixed(2)}
    </h4>
    
    <div className="flex justify-center mb-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <QRCode 
          value={`upi://pay?pa=6302543439@axl&pn=VipulStore&am=${finalPrice.toFixed(2)}&cu=INR`}
          size={200}
          className="rounded-lg"
        />
      </div>
    </div>
    
    <div className="flex items-center justify-center space-x-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm max-w-md mx-auto">
      <i className="fas fa-qrcode text-blue-500 text-lg"></i>
      <p className="text-gray-700 font-medium">UPI ID: 6302543439@axl</p>
    </div>
    
    <p className="text-gray-500 text-sm mt-4">
      Scan this QR code with any UPI app to complete your payment
    </p>
  </div>
</div>
        </div>

        {/* Payment Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Confirm Booking
          </button>
          <p className="text-gray-500 text-sm mt-3">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
