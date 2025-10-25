import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const COUPONS = {
  SAVE10: { type: 'percentage', value: 10 },
  FLAT50: { type: 'flat', value: 50 },
  SAVE20: { type: 'percentage', value: 20 },
};

const Payment = ({ token,userId}) => {
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
    if (!location.state || !location.state.bookedSeats) {
      alert('No seats selected.');
      navigate('/');
      return;
    }

    const seats = location.state.bookedSeats;
    setBookedSeats(seats);

    const price = location.state.bus.price || 100;
    setPricePerSeat(price);
    const total = price * seats.length;
    setTotalPrice(total);
    setFinalPrice(total);
  }, [location.state, navigate]);

  const applyCoupon = () => {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      setDiscountAmount(0);
      setFinalPrice(totalPrice);
      return;
    }

    let discount = coupon.type === 'percentage'
      ? (totalPrice * coupon.value) / 100
      : coupon.value;

    discount = Math.min(discount, totalPrice);
    setDiscountAmount(discount);
    setFinalPrice(totalPrice - discount);
    setCouponError('');
  };

  const handlePayment = async () => {
    try {
      for (let seat of bookedSeats) {
        await axios.post(
          'http://localhost:8000/api/bookings/',
          { seat: seat.id },
          { headers: { Authorization: `Token ${token}` } }
        );
      }
      alert('Booking Confirmed!');
      navigate(`/bookings`);
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Payment</h2>
      <ul>{bookedSeats.map(seat => <li key={seat.id}>Seat {seat.seat_number}</li>)}</ul>
      <p>Price per seat: ₹{pricePerSeat}</p>
      <p>Total: ₹{totalPrice}</p>

      <div>
        <input
          type="text"
          value={couponCode}
          placeholder="Coupon code"
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button onClick={applyCoupon}>Apply</button>
        {couponError && <p style={{ color: 'red' }}>{couponError}</p>}
      </div>

      {discountAmount > 0 && <p>Discount: -₹{discountAmount.toFixed(2)}</p>}
      <h3>Final Price: ₹{finalPrice.toFixed(2)}</h3>

      <button onClick={handlePayment}>Pay ₹{finalPrice.toFixed(2)}</button>
    </div>
  );
};

export default Payment;

