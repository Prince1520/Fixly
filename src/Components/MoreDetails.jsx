import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const MoreDetails = () => {
  const { selectedService } = useSelector((state) => state.services);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedService) return;

    const fetchAgentDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/auth/getagent",
          {
            agentIds: selectedService.agents,
            serviceId: selectedService._id,
          }
        );

        const formattedAgents = response.data.agents.map((agent) => ({
          id: agent.id,
          name: agent.name,
          startTime: agent.startTime,
          endTime: agent.endTime,
          availableTimeSlots: agent.availableTimeSlots,
        }));

        setSelectedData({
          ...selectedService,
          agents: formattedAgents,
          availableAgents: formattedAgents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            startTime: agent.startTime,
            endTime: agent.endTime,
          })),
        });
      } catch (error) {
        console.error("Error fetching agent details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [selectedService]);

  const handleSelect = (type, value) => {
    if (type === "selectedAgentId") {
      const selectedAgent = selectedData.agents.find(
        (agent) => agent.id === value
      );
      setSelectedData((prev) => ({
        ...prev,
        selectedAgentId: value,
        timeSlots: selectedAgent.availableTimeSlots,
        selectedTimeSlot: null,
      }));
    } else {
      setSelectedData((prev) => ({ ...prev, [type]: value }));
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedData?.selectedAgentId || !selectedData?.selectedTimeSlot) {
      alert("Please select an agent and a time slot!");
      return;
    }

    const bookingData = {
      serviceId: selectedData._id,
      agentId: selectedData.selectedAgentId,
      timeSlot: selectedData.selectedTimeSlot,
      price: selectedData.price,
    };

    console.log(`${actionType} Data:`, bookingData);

    if (actionType === "book") {
      try {
        const response = await axios.post(
          "http://localhost:3001/request/book-service",
          bookingData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          alert("Service booked successfully!");
        } else {
          alert("Booking failed! Try again.");
        }
      } catch (error) {
        console.error("Error booking service:", error);
        alert("Error booking service. Please try again.");
      }
    } else {
      dispatch(addToCart(selectedData));
      alert("Service added to cart successfully!");
    }
  };

  if (!selectedService)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No service selected</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading agent details...</p>
      </div>
    );

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Card with Fixed Dimensions */}
          <div className="w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden shadow-md">
            {selectedData?.image && (
              <div className="w-full h-full relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-pulse w-full h-full"></div>
                  </div>
                )}
                <img
                  src={selectedData.image}
                  alt={selectedData.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{selectedData.title}</h2>
            <p className="text-xl font-bold text-gray-600 mb-4">
              Price: ₹{selectedData.price}
            </p>
            <p className="text-gray-700 mb-6">{selectedData.description}</p>

            {selectedData.availableAgents?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Choose Your Service Provider:
                </h3>
                {selectedData.availableAgents.map((agent) => (
                  <button
                    key={agent.id}
                    className={`w-full text-left p-3 border rounded-lg mb-2 ${
                      selectedData.selectedAgentId === agent.id
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSelect("selectedAgentId", agent.id)}
                  >
                    <span className="font-medium">{agent.name}</span>
                    <span className="block text-sm text-gray-500">
                      Available: {agent.startTime} - {agent.endTime}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedData.selectedAgentId &&
              selectedData.timeSlots?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Choose Your Time Slot:
                  </h3>
                  {selectedData.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`w-full text-left p-3 border rounded-lg mb-2 ${
                        selectedData.selectedTimeSlot === slot
                          ? "bg-green-100 border-green-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleSelect("selectedTimeSlot", slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => handleAction("book")}
                className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 font-semibold"
              >
                🔥 Book Now
              </button>
              <button
                onClick={() => handleAction("cart")}
                className="w-1/2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 font-semibold"
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MoreDetails;
