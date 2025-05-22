const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  loc: { type: String, required: true },
  reminder: { type: Boolean, default: false },
  time: {
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
  },

}, { timestamps: true });

// Prevent model re-compilation error
const ServiceRequest = mongoose.models.Services || mongoose.model("Services", ServiceSchema)
// const ServiceRequest = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

module.exports = ServiceRequest;
