import React from 'react';
import Header from './Header';
import Footer from './Footer'; 
import Chatbot from './chatbot'; // ✅ Import Chatbot
import FeedbackForm from './FeedbackForm'; // ✅ Import FeedbackForm

const FeedbackPage = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <FeedbackForm/>
      <Footer />
      <Chatbot /> {/* ✅ Add Chatbot Component */}
    </div>
  );
};

export default FeedbackPage;
