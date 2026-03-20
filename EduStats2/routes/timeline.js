const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel");

// GET timeline for a user
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const visualizations = await Visualization.find({ userEmail: email })
      .sort({ createdAt: 1 }) // oldest → newest
      .select("vizName createdAt totalStudents stats");

    res.json({
      success: true,
      timeline: visualizations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load timeline",
    });
  }
});

module.exports = router;
