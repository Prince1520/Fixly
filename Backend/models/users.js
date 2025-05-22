const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  otp: { type: String },
  otpExpires: { type: Date },
  roles: { type: [String], enum: ["customer", "serviceProvider"], default: "customer" },
  googleId: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("User", UserSchema);
