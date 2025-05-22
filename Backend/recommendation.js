import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Request from './models/request.js'; // Import the Request model
import Service from './models/services.js'; // Import the Service model
import ServiceCategory from './models/serviceCatageroy.js'; // Import ServiceCategory model
import User from './models/users.js'; // Import User model

dotenv.config();
const router = express.Router();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// API Endpoint: Get Recommendations
router.get('/recommendations', async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required." });
  }

  try {
    // Find the user's past requests
    const userRequests = await Request.find()
      .populate({
        path: 'requestingUser',
        match: { email: userEmail },
        select: '_id'
      })
      .populate({
        path: 'service',
        select: 'title serviceCategory price'
      })
      .populate({
        path: 'agent',
        select: 'fullName' // Fetch provider name
      })
      .lean(); // Optimize query

    // Filter out any requests where user is null (no match found)
    const userOrders = userRequests.filter(req => req.requestingUser);

    if (!userOrders.length) {
      return res.status(404).json({ error: "No past orders found for this user." });
    }

    // Fetch top-rated providers (from ServiceCategory model)
    const providers = await ServiceCategory.find().select('title featuredServices homeServices').lean();

    // Prepare OpenAI prompt
    const prompt = `
      You are a smart recommendation assistant.
ONLY return a JSON array of recommendations. DO NOT include any extra text or explanations.

      Below is the user's past order history:
      ${JSON.stringify(userOrders, null, 2)}

      Below is the list of top-rated service providers:
      ${JSON.stringify(providers, null, 2)}

      Your task:
      - Recommend 3 services that the user is likely to need now.
      - Recommend services based on:
        - Periodic needs (e.g., AC servicing every 6 months).
        - Complementary services (e.g., after sofa cleaning, suggest deep cleaning).
        - Discounts preference if they have used discounts frequently.
        - Seasonal recommendations (e.g., pest control before monsoon).
        - Do NOT recommend services done in the last 3 months.
      - Suggest a provider based on:
        - User's past preferences (if they rated a provider 4+ stars).
        - If no past provider, suggest the highest-rated provider.

      Return recommendations in this JSON format strictly:
      [
        {
          "service": "",
          "reason": "",
          "suggested_offer": "",
          "suggested_provider": ""
        }
      ]
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a recommendation assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected OpenAI Response:", data);
      return res.status(500).json({ error: "Invalid response from AI model." });
    }

    let aiResponse = data.choices[0]?.message?.content?.trim();
    console.log("Raw OpenAI Response:", aiResponse); // Debugging

    let recommendations;
    try {
      // Ensure the response is valid JSON
      recommendations = JSON.parse(aiResponse);
      console.log("✅ Parsed AI Recommendations:", recommendations);
    } catch (error) {
      console.error("❌ Error parsing OpenAI response:", error.message);
      console.error("❗ AI Response was:", aiResponse);
      return res.status(500).json({
        error: "Failed to parse AI recommendations.",
        rawResponse: aiResponse
      });
    }

    // ✅ Replace provider ID with actual provider names
    const providerIds = recommendations.map(r => r.suggested_provider);
    const providerDetails = await User.find({ _id: { $in: providerIds } }).select("fullName").lean();

    // Create a mapping of ObjectId → fullName
    const providerMap = {};
    providerDetails.forEach(provider => {
      providerMap[provider._id.toString()] = provider.fullName;
    });

    // Update recommendations to show provider names instead of ObjectIds
    recommendations = recommendations.map(r => ({
      ...r,
      suggested_provider: providerMap[r.suggested_provider] || "N/A" // Default to "N/A" if provider not found
    }));

    console.log("✅ Final Recommendations with Provider Names:", recommendations);
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
});

export default router;
