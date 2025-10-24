import axios from 'axios'
import React, { useState, useEffect } from 'react'

const UserBookings = ({token, userId}) => {
    const [bookings, setBookings] = useState([])
    const [bookingError, setBookingError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchBookings = async()=>{
            if(!token || !userId){
                setLoading(false)
                return
            }
            try {
                const response = await axios.get(`https://travels-nkfu.onrender.com/api/user/${userId}/bookings/`,
                    {
                        headers:{
                            Authorization : `Token ${token}`
                        }
                    }
                )
                setBookings(response.data)
            } catch (error) {
                console.log("fetching details failed", error)
                setBookingError(error.response?.data?.message || "Failed to load bookings")
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [userId, token])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        )
    }

    if (bookingError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-xl max-w-sm">
                        <h3 className="font-bold text-lg mb-2">Unable to Load Bookings</h3>
                        <p className="text-sm">{bookingError}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Your travel history and upcoming journeys</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-12 text-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">Start your journey by booking your first bus ticket</p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm sm:text-base"
                        >
                            Browse Buses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                {/* Booking Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 text-white">
                                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold">{booking.bus.bus_name}</h3>
                                            <p className="text-blue-100 text-sm">{booking.bus.number}</p>
                                        </div>
                                        <div className="mt-1 sm:mt-0 bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                                            <span className="font-semibold text-xs sm:text-sm">Booking ID: #{booking.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="p-4 sm:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Route</h4>
                                            <div className="flex items-center">
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-800 text-sm sm:text-base">{booking.bus.origin}</div>
                                                    <div className="text-xs sm:text-sm text-gray-500">Departure</div>
                                                </div>
                                                <div className="mx-2 sm:mx-4">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-800 text-sm sm:text-base">{booking.bus.destination}</div>
                                                    <div className="text-xs sm:text-sm text-gray-500">Destination</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Seat Details</h4>
                                            <div className="bg-green-100 text-green-800 px-3 sm:px-4 py-1 sm:py-2 rounded-lg inline-block">
                                                <span className="font-bold text-sm sm:text-base">Seat {booking.seat.seat_number}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Booking Time</h4>
                                            <p className="text-gray-600 text-sm sm:text-base">{formatDate(booking.booking_time)}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm sm:text-base">Booking Status</span>
                                            <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserBookings