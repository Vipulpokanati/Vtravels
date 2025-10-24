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
                // Sort seats by seat_number to ensure proper ordering
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

    // Function to organize seats in rows with single seats on left and double seats on right
    const organizeSeatsInRows = () => {
        const rows = [];
        let currentRow = [];
        
        seats.forEach((seat, index) => {
            // Every 3 seats form a new row: single seat on left, double seats on right
            if (index % 3 === 0) {
                if (currentRow.length > 0) {
                    rows.push(currentRow);
                }
                currentRow = [seat];
            } else {
                currentRow.push(seat);
            }
        });
        
        // Push the last row if it exists
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading bus details...</p>
                </div>
            </div>
        )
    }

    if (!bus) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl">
                        <h3 className="font-bold text-lg mb-2">Bus Not Found</h3>
                        <p>Unable to load bus details. Please try again.</p>
                    </div>
                </div>
            </div>
        )
    }

    const seatRows = organizeSeatsInRows();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Bus Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{bus.bus_name}</h1>
                            <p className="text-gray-600">{bus.number} • {bus.features || 'AC Sleeper'}</p>
                        </div>
                        <div className="mt-4 lg:mt-0 text-center lg:text-right">
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
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Select Your Seats</h2>
                        <div className="text-sm text-gray-600">
                            Selected: <span className="font-semibold text-blue-600">{selectedSeats.length}</span> seat(s)
                        </div>
                    </div>

                    {/* Driver Section */}
                    <div className="text-center mb-8">
                        <div className="bg-gray-100 rounded-lg py-3 inline-block px-8 mb-2">
                            <span className="text-gray-600 font-semibold">🚗 Driver Cabin</span>
                        </div>
                        <div className="w-32 h-4 bg-gray-300 rounded mx-auto"></div>
                    </div>

                    {/* Bus Layout Container */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border-2 border-gray-200">
                        {/* Seat Grid */}
                        <div className="space-y-6 max-w-md mx-auto">
                            {seatRows.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-between items-center">
                                    {/* Left side - Single seat */}
                                    <div className="w-20 flex justify-center">
                                        {row[0] && (
                                            <SeatButton 
                                                seat={row[0]}
                                                isSelected={selectedSeats.includes(row[0].id)}
                                                onSelect={handleSeatSelect}
                                            />
                                        )}
                                    </div>
                                    
                                    {/* Aisle Space */}
                                    <div className="flex-1 mx-4 flex flex-col items-center">
                                        
                                    </div>
                                    
                                    {/* Right side - Double seats */}
                                    <div className="w-40 flex gap-4 justify-center">
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
                        <div className="mt-8 text-center text-sm text-gray-600">
                            <div className="inline-flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200">
                                <span>🚶‍♂️ Single Seats</span>
                                <span className="text-gray-300">|</span>
                                <span>👥 Double Seats</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-6 justify-center text-sm mb-6">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded mr-2 border border-green-600"></div>
                            <span className="text-gray-700">Selected</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-white rounded mr-2 border border-blue-200"></div>
                            <span className="text-gray-700">Available</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-100 rounded mr-2 border border-red-200"></div>
                            <span className="text-gray-700">Booked</span>
                        </div>
                    </div>

                    {/* Selected Seats Summary */}
                    {selectedSeats.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-2">Selected Seats:</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.map(seatId => {
                                    const seat = seats.find(s => s.id === seatId);
                                    return (
                                        <span key={seatId} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Seat {seat?.seat_number}
                                        </span>
                                    );
                                })}
                            </div>
                            <p className="text-sm text-blue-600 mt-2">
                                Total: {selectedSeats.length} seat(s) selected
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Buses
                    </button>
                    
                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Total Selected</div>
                            <div className="text-lg font-bold text-blue-600">{selectedSeats.length} seat(s)</div>
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            disabled={selectedSeats.length === 0}
                            className={`
                                px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center
                                ${selectedSeats.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                }
                            `}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Separate Seat Button Component
const SeatButton = ({ seat, isSelected, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(seat.id, seat.is_available)}
            disabled={!seat.is_available}
            className={`
                relative w-14 h-14 rounded-lg font-semibold transition-all duration-200 transform hover:scale-110
                flex items-center justify-center
                ${!seat.is_available 
                    ? 'bg-red-100 text-red-400 cursor-not-allowed border-2 border-red-200' 
                    : isSelected
                    ? 'bg-green-500 text-white shadow-lg border-2 border-green-600'
                    : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200'
                }
            `}
        >
            {/* Seat Number */}
            <span className="text-sm font-bold">{seat.seat_number}</span>
            
            {/* Occupied indicator */}
            {!seat.is_available && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-400 rotate-45"></div>
                </div>
            )}
            
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
};

export default BusSeats