import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Chatbot from './Components/Chatbot';

function App() {
  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
