import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const BookingForm = ({ bus, selectedSeats }) => {
  // 1. User data state
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });

  // 2. Handle form input changes
  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle form submit
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // Collect selected seat numbers
    const selectedSeatNumbers = selectedSeats.map(seat => seat.seat_number).join(', ');

    // Prepare EmailJS template params
    const templateParams = {
      user_name: userData.name,
      user_email: userData.email,
      bus_name: bus.bus_name,
      bus_number: bus.bus_number,
      origin: bus.origin,
      destination: bus.destination,
      start_time: bus.start_time,
      end_time: bus.end_time,
      seat_numbers: selectedSeatNumbers,
      price: selectedSeats.reduce((total, seat) => total + parseFloat(seat.price), 0),
      logo_url: 'https://yourdomain.com/logo.jpeg', // Replace with your logo URL
    };

    // Send email
    emailjs.send(
      'YOUR_SERVICE_ID',   // e.g., 'service_xxx'
      'YOUR_TEMPLATE_ID',  // e.g., 'template_xxx'
      templateParams,
      'YOUR_PUBLIC_KEY'    // e.g., 'user_xxx'
    )
    .then((response) => {
      console.log('Booking email sent!', response.status, response.text);
      alert('Booking Successful! Check your email.');
    })
    .catch((err) => {
      console.error('Email sending error:', err);
      alert('Failed to send booking email.');
    });
  };

  return (
    <form onSubmit={handleBookingSubmit}>
      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleInputChange}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleInputChange}
        placeholder="Your Email"
        required
      />
      <button type="submit">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;
