import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BusList from './BusList';
import BusSeats from './BusSeats';
import Wrapper from './Wrapper';
import UserBookings from './UserBookings';
import Payment from './Payment';
import PrivacyPolicy from './PrivacyPolicy';
import CookiePolicy from './CookiePolicy';
import HelpCenter from './HelpCenter';
import TermsOfService from './TermsOfService';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleLogin = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setToken(token);
    setUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
  };

  return (
    
    <Wrapper token={token} handlelogout={handleLogout}>
      <Routes>
        <Route path='/' element={<BusList token={token} userId={userId} />} />
        <Route path='/buses' element={<BusList token={token} userId={userId} />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
        <Route path='/bus/:busId' element={<BusSeats token={token} userId={userId} />} />
        <Route path='/payment' element={<Payment token={token} userId={userId} />} />
        <Route path='/bookings' element={<UserBookings token={token} userId={userId} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/help-center" element={<HelpCenter />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
