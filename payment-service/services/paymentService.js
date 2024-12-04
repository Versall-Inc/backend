// services/paymentService.js
const stripe = require('../config/stripe');
const CustomerLog = require('../models/CustomerLog');

exports.createSubscription = async (customerId, paymentMethodId, planType) => {
  const plans = {
    basic: 'price_12345basic',
    plus: 'price_1QHRS7EEweu0LxbxIrzhiUyp',
    premium: 'price_12345premium',
  };

  const priceId = plans[planType];
  if (!priceId) {
    throw new Error('Invalid plan type');
  }

  // Attach the payment method to the customer
  await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

  // Set the payment method as the default for invoices
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  // Log subscription details in MongoDB
  await CustomerLog.create({
    customerId,
    subscriptionId: subscription.id,
    planType,
    paymentMethodId,
    subscriptionStatus: subscription.status,
    paymentDate: new Date(),
  });

  return subscription;
};

exports.cancelSubscription = async (subscriptionId) => {
  const canceledSubscription = await stripe.subscriptions.del(subscriptionId); // Use 'del' for canceling subscriptions
  // Update log in MongoDB
  await CustomerLog.findOneAndUpdate(
    { subscriptionId },
    { subscriptionStatus: 'canceled' },
    { new: true }
  );
  return canceledSubscription;
};

exports.getSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
};

exports.getCustomerLogs = async () => {
  const logs = await CustomerLog.find();
  return logs;
};
