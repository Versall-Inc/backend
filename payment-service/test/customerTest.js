const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createTestCustomer = async () => {
  const customer = await stripe.customers.create({
    email: 'test_customer@example.com',
    description: 'Test customer for subscription testing',
  });
  console.log('Test Customer ID:', customer.id); // Copy this ID for testing
};

createTestCustomer();