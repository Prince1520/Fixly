import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const links = [];
const stats = [
  { name: "Service", value: "10 Mins" },
  { name: "Tracking", value: "Real-Time" },
  { name: "Services", value: "On-Demand" },
  { name: "Booking", value: "Instant" },
];

export default function HeaderSection() {
  const [location, setLocation] = useState("Kanpur");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);

  const handleSearch = async () => {
    const fullQuery = `${searchQuery} in ${location}`;

    try {
      const response = await fetch("http://localhost:3001/services/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: fullQuery }),
      });

      const data = await response.json();
      setFilteredShops(data);
    } catch (error) {
      console.error("Error fetching filtered services:", error);
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-80% w-screen py-24 sm:py-32">
      <img
        alt=""
        src="https://ukcleaningsupplies.co.uk/wp-content/uploads/2023/05/blue-cleaning-supplies-1024x683.webp"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-50 blur-xs"
      />

      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto text-center lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Welcome to Fixly!
          </h2>
          <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">
            Reliable home services at your doorstep—fast, efficient, and hassle-free.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center bg-white rounded-md shadow-md p-2 w-full max-w-2xl">
            <div className="flex items-center px-4">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <select
                className="bg-transparent text-gray-700 font-medium focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Kanpur">Kanpur</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            <div className="border-l border-gray-300 h-6 mx-2"></div>

            <input
              type="text"
              placeholder="Search for services..."
              className="w-full px-2 py-1 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {filteredShops.length > 0 && (
  <div className="mt-10 text-center text-white">
    <h3 className="text-2xl font-bold mb-6">Search Results</h3>
    <div className="flex flex-wrap justify-center gap-6 px-6">
      {filteredShops.map((shop, index) =>
        shop.providerNames?.length > 0 ? (
          shop.providerNames.map((provider, providerIndex) => (
            <a 
              key={`${index}-${providerIndex}`} 
              href={`/moredetails/${shop._id}`} 
              className="block bg-white w-64 rounded-lg shadow-lg p-4 transition transform hover:scale-105 hover:shadow-xl text-center"
            >
              <h4 className="text-lg font-semibold text-gray-800">{shop.serviceName}</h4>
              <p className="text-sm text-gray-600 mt-2">Provided by: {provider}</p>
            </a>
          ))
        ) : (
          <div 
            key={index} 
            className="block bg-white w-64 rounded-lg shadow-lg p-4 text-center"
          >
            <h4 className="text-lg font-semibold text-gray-800">{shop.serviceName}</h4>
            <p className="text-sm text-gray-600 mt-2">No providers available</p>
          </div>
        )
      )}
    </div>
  </div>
)}

<div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-300">{stat.name}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}