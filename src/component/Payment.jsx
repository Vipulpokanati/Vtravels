import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const COUPONS = {
  SAVE10: { type: 'percentage', value: 10 },
  FLAT50: { type: 'flat', value: 50 },
  SAVE20: { type: 'percentage', value: 20 },
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookedSeats, setBookedSeats] = useState([]);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (location.state && location.state.bookedSeats) {
      const seats = location.state.bookedSeats;
      setBookedSeats(seats);

      const price = seats[0]?.price || 100; // Fallback if price is missing
      const total = price * seats.length;

      setPricePerSeat(price);
      setTotalPrice(total);
      setFinalPrice(total); // Initially, no discount
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
      return;
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (totalPrice * coupon.value) / 100;
    } else if (coupon.type === 'flat') {
      discount = coupon.value;
    }

    // Prevent discount > total
    discount = Math.min(discount, totalPrice);

    setDiscountAmount(discount);
    setFinalPrice(totalPrice - discount);
    setCouponError('');
  };

  const handlePayment = () => {
    alert("Booking Confirmed..!");
    navigate('/bookings');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Payment Page</h2>

      <p>You have booked the following seats:</p>
      <ul>
        {bookedSeats.map((seat) => (
          <li key={seat.id}>Seat {seat.seat_number}</li>
        ))}
      </ul>

      <p>Price per seat: ₹{pricePerSeat}</p>
      <p>Total price: ₹{totalPrice}</p>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="coupon">Coupon Code:</label><br />
        <input
          id="coupon"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={applyCoupon}>Apply</button>
        {couponError && <p style={{ color: 'red' }}>{couponError}</p>}
      </div>

      {discountAmount > 0 && (
        <p style={{ color: 'green' }}>
          Coupon applied: -₹{discountAmount.toFixed(2)}
        </p>
      )}

      <h3>Final Price: ₹{finalPrice.toFixed(2)}</h3>

      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Pay ₹{finalPrice.toFixed(2)}
      </button>
    </div>
  );
};

export default Payment;

