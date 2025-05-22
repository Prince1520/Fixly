const express = require("express");
const router = express.Router();
const ServiceCategory = require("../models/serviceCatageroy"); // Import model
const User = require("../models/users");
// Get all service categories and extract specific services
router.get("/", async (req, res) => {
    try {
        // Fetch the first (or only) ServiceCategory document
        const serviceCategory = await ServiceCategory.findOne()
        // const user = await User.findById(user)
        if (!serviceCategory) {
            return res.status(404).json({ error: "No service categories found" });
        }

        // Extract services from the document
        const topServices = serviceCategory.services || [];
        const featuredServices = serviceCategory.featuredServices || [];
        const homeServices = serviceCategory.homeServices || [];

        // console.log("Top Services:", topServices);
        // console.log("Featured Services:", featuredServices);
        // console.log("Home Services:", homeServices);

        res.status(200).json({ topServices, featuredServices, homeServices });
    } catch (error) {
        console.error("Error fetching service categories:", error);
        res.status(500).json({ error: "Failed to fetch service categories" });
    }
});

module.exports = router;