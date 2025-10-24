import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const BusSeats = ({token}) => {
    const [bus, setBus] = useState(null)
    const [seats, setSeats] = useState([])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [loading, setLoading] = useState(true)

    const { busId } = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchBusDetails = async()=>{
            try {
                const response = await axios(`https://travels-nkfu.onrender.com/api/buses/${busId}`)
                setBus(response.data)
                const sortedSeats = (response.data.seats || []).sort((a, b) => a.seat_number - b.seat_number)
                setSeats(sortedSeats)
            } catch (error) {
                console.log('Error in fetching details', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBusDetails()
    }, [busId])

    const handleSeatSelect = (seatId, isAvailable) => {
        if (!isAvailable) return
        
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId)
            } else {
                return [...prev, seatId]
            }
        })
    }

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat")
            return
        }
        
        const selectedSeatsData = seats.filter(seat => selectedSeats.includes(seat.id))
        navigate('/payment', { 
            state: { 
                bookedSeats: selectedSeatsData,
                bus: bus
            } 
        })
    }

    const organizeSeatsInRows = () => {
        const rows = [];
        let currentRow = [];
        
        seats.forEach((seat, index) => {
            if (index % 3 === 0) {
                if (currentRow.length > 0) {
                    rows.push(currentRow);
                }
                currentRow = [seat];
            } else {
                currentRow.push(seat);
            }
        });
        
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
        
        return rows;
    }

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A'
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading bus details...</p>
                </div>
            </div>
        )
    }

    if (!bus) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-xl max-w-sm">
                        <h3 className="font-bold text-lg mb-2">Bus Not Found</h3>
                        <p>Unable to load bus details. Please try again.</p>
                    </div>
                </div>
            </div>
        )
    }

    const seatRows = organizeSeatsInRows();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3 sm:py-8 sm:px-4">
            <div className="max-w-4xl mx-auto">
                {/* Bus Header */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start">
                        <div className="w-full sm:w-auto">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{bus.bus_name}</h1>
                            <p className="text-gray-600 text-sm sm:text-base">{bus.number} • {bus.features || 'AC Sleeper'}</p>
                        </div>
                        <div className="w-full sm:w-auto text-left sm:text-right">
                            <div className="text-lg font-semibold text-gray-800">
                                {bus.origin} → {bus.destination}
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatTime(bus.start_time)} - {formatTime(bus.end_time)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seat Selection Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Select Your Seats</h2>
                        <div className="text-sm text-gray-600">
                            Selected: <span className="font-semibold text-blue-600">{selectedSeats.length}</span> seat(s)
                        </div>
                    </div>

                    {/* Driver Section */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="bg-gray-100 rounded-lg py-2 sm:py-3 inline-block px-4 sm:px-8 mb-2">
                            <span className="text-gray-600 font-semibold text-sm sm:text-base">🚗 Driver Cabin</span>
                        </div>
                        <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-300 rounded mx-auto"></div>
                    </div>

                    {/* Bus Layout Container */}
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-6 sm:mb-8 border-2 border-gray-200">
                        {/* Seat Grid */}
                        <div className="space-y-4 sm:space-y-6 max-w-md mx-auto">
                            {seatRows.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-between items-center">
                                    {/* Left side - Single seat */}
                                    <div className="w-14 sm:w-20 flex justify-center">
                                        {row[0] && (
                                            <SeatButton 
                                                seat={row[0]}
                                                isSelected={selectedSeats.includes(row[0].id)}
                                                onSelect={handleSeatSelect}
                                            />
                                        )}
                                    </div>
                                    
                                    {/* Aisle Space */}
                                    <div className="flex-1 mx-2 sm:mx-4"></div>
                                    
                                    {/* Right side - Double seats */}
                                    <div className="w-28 sm:w-40 flex gap-2 sm:gap-4 justify-center">
                                        {row[1] && (
                                            <SeatButton 
                                                seat={row[1]}
                                                isSelected={selectedSeats.includes(row[1].id)}
                                                onSelect={handleSeatSelect}
                                            />
                                        )}
                                        {row[2] && (
                                            <SeatButton 
                                                seat={row[2]}
                                                isSelected={selectedSeats.includes(row[2].id)}
                                                onSelect={handleSeatSelect}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Layout Explanation */}
                        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
                            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-200">
                                <span>🚶‍♂️ Single Seats</span>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span>👥 Double Seats</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 sm:gap-6 justify-center text-xs sm:text-sm mb-4 sm:mb-6">
                        <div className="flex items-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-1 sm:mr-2 border border-green-600"></div>
                            <span className="text-gray-700">Selected</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded mr-1 sm:mr-2 border border-blue-200"></div>
                            <span className="text-gray-700">Available</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 rounded mr-1 sm:mr-2 border border-red-200"></div>
                            <span className="text-gray-700">Booked</span>
                        </div>
                    </div>

                    {/* Selected Seats Summary */}
                    {selectedSeats.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Selected Seats:</h3>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {selectedSeats.map(seatId => {
                                    const seat = seats.find(s => s.id === seatId);
                                    return (
                                        <span key={seatId} className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                            Seat {seat?.seat_number}
                                        </span>
                                    );
                                })}
                            </div>
                            <p className="text-xs sm:text-sm text-blue-600 mt-2">
                                Total: {selectedSeats.length} seat(s) selected
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center order-2 sm:order-1"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Buses
                    </button>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center order-1 sm:order-2">
                        <div className="text-center sm:text-right w-full sm:w-auto">
                            <div className="text-xs sm:text-sm text-gray-600">Total Selected</div>
                            <div className="text-lg font-bold text-blue-600">{selectedSeats.length} seat(s)</div>
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            disabled={selectedSeats.length === 0}
                            className={`
                                w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center
                                ${selectedSeats.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                }
                            `}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SeatButton = ({ seat, isSelected, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(seat.id, seat.is_available)}
            disabled={!seat.is_available}
            className={`
                relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg font-semibold transition-all duration-200 transform hover:scale-110
                flex items-center justify-center text-xs sm:text-sm
                ${!seat.is_available 
                    ? 'bg-red-100 text-red-400 cursor-not-allowed border-2 border-red-200' 
                    : isSelected
                    ? 'bg-green-500 text-white shadow-lg border-2 border-green-600'
                    : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200'
                }
            `}
        >
            <span className="font-bold">{seat.seat_number}</span>
            
            {!seat.is_available && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-0.5 sm:w-6 sm:h-0.5 bg-red-400 rotate-45"></div>
                </div>
            )}
            
            {isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
};

export default BusSeats