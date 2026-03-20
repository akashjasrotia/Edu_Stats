const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel");

router.put("/:id", async (req, res) => {
  try {
    const { students } = req.body;

    // Sanitize string inputs from the frontend
    const parsedStudents = students.map((s) => ({
      ...s,
      marks: Number(s.marks || 0),
      totalMarks: Number(s.totalMarks || 100),
    }));

    const marksList = parsedStudents.map((s) => s.marks);

    const mean =
      marksList.reduce((a, b) => a + b, 0) / marksList.length;

    const sorted = [...marksList].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid] + sorted[mid - 1]) / 2
        : sorted[mid];

    const freq = {};
    marksList.forEach((m) => (freq[m] = (freq[m] || 0) + 1));
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.keys(freq)
      .filter((k) => freq[k] === maxFreq)
      .map(Number);

    const highest = Math.max(...marksList);
    const lowest = Math.min(...marksList);

    const variance =
      marksList.reduce((a, b) => a + (b - mean) ** 2, 0) /
      marksList.length;

    const stdDeviation = Math.sqrt(variance);

    const passCount = parsedStudents.filter(
      (s) => s.marks >= 0.33 * s.totalMarks
    ).length;

    const failCount = parsedStudents.length - passCount;

    await Visualization.findByIdAndUpdate(req.params.id, {
      studentResults: parsedStudents,
      stats: {
        mean: mean.toFixed(2),
        median,
        mode,
        highest,
        lowest,
        stdDeviation: stdDeviation.toFixed(2),
        passCount,
        failCount,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
