// services/paymentService.js
const axios = require("axios");

const SUBSCRIPTION_SERVICE_URL =
  process.env.SUBSCRIPTION_SERVICE_URL || "http://localhost:8081/api";

// Create a subscription by calling the subscription service API
const createSubscription = async (userId, planId) => {
  try {
    const response = await axios.post(
      `${SUBSCRIPTION_SERVICE_URL}/subscription`,
      { userId, planId }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create subscription: " + error.message);
  }
};

// Cancel a subscription by calling the subscription service API
const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios.delete(
      `${SUBSCRIPTION_SERVICE_URL}/subscription/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to cancel subscription: " + error.message);
  }
};

// Retrieve subscription by userId
const getSubscriptionByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${SUBSCRIPTION_SERVICE_URL}/subscription/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve subscription: " + error.message);
  }
};

module.exports = {
  createSubscription,
  cancelSubscription,
  getSubscriptionByUserId,
};
