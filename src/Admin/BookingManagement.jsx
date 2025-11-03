import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("https://travels-nkfu.onrender.com/api/bookings/")
      .then((res) => setBookings(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-gray-600">User</th>
              <th className="p-3 text-left text-gray-600">Bus</th>
              <th className="p-3 text-left text-gray-600">Seat</th>
              <th className="p-3 text-left text-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.user.username}</td>
                <td className="p-3">{b.bus.bus_name}</td>
                <td className="p-3">{b.seat.seat_number}</td>
                <td className="p-3">{new Date(b.booking_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;

