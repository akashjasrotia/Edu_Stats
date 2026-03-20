const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel");

router.post("/", async (req, res) => {
  try {
    const { vizAId, vizBId } = req.body;

    if (!vizAId || !vizBId) {
      return res.status(400).json({ message: "Both visualization IDs required" });
    }

    const [vizA, vizB] = await Promise.all([
      Visualization.findById(vizAId),
      Visualization.findById(vizBId),
    ]);

    if (!vizA || !vizB) {
      return res.status(404).json({ message: "Visualization not found" });
    }


    const passRateA =
      (vizA.stats.passCount / vizA.studentResults.length) * 100;
    const passRateB =
      (vizB.stats.passCount / vizB.studentResults.length) * 100;

    const statsComparison = {
      mean: {
        A: Number(vizA.stats.mean),
        B: Number(vizB.stats.mean),
        delta: Number(vizB.stats.mean) - Number(vizA.stats.mean),
      },
      median: {
        A: vizA.stats.median,
        B: vizB.stats.median,
        delta: vizB.stats.median - vizA.stats.median,
      },
      passRate: {
        A: Number(passRateA.toFixed(2)),
        B: Number(passRateB.toFixed(2)),
        delta: Number((passRateB - passRateA).toFixed(2)),
      },
    };

    /* ================= STUDENT COMPARISON ================= */

    const mapA = {};
    vizA.studentResults.forEach((s) => {
      mapA[s.name] = s.marks;
    });

    const studentComparison = vizB.studentResults.map((s) => {
      const before = mapA[s.name];
      const after = s.marks;

      return {
        name: s.name,
        before: before ?? null,
        after,
        change:
          before !== undefined ? after - before : null,
      };
    });

    /* ================= RESPONSE ================= */

    res.status(200).json({
      vizA: {
        id: vizA._id,
        name: vizA.vizName,
      },
      vizB: {
        id: vizB._id,
        name: vizB.vizName,
      },
      statsComparison,
      studentComparison,
    });
  } catch (err) {
    console.error("❌ Compare Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
