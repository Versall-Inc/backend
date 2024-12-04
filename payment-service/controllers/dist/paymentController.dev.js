"use strict";

// controllers/paymentController.js
var paymentService = require('../services/paymentService');

var stripe = require('../config/stripe'); // Subscribe to a plan


exports.subscribe = function _callee(req, res) {
  var _req$body, customerId, paymentMethodId, planType, subscription;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Request body:", req.body); // Debugging line

          _context.prev = 1;
          _req$body = req.body, customerId = _req$body.customerId, paymentMethodId = _req$body.paymentMethodId, planType = _req$body.planType;
          _context.next = 5;
          return regeneratorRuntime.awrap(paymentService.createSubscription(customerId, paymentMethodId, planType));

        case 5:
          subscription = _context.sent;
          res.status(200).json(subscription);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.error('Error subscribing:', _context.t0); // Log the error for debugging

          res.status(500).json({
            error: _context.t0.message
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
}; // Cancel a subscription


exports.cancelSubscription = function _callee2(req, res) {
  var subscriptionId, canceledSubscription;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          subscriptionId = req.body.subscriptionId;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(paymentService.cancelSubscription(subscriptionId));

        case 4:
          canceledSubscription = _context2.sent;
          res.status(200).json(canceledSubscription);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error('Error canceling subscription:', _context2.t0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Get subscription details


exports.getSubscription = function _callee3(req, res) {
  var subscriptionId, subscription;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          subscriptionId = req.params.subscriptionId;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(paymentService.getSubscription(subscriptionId));

        case 4:
          subscription = _context3.sent;
          res.status(200).json(subscription);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.error('Error retrieving subscription:', _context3.t0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Create a PaymentMethod from a token


exports.createPaymentMethod = function _callee4(req, res) {
  var token, paymentMethod;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = req.body.token;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(stripe.paymentMethods.create({
            type: 'card',
            card: {
              token: token
            }
          }));

        case 4:
          paymentMethod = _context4.sent;
          res.status(200).json(paymentMethod);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          console.error('Error creating payment method:', _context4.t0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Attach a PaymentMethod to a customer


exports.attachPaymentMethod = function _callee5(req, res) {
  var _req$body2, paymentMethodId, customerId;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, paymentMethodId = _req$body2.paymentMethodId, customerId = _req$body2.customerId;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethodId
            }
          }));

        case 6:
          res.status(200).json({
            message: 'PaymentMethod attached successfully.'
          });
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](1);
          console.error('Error attaching payment method:', _context5.t0);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 9]]);
}; // Get customer logs


exports.getCustomerLogs = function _callee6(req, res) {
  var logs;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(paymentService.getCustomerLogs());

        case 3:
          logs = _context6.sent;
          res.status(200).json(logs);
          _context6.next = 11;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error('Error fetching customer logs:', _context6.t0);
          res.status(500).json({
            error: _context6.t0.message
          });

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Create a subscription


exports.createSubscription = function _callee7(req, res) {
  var _req$body3, customerId, paymentMethodId, planType, plans, priceId, subscription;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body3 = req.body, customerId = _req$body3.customerId, paymentMethodId = _req$body3.paymentMethodId, planType = _req$body3.planType;
          plans = {
            basic: 'price_12345basic',
            // Replace with your actual price ID
            plus: 'price_1QHRS7EEweu0LxbxIrzhiUyp',
            // Replace with your actual price ID
            premium: 'price_12345premium' // Replace with your actual price ID

          };
          priceId = plans[planType];

          if (priceId) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Invalid plan type'
          }));

        case 5:
          _context7.prev = 5;
          _context7.next = 8;
          return regeneratorRuntime.awrap(stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: priceId
            }],
            default_payment_method: paymentMethodId // Use the PaymentMethod ID here

          }));

        case 8:
          subscription = _context7.sent;
          res.status(200).json(subscription);
          _context7.next = 16;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](5);
          console.error('Error creating subscription:', _context7.t0);
          res.status(500).json({
            error: _context7.t0.message
          });

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[5, 12]]);
};