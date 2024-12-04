// test/paymentService.test.js
require('dotenv').config();
const stripe = require('../config/stripe');
const paymentService = require('../services/paymentService');

let testCustomer;
let testSubscription;
let testPaymentMethodId;

beforeAll(async () => {
  // Step 1: Create a test customer
  testCustomer = await stripe.customers.create({
    email: 'test_customer@example.com',
    description: 'Test Customer for Subscription',
  });

  // Step 2: Create a test PaymentMethod using a token
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: { token: 'tok_visa' }, // Use a test token to create a valid PaymentMethod
  });

  // Store the PaymentMethod ID for use in tests
  testPaymentMethodId = paymentMethod.id;

  // Step 3: Attach the PaymentMethod to the customer
  await stripe.paymentMethods.attach(testPaymentMethodId, { customer: testCustomer.id });

  // Step 4: Set the payment method as the default for the customer
  await stripe.customers.update(testCustomer.id, {
    invoice_settings: { default_payment_method: testPaymentMethodId },
  });
});

afterAll(async () => {
  // Clean up by deleting the test customer
  if (testCustomer && testCustomer.id) {
    await stripe.customers.del(testCustomer.id);
  }
});

describe('Payment Service Tests', () => {
  it('should create a subscription', async () => {
    try {
      const planType = 'plus';
      testSubscription = await paymentService.createSubscription(testCustomer.id, testPaymentMethodId, planType);
      expect(testSubscription).toHaveProperty('id');
      expect(testSubscription.status).toBe('active');
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  });

  it('should retrieve the subscription', async () => {
    try {
      const retrievedSubscription = await paymentService.getSubscription(testSubscription.id);
      expect(retrievedSubscription.id).toBe(testSubscription.id);
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  });

  it('should cancel the subscription', async () => {
    try {
      const canceledSubscription = await paymentService.cancelSubscription(testSubscription.id);
      expect(canceledSubscription.status).toBe('canceled');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  });
});
