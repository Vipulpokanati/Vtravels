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
      {/* Premium Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100/80">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="w-32 h-12 rounded-xl overflow-hidden shadow-lg border border-gray-100/50 group-hover:shadow-xl transition-all duration-300">
                <img
                  src="./logo.jpeg"
                  alt="TravelEase Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {token && navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold group ${
                    isActiveRoute(link.path)
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-lg border border-transparent hover:border-blue-100"
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {token ? (
                <>
                  <div className="text-sm text-gray-500 px-4 py-2 bg-gray-50/80 rounded-xl border border-gray-100">
                    Welcome back! 👋
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold group"
                  >
                    <span className="group-hover:scale-110 transition-transform">🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold group">
                    <span className="group-hover:scale-110 transition-transform">🔑</span>
                    <span>Login</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 border border-transparent hover:border-blue-100"
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
            <div className="lg:hidden py-6 border-t border-gray-200/80 animate-slideDown bg-white/95 backdrop-blur-xl rounded-2xl mt-2 shadow-lg">
              <div className="space-y-3">
                {token && navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold ${
                      isActiveRoute(link.path)
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-100"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                {token ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl transition-all duration-300 font-semibold hover:shadow-lg"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl transition-all duration-300 font-semibold hover:shadow-lg"
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

    {/* Premium Footer */}
       <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-200/80">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-32 h-12 rounded-xl overflow-hidden shadow-lg border border-gray-100/50">
                  <img
                    src="./logo.jpeg"
                    alt="TravelEase Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Your trusted partner for seamless bus travel experiences. 
                Book your journeys with confidence and travel with ease across the country.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🛡️</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6 flex items-center space-x-2">
                <span>🔗</span>
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-4 text-lg">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-2 inline-block">
                    Browse Buses
                  </Link>
                </li>
                {token && (
                  <li>
                    <Link
                      to="/bookings"
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-2 inline-block"
                    >
                      My Bookings
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/help-center" className="text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-2 inline-block">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6 flex items-center space-x-2">
                <span>💬</span>
                <span>Support</span>
              </h4>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <span className="font-medium">+91 6302543439</span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-green-600">✉️</span>
                  </div>
                  <span className="font-medium">pokanativipul@gmail.com</span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-purple-600">🕒</span>
                  </div>
                  <span className="font-medium">24/7 Support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200/80 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-500 text-lg font-medium">
              © {new Date().getFullYear()} TravelEase. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-6 lg:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    
  </div>
);

};

export default Wrapper;