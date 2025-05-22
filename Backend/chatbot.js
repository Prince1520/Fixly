const express = require("express");
const router = express.Router();
const axios = require("axios");
const Request = require("./models/request"); // Request model import
const User = require("./models/users"); // User model import

// Predefined knowledge base
const knowledgeBase = {
  "select a service":
    "Fixly offers plumbing, electrical, cleaning, and home repair services. Which one do you need?",
  "ask about refund policy":
    "Fixly provides full refunds for cancellations within 24 hours. Partial refunds may apply after that.",
  "how to book a service":
    "Search for a service, choose a provider, and confirm your booking online.",
  "contact support": "You can contact Fixly support via the website's Contact page.",
  "what is fixly":
    "Fixly connects you with trusted home service providers for repairs and maintenance.",
  "how does fixly work":
    "Fixly helps you search, compare, and book services with verified professionals.",
  "are fixly professionals verified":
    "Yes, all Fixly service providers go through a verification process.",
};

// Main chatbot options
const mainOptions = [
  "Select a service",
  "Ask about refund policy",
  "How to book a service?",
  "Contact support",
  "Ask about previous orders",
];

// Function to generate AI response using OpenAI API
async function getAIResponse(query) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  console.log("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Keep answers brief (3 lines max).",
          },
          { role: "user", content: query },
        ],
        max_tokens: 60,
      },
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` },
      }
    );

    console.log("OpenAI API Response:", response.data); // 🔍 Log the API response

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error getting AI response:", error.message); // Keep this for error logs
    return "I couldn't process that right now. Try again later.";
  }
}


// Chatbot route
router.post("/", async (req, res) => {

  const userMessage = req.body.message.toLowerCase();
  const userEmail = req.body.email; // Passed from frontend
  let response = "";
  let options = mainOptions;

  if (userMessage.includes("ask something else")) {
    response = "Sure! What would you like to know?";
  } else if (userMessage.includes("no, i'm done") || userMessage.includes("no i'm done")) {
    return res.json({
      response: "Alright! Let me know if you need help anytime. 😊",
      options: [],
    });
  }
  // ✅ Fetching "Pending" and Other Orders
  else if (userMessage.includes("previous order")) {
    if (!userEmail) {
      response = "Please log in to view your previous orders.";
      options = ["Ask something else", "No, I'm done"];
    } else {
      try {
        // Fetch user by email and orders tied to that user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
          response = "No user found with this email. Please check your login.";
        } else {
          const orders = await Request.find({ requestingUser: user._id })
            .populate({
              path: "service",
              select: "name user",
              populate: { path: "user", select: "name" },
            })
            .sort({ createdAt: -1 })
            .limit(5);

          console.log("Fetched Orders with Populated Data:", JSON.stringify(orders, null, 2));

          if (orders.length > 0) {
            response =
              "Here are your recent service requests:\n" +
              orders
                .map(
                  (order) =>
                    `Service: ${
                      order.service?.name || order.service?.user?.name || "N/A"
                    }, Date: ${new Date(order.createdAt).toDateString()}, Status: ${order.status}`
                )
                .join("\n");
          } else {
            response = "You don't have any previous orders yet.";
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        response = "I couldn't fetch your orders right now. Please try again later.";
      }
      options = ["Ask something else", "No, I'm done"];
    }
  }
  // Check knowledge base if no response so far
  if (!response) {
    const knowledgeResponse = Object.keys(knowledgeBase).find((key) =>
      userMessage.includes(key)
    );
    if (knowledgeResponse) {
      response = knowledgeBase[knowledgeResponse];
    } else {
      // Fallback to GPT response if no match in knowledge base
      response = await getAIResponse(userMessage);
    }
    options = ["Ask something else", "No, I'm done"];
  }

  // Send the chatbot response
  res.json({ response, options });
});

module.exports = router;
