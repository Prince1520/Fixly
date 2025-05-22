import React from 'react';
import Header from './Header';
import HeaderSection from './HeaderSection';
import Footer from './Footer'; 
import Hero from './Hero';
import FAQAccordion from './FAQs';
import Services from './Services';
import Chatbot from './chatbot'; // ✅ Import Chatbot
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation(); // Get current route

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderSection />
      
      {/* Show Hero only on Home Page, otherwise show Services */}
      {location.pathname === '/' ? <Hero /> : <Services />}
      
      <FAQAccordion />
      <Footer />
      <Chatbot /> {/* ✅ Add Chatbot Component */}
    </div>
  );
};

export default Home;
