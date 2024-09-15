// controllers/paymentController.js
const paymentService = require("../services/paymentService");

// Create a new payment session
const createSession = async (req, res) => {
  const { amount, currency, successUrl, cancelUrl } = req.body;
  try {
    const session = await paymentService.createPaymentSession(
      amount,
      currency,
      successUrl,
      cancelUrl
    );
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a subscription for recurring payments
const createSubscription = async (req, res) => {
  const { customerId, priceId } = req.body;
  try {
    const subscription = await paymentService.createSubscription(
      customerId,
      priceId
    );
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle Stripe webhook events
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    await paymentService.handleWebhook(event);
    res.status(200).send("Webhook received");
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

module.exports = {
  createSession,
  createSubscription,
  handleWebhook,
};
