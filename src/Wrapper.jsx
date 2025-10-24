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
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">Travels</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Browse Buses
                            </Link>
                            {token && (
                                <Link to="/bookings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                    My Bookings
                                </Link>
                            )}
                            
                            {/* Auth Button */}
                            {token ? (
                                <button 
                                    onClick={logout}
                                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login">
                                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>   

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2024 BusTravel. All rights reserved. Comfortable journeys made easy.</p>
                </div>
            </footer>
        </div>
    );
};

export default Wrapper;
