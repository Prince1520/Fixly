const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    requestingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // User making the request
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    }, // Service being requested
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Selected Agent
    price: { type: Number }, // Price agreed for the service
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    }, // Current request status
    timeSlot: {
      start: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },
      end: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },
    }, // Scheduled service time
    moredetails: { type: String, default: "" }, // Additional instructions
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);
module.exports = Request;
