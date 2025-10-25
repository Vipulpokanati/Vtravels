import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelay, setLoadingDelay] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;

    let delayTimer;
    
    // Show loading animation after 1 second if data hasn't loaded yet
    delayTimer = setTimeout(() => {
      if (loading) {
        setLoadingDelay(true);
      }
    }, 1000);

    axios
      .get(`http://localhost:8000/api/user/${userId}/bookings/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      })
      .catch((err) => {
        console.error('Error fetching bookings:', err);
        alert('Network error. Please try again.');
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      });

    // Cleanup function
    return () => {
      clearTimeout(delayTimer);
    };
  }, [token, userId, loading]);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Loading skeleton for booking cards
  const BookingSkeleton = () => (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          {/* Route */}
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          
          {/* Times & Price */}
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Footer */}
          <div className="border-t pt-3 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/5"></div>
          </div>
          
          {/* Status */}
          <div className="mt-3 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Enhanced loading animation
  const BufferingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
      <p className="text-sm text-gray-400 mt-1">Please wait while we fetch your travel history</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Your Bookings
        </h2>

        {/* Loading States */}
        {loading ? (
          <div>
            {loadingDelay ? (
              <BufferingAnimation />
            ) : (
              <BookingSkeleton />
            )}
          </div>
        ) : (
          /* Actual Content */
          <>
            {/* No Bookings Message */}
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">You have no bookings yet</p>
                <p className="text-gray-500">Start your next journey today!</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Browse Buses
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-200"
                  >
                    {/* Bus Name & Number */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {b.bus.bus_name}
                      </h3>
                      <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-md">
                        #TICKET ID-{b.id.toString().padStart(5, "90")}
                      </span>
                    </div>

                    {/* Route */}
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">{b.bus.origin}</span> →{' '}
                      <span className="font-medium">{b.bus.destination}</span>
                    </p>

                    {/* Times & Price */}
                    <div className="text-gray-600 text-sm mb-2 space-y-1">
                      <p>Departure: {formatTime(b.bus.start_time)}</p>
                      <p>Arrival: {formatTime(b.bus.end_time)}</p>
                      <p>Price: ₹{b.bus.price}</p>
                    </div>

                    {/* Seat & Booking Time */}
                    <div className="border-t pt-3 flex justify-between items-center text-sm text-gray-600">
                      <p>Seat: <span className="font-medium text-gray-800">{b.seat.seat_number}</span></p>
                      <p>{new Date(b.booking_time).toLocaleString()}</p>
                    </div>

                    {/* Booking Status and Bus Number */}
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">PNR: #{b.bus.bus_number}</span>
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
