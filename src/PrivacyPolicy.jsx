import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">
        At <strong>TravelEase</strong>, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website or services.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
      <p className="text-gray-600 mb-4">
        We may collect your name, contact details, booking history, and payment information to provide a seamless travel booking experience.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li>To process your bookings and payments securely.</li>
        <li>To communicate important updates regarding your travel.</li>
        <li>To improve our services and personalize your experience.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Data Security</h2>
      <p className="text-gray-600 mb-4">
        We implement advanced encryption and security measures to ensure your information remains safe and protected from unauthorized access.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Contact Us</h2>
      <p className="text-gray-600">
        If you have any questions about our Privacy Policy, contact us at{" "}
        <span className="font-medium text-blue-600">pokanativipul@gmail.com</span>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
