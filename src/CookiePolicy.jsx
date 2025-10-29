import React from "react";

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Cookie Policy</h1>
      <p className="text-gray-600 mb-6">
        This Cookie Policy explains how <strong>TravelEase</strong> uses cookies and similar technologies to improve your browsing experience.
      </p>

      <h2 className="text-xl font-semibold mb-2">1. What Are Cookies?</h2>
      <p className="text-gray-600 mb-4">
        Cookies are small text files stored on your device that help us remember your preferences and improve site functionality.
      </p>

      <h2 className="text-xl font-semibold mb-2">2. How We Use Cookies</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li>To keep you logged in during sessions.</li>
        <li>To analyze site traffic and improve performance.</li>
        <li>To personalize your user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">3. Managing Cookies</h2>
      <p className="text-gray-600 mb-4">
        You can disable cookies in your browser settings, but some parts of the website may not function properly without them.
      </p>
    </div>
  );
};

export default CookiePolicy;
