import React from "react";  
import { Link, useNavigate } from "react-router-dom";

const Wrapper = ({ token, handlelogout, children }) => {
    const navigate = useNavigate();
    
    const logout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            handlelogout();
            alert("You have been logged out.");
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <nav className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-4">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs sm:text-sm">V</span>
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-800">Travels</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base">
                                Browse Buses
                            </Link>
                            {token && (
                                <Link to="/bookings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base">
                                    My Bookings
                                </Link>
                            )}
                            
                            {/* Auth Button */}
                            {token ? (
                                <button 
                                    onClick={logout}
                                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm sm:text-base"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login">
                                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pb-16 sm:pb-0">{children}</main>   

            {/* Mobile Footer Navigation */}
            {token && (
                <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
                    <div className="flex justify-around items-center">
                        <Link to="/" className="flex flex-col items-center text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs mt-1">Home</span>
                        </Link>
                        <Link to="/bookings" className="flex flex-col items-center text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-xs mt-1">Bookings</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-8 sm:mt-16">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
                    <p className="text-sm sm:text-base">&copy; 2024 BusTravel. All rights reserved. Comfortable journeys made easy.</p>
                </div>
            </footer>
        </div>
    );
};

export default Wrapper;