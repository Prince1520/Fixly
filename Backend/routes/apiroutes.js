const express = require("express");
const router = express.Router();

// Sample GET route
router.get("/hello", (req, res) => {
  res.json({ message: "Hello from Fixly API!" });
});

// Sample POST route
router.post("/data", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Received data for ${name}` });
});

module.exports = router;
