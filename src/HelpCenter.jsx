import React from "react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Help Center</h1>
      <p className="text-gray-600 mb-8">
        Need assistance? We're here to help you with bookings, payments, and travel queries.
      </p>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">🚌 Booking Assistance</h2>
          <p className="text-gray-600 mb-2">
            You can easily browse and book buses using our intuitive interface. 
            Make sure to review seat availability and timings before confirming.
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            Browse Buses →
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">💳 Payment Issues</h2>
          <p className="text-gray-600">
            If your payment failed or got deducted without a booking confirmation, contact our support team with your transaction details.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📞 Contact Support</h2>
          <ul className="text-gray-600">
            <li>Email: <span className="text-blue-600 font-medium">pokanativipul@gmail.com</span></li>
            <li>Phone: <span className="text-blue-600 font-medium">+91 6302543439</span></li>
            <li>Support Hours: 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
