import React from "react";

const DashBoard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Buses</h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Bookings</h3>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Available Seats</h3>
          <p className="text-3xl font-bold text-yellow-600">--</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
