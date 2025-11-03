import React, { useEffect, useState } from "react";
import axios from "axios";

const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelay, setLoadingDelay] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (!token || !userId) return;

    const delayTimer = setTimeout(() => {
      if (loading) setLoadingDelay(true);
    }, 1000);

    axios
      .get(`https://travels-nkfu.onrender.com/api/user/${userId}/bookings/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        // ✅ Ensure bookings is always an array
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.bookings || [];

        setBookings(data);
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        alert("Network error. Please try again.");
        // ✅ Prevent crash even on failed request
        setBookings([]);
        setLoading(false);
        setLoadingDelay(false);
        clearTimeout(delayTimer);
      });

    return () => clearTimeout(delayTimer);
  }, [token, userId, loading]);

  // Skeleton while loading
  const BookingSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const BufferingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-700">
        Loading your bookings...
      </p>
      <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
        Please wait while we fetch your travel history
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Your Bookings
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and view all your bus reservations in one place
          </p>
        </div>

        {loading ? (
          loadingDelay ? <BufferingAnimation /> : <BookingSkeleton />
        ) : (
          <>
            {/* ✅ Latest Booking */}
            {Array.isArray(bookings) && bookings.length > 0 && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Latest Booking</h3>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    🎫 Active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <p className="text-blue-100 text-sm font-medium">Ticket ID</p>
                    <p className="font-semibold text-lg">
                      {bookings[0]?.ticket_id || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-100 text-sm font-medium">Journey Date</p>
                    <p className="font-semibold text-lg">
                      {bookings[0]?.booking_time?.split(" ")[0] || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-100 text-sm font-medium">Bus</p>
                    <p className="font-semibold text-lg">
                      {bookings[0]?.bus_name || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-100 text-sm font-medium">Total Paid</p>
                    <p className="font-semibold text-lg">
                      ₹{parseFloat(bookings[0]?.total_price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-400/30">
                  <p className="text-blue-100">
                    <span className="font-medium">Seats:</span>{" "}
                    {Array.isArray(bookings[0]?.seats)
                      ? bookings[0].seats.join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ Empty State */}
            {(!Array.isArray(bookings) || bookings.length === 0) && (
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No bookings yet
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Start your journey by booking your first bus ride
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="relative z-10">Browse Available Buses</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                </button>
              </div>
            )}

            {/* ✅ Bookings Grid */}
            {Array.isArray(bookings) && bookings.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {bookings.map((b) => (
                  <div
                    key={b.ticket_id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {b.bus_name}
                          </h3>
                          <div className="flex items-center text-gray-600">
                            <span className="font-semibold text-gray-800">
                              {b.origin}
                            </span>
                            <svg
                              className="w-4 h-4 mx-2 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-semibold text-gray-800">
                              {b.destination}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                          #{b.ticket_id}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Journey Date</p>
                          <p className="font-semibold text-gray-900">
                            {b.booking_time?.split(" ")[0] || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-semibold text-gray-900">
                            {formatTime(b.start_time)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Seats</p>
                          <p className="font-semibold text-gray-900">
                            {Array.isArray(b.seats)
                              ? b.seats.join(", ")
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Paid</p>
                          <p className="font-semibold text-gray-900">
                            ₹{parseFloat(b.total_price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            PNR Number
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            #{b.bus_number}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Confirmed
                        </span>
                      </div>
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
