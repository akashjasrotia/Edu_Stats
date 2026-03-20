const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel");

router.get("/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;

    const visualizations = await Visualization.find({ userEmail }).sort({
      createdAt: -1,
    });

    const results = visualizations.map((viz) => {
      const mean = Number(viz.stats.mean);
      const std = Number(viz.stats.stdDeviation);

      const sorted = [...viz.studentResults].sort(
        (a, b) => a.marks - b.marks
      );

      const q1Index = Math.floor(sorted.length * 0.25);
      const q1 = sorted[q1Index]?.marks ?? mean;

      const highRisk = [];
      const moderateRisk = [];
      const anomalies = [];

      viz.studentResults.forEach((s) => {
        if (s.marks < mean - 1.5 * std) {
          highRisk.push(s.name);
        } else if (s.marks < mean && s.marks <= q1) {
          moderateRisk.push(s.name);
        }

        if (
          s.marks > mean + 2 * std ||
          s.marks < mean - 2 * std
        ) {
          anomalies.push(s.name);
        }
      });

      return {
        vizId: viz._id,
        vizName: viz.vizName,
        createdAt: viz.createdAt,
        highRisk,
        moderateRisk,
        anomalies,
        studentResults: viz.studentResults,
      };
    });

    res.json({ results });
  } catch (err) {
    console.error("Anomaly detection error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
