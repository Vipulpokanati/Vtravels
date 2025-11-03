import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://travels-nkfu.onrender.com/api/buses/";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({
    bus_name: "",
    bus_number: "",
    origin: "",
    destination: "",
    features: "",
    start_time: "",
    end_time: "",
    no_of_seats: "",
    price: "",
  });

  const fetchBuses = async () => {
    const res = await axios.get(API_URL);
    setBuses(res.data);
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, form);
    setForm({
      bus_name: "",
      bus_number: "",
      origin: "",
      destination: "",
      features: "",
      start_time: "",
      end_time: "",
      no_of_seats: "",
      price: "",
    });
    fetchBuses();
  };

  const deleteBus = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
    fetchBuses();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Bus Management</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-6">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key.includes("time") ? "time" : "text"}
            placeholder={key.replaceAll("_", " ")}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="border p-2 rounded"
            required
          />
        ))}
        <button className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Bus
        </button>
      </form>

      <div className="grid gap-4">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">
                {bus.bus_name} ({bus.bus_number})
              </h3>
              <p className="text-gray-600">
                {bus.origin} → {bus.destination}
              </p>
            </div>
            <button
              onClick={() => deleteBus(bus.id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusManagement;

