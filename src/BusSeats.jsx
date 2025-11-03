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
    
    delayTimer = setTimeout(() => {
      if (loading) {
        setLoadingDelay(true);
      }
    }, 1000);

    axios
      .get(`https://travels-nkfu.onrender.com/api/buses/${busId}`)
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
    navigate('/payment', { state: { bookedSeats: selectedSeats, bus} });
  };
  
  // Split seats into rows of 3 (1 left + 2 right)
  const rows = [];
  for (let i = 0; i < seats.length; i += 3) {
    rows.push(seats.slice(i, i + 3));
  }

  // Enhanced loading animation
  const BufferingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Your Journey</h3>
      <p className="text-gray-600 text-lg mb-2">Preparing the seat layout...</p>
      <p className="text-gray-500 text-sm">This will just take a moment</p>
    </div>
  );

  // Premium skeleton loader
  const SeatsLayoutSkeleton = () => (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-full w-32 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-800 rounded-2xl w-24 animate-pulse"></div>
      </div>

      <div className="space-y-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <div className="w-16 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
            </div>
            <div className="w-16 bg-gradient-to-b from-gray-100 to-gray-200 mx-6 rounded-lg h-6"></div>
            <div className="flex flex-1 justify-center gap-5">
              <div className="w-16 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
              <div className="w-16 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Premium seat button component
  const SeatButton = ({ seat, selectedSeats, toggleSeat }) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    
    return (
      <button
        onClick={() => toggleSeat(seat)}
        disabled={!seat.is_available}
        className={`
          relative w-16 h-14 rounded-2xl font-bold text-sm transition-all duration-300 transform
          shadow-lg hover:shadow-xl border-2 group
          ${
            !seat.is_available
              ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 cursor-not-allowed text-gray-400'
              : isSelected
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-600 text-white shadow-2xl scale-110'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-400 text-gray-700 hover:scale-105'
          }
        `}
      >
        {seat.seat_number}
        
        {/* Hover effect */}
        {seat.is_available && !isSelected && (
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
        )}
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Booked indicator */}
        {!seat.is_available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-gray-400 rotate-45 rounded-full"></div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600">Back to Results</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Right Content - Seat Map */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="w-full">
                {loadingDelay ? (
                  <BufferingAnimation />
                ) : (
                  <SeatsLayoutSkeleton />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
                {/* Header */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Seats</h2>
                  <p className="text-gray-600 text-lg">Select your preferred seats for a comfortable journey</p>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-8 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg shadow"></div>
                    <span className="text-gray-700 font-medium">Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-600 rounded-lg shadow"></div>
                    <span className="text-gray-700 font-medium">Selected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg shadow"></div>
                    <span className="text-gray-700 font-medium">Booked</span>
                  </div>
                </div>

                {/* Bus Layout */}
                <div className="relative">
                  {/* Front Section - Driver on Right, Entry Door on Left */}
                  <div className="flex justify-between items-center mb-12">
                    {/* Left Side - Entry Door */}
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gradient-to-b from-green-500 to-green-600 w-24 h-32 rounded-lg flex flex-col items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        <span className="text-white text-sm font-bold">ENTRY</span>
                        <span className="text-white text-xs">DOOR</span>
                      </div>
                    </div>

                    {/* Aisle Space */}
                    <div className="w-20"></div>

                    {/* Right Side - Driver Area (Width equal to 2 seats) */}
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gradient-to-br from-gray-700 to-gray-900 w-40 h-32 rounded-2xl flex items-center justify-center shadow-2xl">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-white font-bold text-lg">DRIVER</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seats Grid */}
                  <div className="space-y-8">
                    {rows.map((row, index) => (
                      <div key={index} className="flex justify-between items-center">
                        {/* Left seat */}
                        <div className="flex-1 flex justify-center">
                          {row[0] && (
                            <SeatButton
                              seat={row[0]}
                              selectedSeats={selectedSeats}
                              toggleSeat={toggleSeat}
                            />
                          )}
                        </div>

                        {/* Aisle */}
                        <div className="w-20 bg-gradient-to-b from-gray-100 to-gray-200 mx-8 rounded-xl h-10 flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">AISLE</span>
                        </div>

                        {/* Right seats */}
                        <div className="flex flex-1 justify-center gap-6">
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

                  {/* Rear of Bus */}
                  <div className="flex justify-center mt-12">
                    <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-2 w-48 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Left Sidebar - Bus Info & Selection Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bus Info Card */}
            {!loading && bus && (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{bus.bus_name}</h1>
                  <p className="text-gray-600">{bus.bus_number}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Route</span>
                    <span className="font-semibold text-gray-900">{bus.origin} → {bus.destination}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Departure</span>
                    <span className="font-semibold text-gray-900">{formatTime(bus.start_time)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Arrival</span>
                    <span className="font-semibold text-gray-900">{formatTime(bus.end_time)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Price per seat</span>
                    <span className="text-xl font-bold text-blue-600">₹{bus.price}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Bus Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {bus.features?.split(',').map((feature, index) => (
                      <span key={index} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                        {feature.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Selection Summary */}
            {!loading && selectedSeats.length > 0 && (
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your Selection
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Seats Selected</span>
                    <span className="font-bold text-lg">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Seat Numbers</span>
                    <span className="font-bold text-lg">{selectedSeats.map(seat => seat.seat_number).join(', ')}</span>
                  </div>
                  <div className="border-t border-blue-400/30 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Total Amount</span>
                      <span className="text-2xl font-bold">₹{selectedSeats.length * (bus?.price || 0)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToPayment}
                  className="w-full mt-6 bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSeats;