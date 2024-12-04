// __tests__/paymentService.test.js

jest.mock('../config/stripe', () => ({
    paymentMethods: {
      attach: jest.fn(),
    },
    customers: {
      update: jest.fn(),
    },
    subscriptions: {
      create: jest.fn(),
      del: jest.fn(),
    },
  }));
  
  jest.mock('../models/CustomerLog', () => ({
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
  }));
  
  const stripe = require('../config/stripe');
  const CustomerLog = require('../models/CustomerLog');
  const paymentService = require('../services/paymentService');
  
  describe('Payment Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create a subscription and log it', async () => {
      stripe.paymentMethods.attach.mockResolvedValue({});
      stripe.customers.update.mockResolvedValue({});
      stripe.subscriptions.create.mockResolvedValue({
        id: 'sub_123',
        status: 'active',
      });
      CustomerLog.create.mockResolvedValue({});
  
      const customerId = 'cus_123';
      const paymentMethodId = 'pm_123';
      const planType = 'basic';
  
      const subscription = await paymentService.createSubscription(
        customerId,
        paymentMethodId,
        planType
      );
  
      expect(stripe.paymentMethods.attach).toHaveBeenCalledWith(paymentMethodId, {
        customer: customerId,
      });
      expect(stripe.customers.update).toHaveBeenCalledWith(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      expect(stripe.subscriptions.create).toHaveBeenCalledWith({
        customer: customerId,
        items: [{ price: 'price_12345basic' }],
        expand: ['latest_invoice.payment_intent'],
      });
      expect(CustomerLog.create).toHaveBeenCalledWith({
        customerId,
        subscriptionId: 'sub_123',
        planType,
        paymentMethodId,
        subscriptionStatus: 'active',
        paymentDate: expect.any(Date),
      });
  
      expect(subscription.id).toBe('sub_123');
    });
  
    it('should cancel a subscription and update the log', async () => {
      stripe.subscriptions.del.mockResolvedValue({ id: 'sub_123', status: 'canceled' });
      CustomerLog.findOneAndUpdate.mockResolvedValue({});
  
      const subscriptionId = 'sub_123';
      const canceledSubscription = await paymentService.cancelSubscription(subscriptionId);
  
      expect(stripe.subscriptions.del).toHaveBeenCalledWith(subscriptionId);
      expect(CustomerLog.findOneAndUpdate).toHaveBeenCalledWith(
        { subscriptionId },
        { subscriptionStatus: 'canceled' },
        { new: true }
      );
  
      expect(canceledSubscription.status).toBe('canceled');
    });
  
    it('should retrieve subscription logs', async () => {
      const mockLogs = [{ customerId: 'cus_123', subscriptionId: 'sub_123' }];
      CustomerLog.find.mockResolvedValue(mockLogs);
  
      const logs = await paymentService.getCustomerLogs();
  
      expect(CustomerLog.find).toHaveBeenCalled();
      expect(logs).toEqual(mockLogs);
    });
  });
  