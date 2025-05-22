const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  issueType: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, default: "Not provided" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
