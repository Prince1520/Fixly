import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import { fetchServices } from "../redux/servicesSlice"; // Adjust import path as needed

const AddService = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  // Combine all services from different categories
  const homeServices = useSelector((state) => state.services.homeServices);
  const topServices = useSelector((state) => state.services.topServices);
  const featuredServices = useSelector(
    (state) => state.services.featuredServices
  );
  const loading = useSelector((state) => state.services.loading);

  // Combine services with both title and ID
  const allServices = [...homeServices, ...topServices, ...featuredServices];

  // Remove duplicate services based on ID
  const uniqueServices = Array.from(
    new Map(allServices.map((service) => [service._id, service])).values()
  );

  const [serviceData, setServiceData] = useState({
    loc: "",
    serviceId: "",
    reminder: false,
    startTime: "",
    endTime: "",
  });

  // Fetch services when component mounts
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceData({
      ...serviceData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    try {
      const formattedData = {
        ...serviceData,
        startTime: serviceData.startTime, // Already in HH:mm format
        endTime: serviceData.endTime, // Already in HH:mm format
        // userId,
      };
      console.log(formattedData);

      const response = await axios.post(
        "http://localhost:3001/services/add",
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      alert("Service added successfully!");
      setServiceData({
        loc: "",
        serviceId: "",
        reminder: false,
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Render loading state while fetching services
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <p className="text-center text-gray-600">Loading services...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add Service
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <select
              name="loc"
              value={serviceData.loc}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kanpur">Kanpur</option>
            </select>
          </div>
          {/* Service Type - Dropdown from Redux Store */}
          <div>
            <label className="block text-gray-700 font-medium">
              Service Type
            </label>
            <select
              name="serviceId"
              value={serviceData.serviceId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Service Type</option>
              {uniqueServices.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>

          {/* Time Slots in a Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={serviceData.startTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={serviceData.endTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Reminder */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="reminder"
              checked={serviceData.reminder}
              onChange={handleChange}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-gray-700 font-medium">
              Set Reminder
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Service
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddService;
