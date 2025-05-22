const express = require('express');
const router = express.Router();
const Service = require("../models/services");
const auth = require('../middlewares/authmiddleware');
const User = require('../models/users');
const ServiceRequest = require('../models/request');
const { verifyToken } = require("../middlewares/authmiddleware");
const ServiceCategory = require("../models/serviceCatageroy"); // Import model
// const Request = require("../models/Request");
router.get("/quick-stats", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let stats = {};

    if (user.roles.includes("customer")) {
      const requests = await ServiceRequest.aggregate([
        { $match: { requestingUser: user._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      const totalRequests = await ServiceRequest.countDocuments({ requestingUser: user._id });
      const totalTypes = await ServiceRequest.distinct("services", { requestingUser: user._id });

      stats = {
        totalRequestsSent: totalRequests,
        totalTypes: totalTypes.length, // Fixing incorrect assignment
        pendingRequests: requests.find(r => r._id === "pending")?.count || 0,
        acceptedRequests: requests.find(r => r._id === "accepted")?.count || 0,
        completedRequests: requests.find(r => r._id === "completed")?.count || 0,
        cancelledRequests: requests.find(r => r._id === "cancelled")?.count || 0,
      };
    } else if (user.roles.includes("serviceProvider")) {
      const services = await Service.find({ user: user._id }).select("_id");
      const serviceIds = services.map(service => service._id);

      const serviceRequests = await ServiceRequest.aggregate([
        { $match: { service: { $in: serviceIds } } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      const totalServices = await ServiceRequest.countDocuments({ service: { $in: serviceIds } });
      const types = await ServiceRequest.distinct("services", { service: { $in: serviceIds } });

      stats = {
        totalServices,
        types: types.length, // Fixing incorrect assignment
        pendingRequests: serviceRequests.find(r => r._id === "pending")?.count || 0,
        acceptedRequests: serviceRequests.find(r => r._id === "accepted")?.count || 0,
        completedRequests: serviceRequests.find(r => r._id === "completed")?.count || 0,
        cancelledRequests: serviceRequests.find(r => r._id === "cancelled")?.count || 0,
      };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/user-requests", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const usersServices = await ServiceRequest.find({ requestingUser: userId }).populate("requestingUser", "fullName email phoneNumber").populate("agent", "fullName email phoneNumber")
    // console.log(usersServices)
    res.status(200).json(usersServices)

  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/requests", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // const usersServices = await ServiceRequest.find({ agent: userId }).populate("requestingUser", "fullName email phoneNumber")
    // console.log(usersServices)
    const requests = await ServiceRequest.find({agent: userId})
      .populate("requestingUser", "fullName email phoneNumber").populate("agent", "fullName email phoneNumber")

    res.status(200).json(requests)

  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
