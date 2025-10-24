import React, { useState } from 'react';
import './App.css';
import { Routes, Route, } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BusList from './BusList';
import BusSeats from './BusSeats';
import UserBookings from './UserBookings';
import Wrapper from './Wrapper';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  
  const handleLogin = (token, userId)=>{
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    setToken(token);
    setUserId(userId);
  };

  const handlelogout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUserId(null)
  }

  return (

    <>
    <Wrapper token={token} handlelogout={handlelogout}>
      <Routes>
         <Route path='/' element={<BusList onSelectBus={(id)=>setSelectedBusId(id)} token={token}/>} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path='/bus/:busId' element={<BusSeats token={token}/>} />
        <Route path='/bookings' element={<UserBookings token={token} userId={userId}/>} />
       
      </Routes>
    </Wrapper>
    </>
  );
}

export default App;
