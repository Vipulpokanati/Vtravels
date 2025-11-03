import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminWrapper = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Buses", path: "/admin/buses" },
    { name: "Seats", path: "/admin/seats" },
    { name: "Bookings", path: "/admin/bookings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-blue-600">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-md font-medium ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminWrapper;
