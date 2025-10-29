import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Terms of Service</h1>
      <p className="text-gray-600 mb-6">
        Welcome to <strong>TravelEase</strong>. By using our website and services, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mb-2">1. Booking Policy</h2>
      <p className="text-gray-600 mb-4">
        All bookings made through TravelEase are final. Please ensure your details are correct before confirming a booking.
      </p>

      <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
      <p className="text-gray-600 mb-4">
        You agree not to misuse the platform, attempt unauthorized access, or engage in fraudulent activities.
      </p>

      <h2 className="text-xl font-semibold mb-2">3. Cancellations & Refunds</h2>
      <p className="text-gray-600 mb-4">
        Refunds and cancellations are subject to the policies of the respective bus operators.
      </p>

      <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
      <p className="text-gray-600 mb-4">
        TravelEase is not liable for delays, cancellations, or damages caused by third-party operators or force majeure events.
      </p>

      <p className="text-gray-600">
        For questions, please contact us at{" "}
        <span className="font-medium text-blue-600">pokanativipul@gmail.com</span>.
      </p>
    </div>
  );
};

export default TermsOfService;