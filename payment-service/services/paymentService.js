// services/paymentService.js
const stripe = require("../config/stripe");

// Create a new payment session for one-time payments
const createPaymentSession = async (
  amount,
  currency,
  successUrl,
  cancelUrl
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Course Purchase",
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session;
  } catch (error) {
    throw new Error("Unable to create payment session");
  }
};

// Handle subscription creation
const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
    return subscription;
  } catch (error) {
    throw new Error("Unable to create subscription");
  }
};

// Webhook handler to handle Stripe events
const handleWebhook = async (event) => {
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      // Handle successful checkout session here
      console.log("Payment successful for session:", session.id);
      break;

    case "invoice.payment_failed":
      const invoice = event.data.object;
      // Handle failed payment here
      console.log("Payment failed for invoice:", invoice.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

module.exports = {
  createPaymentSession,
  createSubscription,
  handleWebhook,
};
