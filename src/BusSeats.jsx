import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusSeats = ({ token, userId }) => {
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelay, setLoadingDelay] = useState(false);
  const { busId } = useParams();
  const navigate = useNavigate();

  // Fetch bus details and seats
  useEffect(() => {
    let delayTimer;
    
    // Show loading animation after 1 second if data hasn't loaded yet
    delayTimer = setTimeout(() => {
      if (loading) {
        setLoadingDelay(true);
      }
    }, 1000);

    axios
      .get(`http://localhost:8000/api/buses/${busId}`)
      .then((res) => {
        setBus(res.data);
        setSeats(res.data.seats || []);
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      })
      .catch((err) => {
        console.error('Error fetching bus details:', err);
        alert('Network error. Please try again.');
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      });

    // Cleanup function
    return () => {
      clearTimeout(delayTimer);
    };
  }, [busId, loading]);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle seat selection
  const toggleSeat = (seat) => {
    if (!seat.is_available) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const proceedToPayment = () => {
    if (!token) return alert('Please login to continue.');
    if (selectedSeats.length === 0) return alert('Select at least one seat.');
    navigate('/payment', { state: { bookedSeats: selectedSeats, bus, userId } });
  };

  // Split seats into rows of 3 (1 left + 2 right)
  const rows = [];
  for (let i = 0; i < seats.length; i += 3) {
    rows.push(seats.slice(i, i + 3));
  }

  // Loading skeleton for bus header
  const BusHeaderSkeleton = () => (
    <div className="mb-6 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4 mx-auto mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/5 mx-auto"></div>
    </div>
  );

  // Loading skeleton for seats layout
  const SeatsLayoutSkeleton = () => {
    const skeletonRows = [];
    for (let i = 0; i < 10; i += 3) {
      skeletonRows.push([1, 2, 3]);
    }

    return (
      <div className="inline-block bg-white p-6 rounded-lg shadow-md border">
        {/* Driver seat area skeleton */}
        <div className="flex justify-end mb-4">
          <div className="bg-gray-300 px-3 py-1 rounded-md text-sm font-medium w-16 h-6"></div>
        </div>

        {/* Seats layout skeleton */}
        <div className="space-y-4">
          {skeletonRows.map((row, index) => (
            <div key={index} className="flex justify-between items-center w-full">
              {/* Left seat (single) */}
              <div className="flex-1 flex justify-center">
                <div className="w-12 h-10 sm:w-14 sm:h-12 bg-gray-300 rounded-md animate-pulse"></div>
              </div>

              {/* Aisle space */}
              <div className="w-6 sm:w-10"></div>

              {/* Right seats (2 seats) */}
              <div className="flex flex-1 justify-center gap-2">
                <div className="w-12 h-10 sm:w-14 sm:h-12 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="w-12 h-10 sm:w-14 sm:h-12 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      
      <p className="mt-4 text-gray-600 font-medium">Loading seat layout...</p>
      <p className="text-sm text-gray-400 mt-1">Please wait while we fetch the available seats</p>
    </div>
  );

  // Seat button component
  const SeatButton = ({ seat, selectedSeats, toggleSeat }) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    return (
      <button
        onClick={() => toggleSeat(seat)}
        disabled={!seat.is_available}
        className={`w-12 h-10 sm:w-14 sm:h-12 rounded-md border text-sm font-semibold transition
          ${
            !seat.is_available
              ? 'bg-gray-300 border-gray-400 cursor-not-allowed'
              : isSelected
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-white hover:bg-blue-50 border-gray-400'
          }`}
      >
        {seat.seat_number}
      </button>
    );
  };

  return (
    <div className="text-center max-w-4xl mx-auto px-4">
      {/* Back Button */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition"
          disabled={loading}
        >
          ← Back
        </button>
      </div>

      {/* Header Info */}
      {loading ? (
        <BusHeaderSkeleton />
      ) : (
        bus && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600">{bus.bus_name}</h2>
            <p className="text-gray-600">
              {bus.origin} → {bus.destination}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Start: {formatTime(bus.start_time)} | End: {formatTime(bus.end_time)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Price: ₹{bus.price} per seat</p>
          </div>
        )
      )}

      {/* Selected Seats Info */}
      {!loading && selectedSeats.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-700 font-medium">
            Selected {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}:{' '}
            {selectedSeats.map(seat => seat.seat_number).join(', ')}
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Total: ₹{selectedSeats.length * (bus?.price || 0)}
          </p>
        </div>
      )}

      {/* Bus Layout */}
      {loading ? (
        <div>
          {/* Show buffering animation after delay, otherwise show skeleton */}
          {loadingDelay ? (
            <BufferingAnimation />
          ) : (
            <SeatsLayoutSkeleton />
          )}
        </div>
      ) : (
        <div className="inline-block bg-white p-6 rounded-lg shadow-md border">
          {/* Driver seat area */}
          <div className="flex justify-end mb-4">
            <div className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium">
              Driver
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mb-6 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white border border-gray-400 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
              <span>Booked</span>
            </div>
          </div>

          {/* Seats layout */}
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div key={index} className="flex justify-between items-center w-full">
                {/* Left seat (single) */}
                <div className="flex-1 flex justify-center">
                  {row[0] && (
                    <SeatButton
                      seat={row[0]}
                      selectedSeats={selectedSeats}
                      toggleSeat={toggleSeat}
                    />
                  )}
                </div>

                {/* Aisle space */}
                <div className="w-6 sm:w-10"></div>

                {/* Right seats (2 seats) */}
                <div className="flex flex-1 justify-center gap-2">
                  {row[1] && (
                    <SeatButton
                      seat={row[1]}
                      selectedSeats={selectedSeats}
                      toggleSeat={toggleSeat}
                    />
                  )}
                  {row[2] && (
                    <SeatButton
                      seat={row[2]}
                      selectedSeats={selectedSeats}
                      toggleSeat={toggleSeat}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      {!loading && (
        <div className="mt-8">
          <button
            onClick={proceedToPayment}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={selectedSeats.length === 0}
          >
            {selectedSeats.length > 0 
              ? `Proceed to Pay ₹${selectedSeats.length * (bus?.price || 0)}` 
              : 'Select Seats to Continue'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BusSeats;