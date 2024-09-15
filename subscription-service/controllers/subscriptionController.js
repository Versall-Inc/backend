// controllers/subscriptionController.js
const subscriptionService = require("../services/subscriptionService");

// Create a new subscription
const createSubscription = async (req, res) => {
  const { userId, planId } = req.body;
  try {
    const subscription = await subscriptionService.createSubscription(
      userId,
      planId
    );
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel an existing subscription
const cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    const canceledSubscription = await subscriptionService.cancelSubscription(
      subscriptionId
    );
    res.status(200).json(canceledSubscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get subscription by userId
const getSubscription = async (req, res) => {
  const { userId } = req.params;
  try {
    const subscription = await subscriptionService.getSubscriptionByUserId(
      userId
    );
    if (!subscription)
      return res.status(404).json({ error: "Subscription not found" });

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSubscription,
  cancelSubscription,
  getSubscription,
};
