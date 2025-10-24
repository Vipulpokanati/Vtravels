import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BusList = () => {
    const [buses, setBuses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchBuses = async()=>{
            try {
                const response = await axios.get("https://travels-nkfu.onrender.com/api/buses/")
                setBuses(response.data)
            } catch (error) {
                console.log('error in fetching buses', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBuses()
    }, [])

    const filteredBuses = buses.filter(bus => 
        bus.bus_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.destination?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleViewSeats=(id)=>{
        navigate(`/bus/${id}`)
    }

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A'
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
            hour: '2-digit', 
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading available buses...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Bus</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Comfortable journeys await you</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 sm:mb-8">
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search by bus name, origin, or destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 sm:px-6 sm:py-4 sm:pl-12 rounded-xl sm:rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm sm:text-base"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 sm:left-4">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Bus List */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBuses.map((bus) => (
                        <div key={bus.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            {/* Bus Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 sm:p-4 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg">{bus.bus_name}</h3>
                                        <p className="text-blue-100 text-xs sm:text-sm">{bus.number}</p>
                                    </div>
                                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                                        {bus.features}
                                    </span>
                                </div>
                            </div>

                            {/* Route Info */}
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-800 text-sm sm:text-base">{bus.origin}</div>
                                        <div className="text-xs sm:text-sm text-gray-500">{formatTime(bus.start_time)}</div>
                                    </div>
                                    <div className="flex-1 mx-2 sm:mx-4">
                                        <div className="relative">
                                            <div className="h-0.5 bg-gray-200"></div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-800 text-sm sm:text-base">{bus.destination}</div>
                                        <div className="text-xs sm:text-sm text-gray-500">{formatTime(bus.end_time)}</div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Available Seats
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        On Time
                                    </div>
                                </div>

                                {/* View Seats Button */}
                                <button 
                                    onClick={() => handleViewSeats(bus.id)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                                >
                                    View Seats & Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBuses.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-600">No buses found</h3>
                        <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BusList