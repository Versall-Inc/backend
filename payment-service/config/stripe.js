// config/stripe.js
const Stripe = require('stripe'); // Import the Stripe library
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Initialize with your secret key

module.exports = stripe; // Export the stripe instance
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY); // For debugging

module.exports = stripe;
const createTestCustomer = async () => {
  const customer = await stripe.customers.create({
    email: 'test_customer@example.com',
    description: 'Test customer for subscription testing',
  });
  console.log('Test Customer ID:', customer.id); // Copy this ID for testing
};

createTestCustomer();