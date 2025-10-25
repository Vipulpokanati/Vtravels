import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusList = ({ userId }) => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDelay, setLoadingDelay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let delayTimer;
    
    // Show loading animation after 1 second if data hasn't loaded yet
    delayTimer = setTimeout(() => {
      if (loading) {
        setLoadingDelay(true);
      }
    }, 1000);

    axios.get('http://localhost:8000/api/buses/')
      .then(res => {
        setBuses(res.data);
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      })
      .catch(err => {
        console.error('Error fetching buses', err);
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      });

    // Cleanup function
    return () => {
      clearTimeout(delayTimer);
    };
  }, []);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter buses based on search term
  const filteredBuses = buses.filter(bus => 
    bus.bus_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md border border-blue-50 animate-pulse"
        >
          {/* Top Section Skeleton */}
          <div className="bg-gray-200 rounded-t-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>

          {/* Bottom Section Skeleton */}
          <div className="p-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Enhanced loading animation with buffering effect
  const BufferingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Spinning circle */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Pulsing dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-gray-600 font-medium">Loading buses...</p>
      <p className="text-sm text-gray-400 mt-1">Please wait while we fetch the latest schedules</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Heading / Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Find Your Perfect Ride</h1>
        <p className="text-gray-500 italic">"The journey is just as important as the destination."</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search by bus name, origin, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* Content based on loading state */}
      {loading ? (
        <div>
          {/* Show buffering animation after delay, otherwise show skeleton */}
          {loadingDelay ? (
            <BufferingAnimation />
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      ) : (
        /* Bus Cards */
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.length > 0 ? (
            filteredBuses.map(bus => (
              <div
                key={bus.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-blue-50"
              >
                {/* Top Section: Blue */}
                <div className="bg-blue-600 rounded-t-xl text-white p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{bus.bus_name}</h3>
                    <span className="text-sm bg-blue-500 bg-opacity-30 px-2 py-1 rounded-md">
                      {bus.features}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{bus.origin}</span> →{' '}
                    <span className="font-medium">{bus.destination}</span>
                  </p>
                </div>

                {/* Bottom Section: White */}
                <div className="p-4">
                  <p className="text-gray-500 mb-1">🕒 Departure: {formatTime(bus.start_time)}</p>
                  <p className="text-gray-500 mb-1">🎯 Arrival: {formatTime(bus.end_time)}</p>
                  <p className="text-gray-500 mb-2">💰 Price: ₹{bus.price}</p>
                  
                  <button
                    onClick={() => navigate(`/bus/${bus.id}`)}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No buses found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BusList;

