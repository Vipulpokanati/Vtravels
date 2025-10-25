import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Wrapper = ({ token, handlelogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      handlelogout();
      alert("You have been logged out successfully.");
      navigate("/");
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Browse Buses", icon: "🚌" },
    { path: "/bookings", label: "My Bookings", icon: "🎫" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-800">
      {/* Enhanced Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-lg font-bold">🚌</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TravelEase
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Seamless Journeys</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {token && navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActiveRoute(link.path)
                      ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {token ? (
                <>
                  <div className="text-sm text-gray-500 border-r border-gray-200 pr-3">
                    Welcome back! 👋
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium group"
                  >
                    <span className="group-hover:scale-110 transition-transform">🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium group">
                    <span className="group-hover:scale-110 transition-transform">🔑</span>
                    <span>Login</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
              <div className="space-y-2">
                {token && navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActiveRoute(link.path)
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                {token ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg transition-colors font-medium hover:bg-red-100"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg transition-colors font-medium hover:bg-blue-100"
                  >
                    <span>🔑</span>
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className=" bg-white/90 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🚌</span>
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TravelEase
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Your trusted partner for seamless bus travel experiences. 
                Book your journeys with confidence and travel with ease across the country.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Browse Buses
                  </Link>
                </li>
                <li>
                  <Link to="/bookings" className="text-gray-600 hover:text-blue-600 transition-colors">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+91 6302543439</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>pokanativipul@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span>24/7 Customer Support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-evenly items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TravelEase. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Wrapper;