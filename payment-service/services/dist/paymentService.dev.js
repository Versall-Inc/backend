"use strict";

// services/paymentService.js
var stripe = require('../config/stripe');

var CustomerLog = require('../models/CustomerLog');

exports.createSubscription = function _callee(customerId, paymentMethodId, planType) {
  var plans, priceId, subscription;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          plans = {
            basic: 'price_12345basic',
            plus: 'price_1QHRS7EEweu0LxbxIrzhiUyp',
            premium: 'price_12345premium'
          };
          priceId = plans[planType];

          if (priceId) {
            _context.next = 4;
            break;
          }

          throw new Error('Invalid plan type');

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethodId
            }
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: priceId
            }],
            expand: ['latest_invoice.payment_intent']
          }));

        case 10:
          subscription = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(CustomerLog.create({
            customerId: customerId,
            subscriptionId: subscription.id,
            planType: planType,
            paymentMethodId: paymentMethodId,
            subscriptionStatus: subscription.status,
            paymentDate: new Date()
          }));

        case 13:
          return _context.abrupt("return", subscription);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.cancelSubscription = function _callee2(subscriptionId) {
  var canceledSubscription;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(stripe.subscriptions.del(subscriptionId));

        case 2:
          canceledSubscription = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(CustomerLog.findOneAndUpdate({
            subscriptionId: subscriptionId
          }, {
            subscriptionStatus: 'canceled'
          }, {
            "new": true
          }));

        case 5:
          return _context2.abrupt("return", canceledSubscription);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getSubscription = function _callee3(subscriptionId) {
  var subscription;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(stripe.subscriptions.retrieve(subscriptionId));

        case 2:
          subscription = _context3.sent;
          return _context3.abrupt("return", subscription);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getCustomerLogs = function _callee4() {
  var logs;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(CustomerLog.find());

        case 2:
          logs = _context4.sent;
          return _context4.abrupt("return", logs);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};