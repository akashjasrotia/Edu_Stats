const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel");

router.put("/", async (req, res) => {
  try {
    const { id, vizName } = req.body;

    if (!id || !vizName) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const updated = await Visualization.findByIdAndUpdate(
      id,
      { vizName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Visualization not found" });
    }

    res.json({ success: true, vizName: updated.vizName });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
