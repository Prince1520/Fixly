import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [options, setOptions] = useState([
    "Select a service",
    "Ask about refund policy",
    "How to book a service?",
    "Contact support",
    "Ask about previous orders",
  ]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const messagesEndRef = useRef(null);

  // Retrieve user email from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserEmail(parsedUser.email);
      console.log("User email retrieved:", parsedUser.email);
    } else {
      console.log("No user data found in localStorage");
    }
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    console.log("Sending message:", message);
    console.log("Sending userEmail:", userEmail || "No email found");

    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    const emailToSend = userEmail || JSON.parse(localStorage.getItem("user"))?.email || "";

    try {
      const response = await axios.post("http://localhost:3001/chat", {
        message,
        email: emailToSend,
      });

      // Modify response to show Service1, Service2 instead of N/A
      const modifiedResponse = response.data.response.replace(/N\/A/g, (match, index) => `Service${index + 1}`);

      setMessages((prev) => [
        ...prev,
        { text: modifiedResponse, sender: "bot" },
      ]);
      setOptions(response.data.options || []);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to chatbot.", sender: "bot" },
      ]);
    }

    setInput("");
  };

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="text-4xl bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer hover:bg-indigo-700 transition-all"
        onClick={() => setShowChat(!showChat)}
      >
        💬
      </div>

      {showChat && (
        <div className="fixed bottom-24 right-4 w-80 bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Fixly Chatbot</h3>
            <button
              className="text-xl font-bold"
              onClick={() => setShowChat(false)}
            >
              ✖
            </button>
          </div>

          <div className="p-4 flex-grow overflow-y-auto max-h-96 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg w-fit max-w-[70%] ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-gray-800 self-start"
                    : "bg-indigo-500 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 grid grid-cols-2 gap-2 border-t">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 transition"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex border-t p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              className="flex-grow border rounded-l-md px-3 py-2 focus:outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
