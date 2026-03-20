const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Viz = require("../models/vizModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1️⃣ Fetch user using email from JWT
    const user = await User.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // 2️⃣ Fetch all visualizations created by this user
    const visualizations = await Viz.find({
      userEmail: decoded.email,
    }).sort({ createdAt: -1 });

    // 3️⃣ Send combined response
    res.json({
      status: true,
      user,
      visualizations,
      totalVisualizations: visualizations.length,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
