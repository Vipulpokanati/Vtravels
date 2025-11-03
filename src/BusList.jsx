import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatTo12Hour } from './utils/formatTime'

const BusList = ({ userId ,token}) => {
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

    axios.get('https://travels-nkfu.onrender.com/api/buses/')
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
  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
>
  {/* Top Section with Gradient */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl text-white p-6">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="text-xl font-bold tracking-tight">{bus.bus_name}</h3>
        <div className="flex items-center mt-1 space-x-2">
          <span className="text-blue-100 text-sm font-medium">{bus.origin}</span>
          <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-100 text-sm font-medium">{bus.destination}</span>
        </div>
      </div>
      <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {bus.features}
      </span>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="p-6">
    {/* Journey Details */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="space-y-1">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Departure</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">{formatTo12Hour(bus.start_time)}</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Arrival</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">{formatTo12Hour(bus.end_time)}</p>
      </div>
    </div>

    {/* Price and CTA */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div>
        <p className="text-sm text-gray-600 font-medium">Starting from</p>
        <p className="text-2xl font-bold text-gray-900">₹{bus.price}</p>
      </div>
      
      <button
        onClick={() => navigate(`/bus/${bus.id}`)}
        className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        <span className="relative z-10">Book Now</span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
      </button>
    </div>
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

