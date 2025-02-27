const express = require("express");
const router = express.Router();
const Shipment = require("../models/shipmentModel"); // Assuming you have a Shipment model
const { io } = require("../server"); // Import socket.io instance

// Update Shipment Status
router.put("/:shipmentId/status", async (req, res) => {
  const { shipmentId } = req.params;
  const { status } = req.body;

  try {
    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
      { status },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Emit WebSocket event
    io.emit("updateShipment", { shipmentId, status });

    res.json({ message: "Shipment status updated", shipment });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
