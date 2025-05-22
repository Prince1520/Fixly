const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/request"); // Updated model import
const User = require("../models/users");
const { verifyToken } = require("../middlewares/authmiddleware");


// 📌 Get all requests made by a user
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ requestingUser: req.user.id })
      .populate("service", "name type");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Book a service with an agent


// Function to format time to HH:mm
const formatTime = (time) => {
  const [hour, minute] = time.split(":").map((num) => num.padStart(2, "0")); // Ensures 2-digit format
  return `${hour}:${minute}`;
};

router.post("/book-service", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { agentId, serviceId, price, timeSlot, moredetails } = req.body;

    if (!userId || !serviceId || !agentId || !timeSlot) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate and format timeSlot
    const timeParts = timeSlot.split(" - ");
    if (timeParts.length !== 2) {
      return res.status(400).json({ success: false, message: "Invalid time slot format" });
    }

    let [start, end] = timeParts;
    start = formatTime(start.trim());
    end = formatTime(end.trim());

    // Ensure correct format before saving
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm format
    if (!timeRegex.test(start) || !timeRegex.test(end)) {
      return res.status(400).json({ success: false, message: "Invalid time format. Use HH:mm (e.g., 07:00 - 09:00)" });
    }

    const newRequest = new ServiceRequest({
      requestingUser: userId,
      service: serviceId,
      agent: agentId,
      price,
      timeSlot: { start, end }, // Save formatted time
      moredetails,
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: "Service request created successfully!", request: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// 📌 Update service request status
router.put("/update-status", verifyToken, async (req, res) => {
  try {
    const { status, serviceid } = req.body;
    // console.log("Request body:", req.body);
    if (!["pending", "accepted", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const request = await ServiceRequest.findByIdAndUpdate(serviceid, { status }, { new: true });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Status updated successfully", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
