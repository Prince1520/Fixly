require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const filterServicesWithAI = require("./filterServices");
const ServiceCategory = require("./models/serviceCatageroy"); // ✅ Fixed typo
const recommendationsRouter = require("./recommendation").default;



// Route imports
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apiroutes");
const serviceRequestRoutes = require("./routes/request");
const addServicesRoutes = require("./routes/services");
const dashboardRoutes = require("./routes/dashboard");
const serviceCategoryRoutes = require("./routes/serviceCategory");
const chatbotRoutes = require("./chatbot");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const PORT = 3001;

// Allowed CORS origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", recommendationsRouter);

// Connect to Database
connectDB();

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/request", serviceRequestRoutes);
app.use("/services", addServicesRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/service-category", serviceCategoryRoutes);
app.use("/chat", chatbotRoutes);

// 📌 Get all service categories (Fixed)
app.get("/api/service-categories", async (req, res) => {
  try {
    const serviceCategories = await ServiceCategory.find().populate("services.agents", "name rating");
    res.status(200).json(serviceCategories);
  } catch (error) {
    console.error("Error fetching service categories:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 AI-based Service Filter Endpoint (Improved error handling)
app.post("/services/filter", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const filteredServices = await filterServicesWithAI(query);
    res.json(
      filteredServices.length
        ? filteredServices
        : [{ name: "No results found", rating: "N/A" }]
    );
  } catch (error) {
    console.error("Error filtering services:", error);
    res.status(500).json({ message: "AI service filtering failed" });
  }
});

// 📌 AI-Based Recommendations Endpoint (NEW)
app.get("/api/recommendations", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    
    const recommendations = await getRecommendations(email).populate('suggested_provider', 'fullName');

 // Fetch recommendations based on email
    res.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//feedback routes
app.use('/feedback', feedbackRoutes);

// 📌 Health check routes
app.get("/", (req, res) => {
  res.send("Fixly Node.js server is running!");
});

app.get("/test", (req, res) => {
  res.send("API is working!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
