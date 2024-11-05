const stripe = require('../config/stripe');

exports.createSubscription = async (customerId, paymentMethodId, planType) => {
  // Define your pricing plans
  const plans = {
    basic: 'price_12345basic', 
    plus: 'price_1QHRS7EEweu0LxbxIrzhiUyp',   
    premium: 'price_12345premium' 
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

  return subscription;
};

exports.cancelSubscription = async (subscriptionId) => {
  const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId); // Use 'cancel' instead of 'del'
  return canceledSubscription;
};

exports.getSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
};
