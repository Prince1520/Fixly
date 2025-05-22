import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  PlusCircleIcon,
  UserIcon,
  CogIcon,
  ListBulletIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png";

const ServiceManagementDashboard = () => {
  const [bookedServices, setBookedServices] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const { topServices, featuredServices, homeServices, loading } = useSelector(
    (state) => state.services
  );

  // Sidebar menu items
  const sidebarMenuItems = [
    {
      icon: <FaHome className="text-xl" />,
      label: "Home",
      to: "/",
    },
    {
      icon: <ListBulletIcon className="h-8 w-8" />,
      label: "Dashboard",
      to: "/dashboard",
      active: true,
    },
    {
      icon: <FaUserCircle className="text-xl" />,
      label: "Profile",
      to: "/profile",
    },
    {
      icon: <span className="text-xl">💼</span>,
      label: "Add Services",
      to: "/addservices",
    },
  ];

  // Determine the view based on user's first role
  const isServiceProvider = user?.roles?.includes("serviceProvider");

  // Function to find service title
  const findServiceTitle = (serviceId) => {
    const allServices = [...topServices, ...featuredServices, ...homeServices];
    const serviceIdString = serviceId.toString();
    const matchedService = allServices.find(
      (service) => service._id.toString() === serviceIdString
    );
    return matchedService ? matchedService.title : "N/A";
  };

  // Fetch data from API
  const fetchRequests = async () => {
    try {
      const endpoint = isServiceProvider
        ? "http://localhost:3001/dashboard/requests"
        : "http://localhost:3001/dashboard/user-requests";
      const response = await axios.get(endpoint, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookedServices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  // Handle status change for service provider
  const handleStatusChange = async (id, newStatus) => {
    const Status = newStatus.toLowerCase();
    try {
      await axios.put(
        `http://localhost:3001/request/update-status`,
        { status: Status, serviceid: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Format time slot
  const formatTimeSlot = (timeSlot) => {
    if (
      timeSlot &&
      typeof timeSlot === "object" &&
      timeSlot.start &&
      timeSlot.end
    ) {
      return `${timeSlot.start} - ${timeSlot.end}`;
    }
    return timeSlot || "N/A";
  };

  // Render nothing if no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-xl text-gray-600">Please log in to view services</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Bar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-800">Account</h2>
          </div>
          <nav>
            <ul className="space-y-2">
              {sidebarMenuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-colors
                      ${
                        item.active
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  // Add logout handler if needed
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-700 flex items-center">
              {isServiceProvider ? (
                <ListBulletIcon className="mr-3 h-8 w-8" />
              ) : (
                <UserIcon className="mr-3 h-8 w-8" />
              )}
              {isServiceProvider ? "Service Requests" : "My Services"}
            </h1>
          </div>

          {isServiceProvider ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                Incoming Service Requests
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="p-3 text-left">Requested By</th>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-center">Time Slot</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedServices.map((service) => (
                    <tr key={service._id} className="border-b">
                      <td className="p-3 text-left">
                        {service.requestingUser?.fullName || "Unknown User"}
                      </td>
                      <td className="p-3 text-left">
                        {findServiceTitle(service.service)}
                      </td>
                      <td className="p-3 text-left">
                        ₹{service.price || "N/A"}
                      </td>
                      <td className="p-3 text-center">
                        {formatTimeSlot(service.timeSlot)}
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={service.status}
                          onChange={(e) =>
                            handleStatusChange(service._id, e.target.value)
                          }
                          className="border rounded p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Approved</option>
                          <option value="completed">Rejected</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                My Booked Services
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Service Provider</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-center">Time Slot</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedServices.map((service) => (
                    <tr key={service._id} className="border-b">
                      <td className="p-3 text-left">
                        {findServiceTitle(service.service)}
                      </td>
                      <td className="p-3 text-left">
                        {service.agent?.fullName || "N/A"}
                      </td>
                      <td className="p-3 text-left">
                        ₹{service.price || "N/A"}
                      </td>
                      <td className="p-3 text-center">
                        {formatTimeSlot(service.timeSlot)}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                            service.status === "Accepted"
                              ? "bg-green-100 text-green-600"
                              : service.status === "Pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : service.status === "Completed"
                                  ? "bg-blue-100 text-blue-600"
                                  : service.status === "cancelled"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceManagementDashboard;
