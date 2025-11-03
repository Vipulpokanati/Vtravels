import React, { useEffect, useState } from "react";
import axios from "axios";

const SeatManagement = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    axios.get("https://travels-nkfu.onrender.com/api/buses/").then((res) => setBuses(res.data));
  }, []);

  const toggleSeat = async (busId, seat) => {
    await axios.put(`https://travels-nkfu.onrender.com/api/seats/${seat.id}/`, {
      ...seat,
      is_available: !seat.is_available,
    });
    const updatedBuses = await axios.get("https://travels-nkfu.onrender.com/api/buses/");
    setBuses(updatedBuses.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Seat Management</h2>
      {buses.map((bus) => (
        <div key={bus.id} className="bg-white p-4 mb-6 shadow rounded">
          <h3 className="font-semibold mb-3">{bus.bus_name}</h3>
          <div className="flex flex-wrap gap-2">
            {bus.seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => toggleSeat(bus.id, seat)}
                className={`px-3 py-2 rounded text-sm ${
                  seat.is_available
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {seat.seat_number}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatManagement;
