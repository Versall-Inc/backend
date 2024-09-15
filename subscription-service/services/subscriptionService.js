// services/subscriptionService.js
const stripe = require("../config/stripe");
const Subscription = require("../models/Subscription");

// Create a new subscription
const createSubscription = async (userId, planId) => {
  try {
    const customer = await stripe.customers.create({ metadata: { userId } });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planId }],
    });

    const newSubscription = await Subscription.create({
      userId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      planId,
      startDate: subscription.start_date,
    });

    return newSubscription;
  } catch (error) {
    throw new Error("Unable to create subscription: " + error.message);
  }
};

// Update subscription status
const updateSubscriptionStatus = async (subscriptionId, status) => {
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: subscriptionId,
    });
    if (!subscription) throw new Error("Subscription not found");

    subscription.status = status;
    if (status === "canceled") {
      subscription.endDate = new Date();
    }

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new Error("Unable to update subscription status: " + error.message);
  }
};

// Cancel a subscription
const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    await updateSubscriptionStatus(subscriptionId, "canceled");
    return subscription;
  } catch (error) {
    throw new Error("Unable to cancel subscription: " + error.message);
  }
};

// Retrieve a subscription by userId
const getSubscriptionByUserId = async (userId) => {
  return await Subscription.findOne({ where: { userId } });
};

module.exports = {
  createSubscription,
  updateSubscriptionStatus,
  cancelSubscription,
  getSubscriptionByUserId,
};
