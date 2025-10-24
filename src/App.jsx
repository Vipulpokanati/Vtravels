import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BusList from './BusList';
import BusSeats from './BusSeats';
import UserBookings from './UserBookings';
import Wrapper from './Wrapper';
import Payment from './Payment';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Initialize auth state after component mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      
      if (storedToken && storedUserId) {
        setToken(storedToken);
        setUserId(storedUserId);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

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

  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          {/* Animated Bus Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mx-auto mb-2 relative bus-moving">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-blue-400 rounded-t-lg"></div>
              <div className="absolute top-1 left-3 w-3 h-3 bg-yellow-300 rounded-full"></div>
              <div className="absolute top-1 right-3 w-3 h-3 bg-yellow-300 rounded-full"></div>
              <div className="absolute -bottom-1 -left-2 w-4 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute -bottom-1 -right-2 w-4 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          
          {/* Loading Spinner */}
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to BusTravel</h2>
          <p className="text-gray-600 animate-pulse">Preparing your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Wrapper token={token} handlelogout={handleLogout}>
        {/* Animated Route Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          {/* Animated route lines */}
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent animate-pulse"></div>
          <div className="absolute top-2/3 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-indigo-200 to-transparent animate-pulse"></div>
        </div>

        {/* Main Content with Animation */}
        <div 
          key={location.pathname}
          className="animate-fade-in-up"
        >
          <Routes>
            <Route 
              path='/' 
              element={
                <BusList 
                  token={token}
                />
              } 
            />
            <Route 
              path="/register" 
              element={<RegisterForm />} 
            />
            <Route 
              path="/login" 
              element={<LoginForm onLogin={handleLogin} />} 
            />
            <Route 
              path='/bus/:busId' 
              element={<BusSeats token={token} />} 
            />
            <Route 
              path='/payment' 
              element={<Payment />} 
            />
            <Route 
              path='/bookings' 
              element={
                <UserBookings 
                  token={token} 
                  userId={userId}
                />
              } 
            />
            
            {/* 404 Page - Catch all route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                  <div className="text-center max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                      {/* Error Icon */}
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      
                      <h1 className="text-3xl font-bold text-gray-800 mb-3">Page Not Found</h1>
                      <p className="text-gray-600 mb-2">
                        Oops! The journey you're looking for has taken a wrong turn.
                      </p>
                      <p className="text-gray-500 text-sm mb-6">
                        The page doesn't exist or has been moved to a different route.
                      </p>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => window.location.href = '/'}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          🚌 Back to Home Station
                        </button>
                        
                        <button 
                          onClick={() => window.history.back()}
                          className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          ← Go Back
                        </button>
                      </div>
                    </div>
                    
                    {/* Fun Illustration */}
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center space-x-2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Lost but not forgotten</span>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Wrapper>
    </div>
  );
}

export default App;