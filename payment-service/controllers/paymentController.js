// controllers/paymentController.js
const paymentService = require('../services/paymentService');
const stripe = require('../config/stripe');

// Subscribe to a plan
exports.subscribe = async (req, res) => {
  console.log("Request body:", req.body); // Debugging line
  try {
    const { customerId, paymentMethodId, planType } = req.body;
    const subscription = await paymentService.createSubscription(customerId, paymentMethodId, planType);
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error subscribing:', error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Cancel a subscription
exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;
  try {
    const canceledSubscription = await paymentService.cancelSubscription(subscriptionId);
    res.status(200).json(canceledSubscription);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get subscription details
exports.getSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    const subscription = await paymentService.getSubscription(subscriptionId);
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a PaymentMethod from a token
exports.createPaymentMethod = async (req, res) => {
  const { token } = req.body;
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token },
    });
    res.status(200).json(paymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

// Attach a PaymentMethod to a customer
exports.attachPaymentMethod = async (req, res) => {
  const { paymentMethodId, customerId } = req.body;
  try {
    // Attach the PaymentMethod
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // Set it as the default payment method for the customer
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    res.status(200).json({ message: 'PaymentMethod attached successfully.' });
  } catch (error) {
    console.error('Error attaching payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get customer logs
exports.getCustomerLogs = async (req, res) => {
  try {
    const logs = await paymentService.getCustomerLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching customer logs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a subscription
exports.createSubscription = async (req, res) => {
  const { customerId, paymentMethodId, planType } = req.body;
  const plans = {
    basic: 'price_12345basic',  // Replace with your actual price ID
    plus: 'price_1QHRS7EEweu0LxbxIrzhiUyp',  // Replace with your actual price ID
    premium: 'price_12345premium',  // Replace with your actual price ID
  };

  const priceId = plans[planType];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan type' });
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId, // Use the PaymentMethod ID here
    });
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
};
