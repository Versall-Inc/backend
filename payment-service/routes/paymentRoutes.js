// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSession,
  createSubscription,
  handleWebhook,
} = require("../controllers/paymentController");

// Create a new payment session
router.post("/payment/session", createSession);

// Create a subscription
router.post("/subscription", createSubscription);

// Webhook to handle Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
