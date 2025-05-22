const express = require("express");
const router = express.Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Service = require("../models/services");
dotenv.config();

// OTP Generator Function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Setup Nodemailer (For Email OTPs)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ 1. Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { fullName, username, email, mobile, roles } = req.body;

    if (!fullName || !username || (!email && !mobile)) {
      return res.status(400).json({ message: "Full Name and Email/Mobile are required" });
    }

    let user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (user) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    const otp = generateOTP();
    user = new User({
      fullName,
      username,
      email,
      mobile,
      roles,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60000),
    });

    await user.save();

    // Send OTP via Email
    if (email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Fixly Signup OTP",
          text: `Your OTP is ${otp}`,
        });
        console.log("OTP sent successfully via email");
      } catch (error) {
        console.error("Error sending OTP email:", error);
      }
    }

    return res.status(200).json({ message: "Signup successful. OTP sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ 2. Request OTP for Login
router.post("/request-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or Mobile is required" });
    }

    let user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60000); // OTP valid for 5 minutes
    await user.save();

    // Send OTP via Email
    if (email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Fixly Login OTP",
          text: `Your OTP is ${otp}`,
        });
        console.log("OTP sent successfully via email");
      } catch (error) {
        console.error("Error sending OTP email:", error);
      }
    }

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ 3. Verify OTP & Login
router.post("/login", async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;

    if (!otp && (!email || !mobile)) {
      return res.status(400).json({ message: "OTP and contact info required" });
    }

    let user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Clear OTP after successful login
    await User.updateOne({ _id: user._id }, { $set: { otp: null, otpExpires: null } });
    // user.otp = null;
    // user.otpExpires = null;
    // await user.save();

    res.status(200).cookie("token", token, { httpOnly: true }).json({ message: "Login successful!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/logout", async (req, res) => {

  try {
    return res.status(200).cookie("token", "").json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later'
    })
  }

})

router.post("/getagent", async (req, res) => {
  try {
    const { agentIds, serviceId } = req.body; // serviceId is now serviceCategory

    if (!Array.isArray(agentIds) || agentIds.length === 0) {
      return res.status(400).json({ error: "Invalid or empty agent IDs array" });
    }

    // Fetch agents' details (id, name)
    const agents = await User.find(
      { _id: { $in: agentIds } },
      { fullName: 1, _id: 1 } // Fetch only fullName and _id
    );

    if (!agents.length) {
      return res.status(404).json({ error: "No agents found" });
    }

    // Fetch services where serviceCategory matches and the agent is assigned
    const services = await Service.find({
      serviceCategory: serviceId,
      user: { $in: agentIds }, // Each service belongs to an agent
    });

    if (!services.length) {
      return res.status(404).json({ error: "No matching services found for these agents" });
    }

    // Function to generate 2-hour time slots
    const generateTimeSlots = (start, end) => {
      const slots = [];
      let startHour = parseInt(start.split(":")[0]);
      let endHour = parseInt(end.split(":")[0]);

      for (let hour = startHour; hour < endHour; hour += 1) {
        const nextHour = hour + 2;
        if (nextHour <= endHour) {
          slots.push(`${hour}:00 - ${nextHour}:00`);
        }
      }

      return slots;
    };

    // Prepare agent details with their specific time slots
    const agentDetails = agents.map((agent) => {
      const assignedService = services.find((service) =>
        service.user.equals(agent._id)
      );

      if (!assignedService) {
        return {
          id: agent._id,
          name: agent.fullName,
          availableTimeSlots: [],
        };
      }

      const { start, end } = assignedService.time;

      return {
        id: agent._id,
        name: agent.fullName,
        startTime: start,
        endTime: end,
        availableTimeSlots: generateTimeSlots(start, end),
      };
    });

    return res.json({ agents: agentDetails });
  } catch (error) {
    console.error("Error fetching agent details and time slots:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
