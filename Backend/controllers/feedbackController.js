const Feedback = require("../models/feedbackmodel");  // Import Mongoose model

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const { issueType, fullName, email, mobile, message } = req.body;

    if (!issueType || !fullName || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newFeedback = new Feedback({ issueType, fullName, email, mobile, message });
    await newFeedback.save();  // Save to MongoDB

    return res.status(201).json({ success: true, message: "Feedback submitted", data: newFeedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();  // Fetch from MongoDB
    return res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    return res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    return res.status(200).json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
