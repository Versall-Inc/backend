"use strict";

// __tests__/paymentService.test.js
jest.mock('../config/stripe', function () {
  return {
    paymentMethods: {
      attach: jest.fn()
    },
    customers: {
      update: jest.fn()
    },
    subscriptions: {
      create: jest.fn(),
      del: jest.fn()
    }
  };
});
jest.mock('../models/CustomerLog', function () {
  return {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn()
  };
});

var stripe = require('../config/stripe');

var CustomerLog = require('../models/CustomerLog');

var paymentService = require('../services/paymentService');

describe('Payment Service', function () {
  afterEach(function () {
    jest.clearAllMocks();
  });
  it('should create a subscription and log it', function _callee() {
    var customerId, paymentMethodId, planType, subscription;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stripe.paymentMethods.attach.mockResolvedValue({});
            stripe.customers.update.mockResolvedValue({});
            stripe.subscriptions.create.mockResolvedValue({
              id: 'sub_123',
              status: 'active'
            });
            CustomerLog.create.mockResolvedValue({});
            customerId = 'cus_123';
            paymentMethodId = 'pm_123';
            planType = 'basic';
            _context.next = 9;
            return regeneratorRuntime.awrap(paymentService.createSubscription(customerId, paymentMethodId, planType));

          case 9:
            subscription = _context.sent;
            expect(stripe.paymentMethods.attach).toHaveBeenCalledWith(paymentMethodId, {
              customer: customerId
            });
            expect(stripe.customers.update).toHaveBeenCalledWith(customerId, {
              invoice_settings: {
                default_payment_method: paymentMethodId
              }
            });
            expect(stripe.subscriptions.create).toHaveBeenCalledWith({
              customer: customerId,
              items: [{
                price: 'price_12345basic'
              }],
              expand: ['latest_invoice.payment_intent']
            });
            expect(CustomerLog.create).toHaveBeenCalledWith({
              customerId: customerId,
              subscriptionId: 'sub_123',
              planType: planType,
              paymentMethodId: paymentMethodId,
              subscriptionStatus: 'active',
              paymentDate: expect.any(Date)
            });
            expect(subscription.id).toBe('sub_123');

          case 15:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  it('should cancel a subscription and update the log', function _callee2() {
    var subscriptionId, canceledSubscription;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            stripe.subscriptions.del.mockResolvedValue({
              id: 'sub_123',
              status: 'canceled'
            });
            CustomerLog.findOneAndUpdate.mockResolvedValue({});
            subscriptionId = 'sub_123';
            _context2.next = 5;
            return regeneratorRuntime.awrap(paymentService.cancelSubscription(subscriptionId));

          case 5:
            canceledSubscription = _context2.sent;
            expect(stripe.subscriptions.del).toHaveBeenCalledWith(subscriptionId);
            expect(CustomerLog.findOneAndUpdate).toHaveBeenCalledWith({
              subscriptionId: subscriptionId
            }, {
              subscriptionStatus: 'canceled'
            }, {
              "new": true
            });
            expect(canceledSubscription.status).toBe('canceled');

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  it('should retrieve subscription logs', function _callee3() {
    var mockLogs, logs;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mockLogs = [{
              customerId: 'cus_123',
              subscriptionId: 'sub_123'
            }];
            CustomerLog.find.mockResolvedValue(mockLogs);
            _context3.next = 4;
            return regeneratorRuntime.awrap(paymentService.getCustomerLogs());

          case 4:
            logs = _context3.sent;
            expect(CustomerLog.find).toHaveBeenCalled();
            expect(logs).toEqual(mockLogs);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
});