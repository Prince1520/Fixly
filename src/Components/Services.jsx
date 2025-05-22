import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, selectService } from "../redux/servicesSlice";
import Footer from "./Footer";
import Header from "./Header";
import { Star, Home, Scissors } from "lucide-react";

const ServiceCard = ({ service }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleServiceClick = () => {
    dispatch(selectService(service));
    navigate(`/moredetails/${service._id}`);
  };

  return (
    <div
      onClick={handleServiceClick}
      className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3rem] text-gray-800 group-hover:text-gray-900 transition-colors">
            {service.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">
              ₹{service.price}
            </span>
            <div className="flex items-center text-yellow-600">
              <Star className="w-5 h-5 mr-1" fill="currentColor" />
              <span className="text-sm text-gray-600">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const dispatch = useDispatch();
  const { topServices, featuredServices, homeServices, loading } = useSelector(
    (state) => state.services
  );

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-gray-700">
            Loading Services...
          </p>
        </div>
      </div>
    );
  }

  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center mb-4">
        <Icon className="w-10 h-10 text-gray-700 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="w-20 h-1 bg-gray-700 mx-auto rounded"></div>
    </div>
  );

  const renderServiceSection = (services, title, icon) => {
    if (!services || services.length === 0) {
      return (
        <div className="flex justify-center items-center py-12">
          <p className="text-xl text-gray-500">No {title} available</p>
        </div>
      );
    }

    // Determine grid classes based on number of services
    const gridClasses =
      services.length < 5
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center"
        : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

    return (
      <>
        <SectionHeader title={title} icon={icon} />
        <div className={`gap-6 mb-12 mx-auto max-w-7xl ${gridClasses}`}>
          {services.map((service) => (
            <div key={service._id} className="flex justify-center">
              <div className="w-full max-w-[250px]">
                <ServiceCard service={service} />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Top Services */}
        {renderServiceSection(topServices, "Top Services", Star)}

        {/* Salon, Spa, and Massage Services */}
        {renderServiceSection(
          featuredServices,
          "Salon, Spa, and Massage Services",
          Scissors
        )}

        {/* Home Services */}
        {renderServiceSection(homeServices, "Home Services", Home)}
      </div>
      <Footer />
    </div>
  );
};

export default Services;