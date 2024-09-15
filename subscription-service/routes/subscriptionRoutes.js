// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSubscription,
  cancelSubscription,
  getSubscription,
} = require("../controllers/subscriptionController");

// Create a new subscription
router.post("/subscription", createSubscription);

// Cancel an existing subscription
router.delete("/subscription/:subscriptionId", cancelSubscription);

// Get subscription details by userId
router.get("/subscription/:userId", getSubscription);

module.exports = router;
