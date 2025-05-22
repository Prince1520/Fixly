const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authmiddleware");
const User = require("../models/users");
const Service = require("../models/services");
const ServiceCategory = require("../models/serviceCatageroy"); // ✅ Fixed typo

// Add a new service
router.post("/add", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is not a service provider, add the role
    if (!user.roles.includes("serviceProvider")) {
      await User.findByIdAndUpdate(userId, { $addToSet: { roles: "serviceProvider" } });
    }

    const { loc, serviceId, reminder, startTime, endTime } = req.body;

    if (!loc || !serviceId || !startTime || !endTime) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: "Invalid time format. Use HH:mm" });
    }

    // Find service category containing the given serviceId
    let serviceCategory = await ServiceCategory.findOne({
      $or: [
        { "services._id": serviceId },
        { "featuredServices._id": serviceId },
        { "homeServices._id": serviceId },
      ],
    });

    if (!serviceCategory) {
      return res.status(400).json({ message: "No such service category found" });
    }

    // Function to add userId to the agents list of a service
    const addAgentToService = (serviceArray) => {
      const serviceIndex = serviceArray?.findIndex((service) => service._id.toString() === serviceId);
      if (serviceIndex !== -1) {
        if (!Array.isArray(serviceArray[serviceIndex].agents)) {
          serviceArray[serviceIndex].agents = [];
        }

        if (!serviceArray[serviceIndex].agents.includes(userId)) {
          serviceArray[serviceIndex].agents.push(userId);
        }
      }
    };

    // Add user to respective service category
    addAgentToService(serviceCategory.homeServices);
    addAgentToService(serviceCategory.services);
    addAgentToService(serviceCategory.featuredServices);

    await serviceCategory.save();

    // Create a new service request
    const newService = new Service({
      user: userId,
      serviceCategory: serviceId,
      loc,
      reminder,
      time: { start: startTime, end: endTime }, // Store time as string
    });

    await newService.save();

    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get all services for a user
router.get("/my-services", verifyToken, async (req, res) => {
  try {
    const services = await Service.find({ user: req.user.id }).populate("user", "name email");
    if (!services.length) {
      return res.status(404).json({ message: "No services found" });
    }
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
