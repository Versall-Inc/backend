"use strict";

jest.mock('../services/paymentService', function () {
  return {
    createSubscription: jest.fn(),
    cancelSubscription: jest.fn(),
    getSubscription: jest.fn(),
    getCustomerLogs: jest.fn()
  };
});

var paymentService = require('../services/paymentService');

var paymentController = require('../controllers/paymentController');

var mockReq = function mockReq() {
  var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    body: body,
    params: params
  };
};

var mockRes = function mockRes() {
  var res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Payment Controller', function () {
  afterEach(function () {
    jest.clearAllMocks();
  });
  it('should subscribe a customer and return the subscription', function _callee() {
    var mockSubscription, req, res;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockSubscription = {
              id: 'sub_123',
              status: 'active'
            };
            paymentService.createSubscription.mockResolvedValue(mockSubscription);
            req = mockReq({
              customerId: 'cus_123',
              paymentMethodId: 'pm_123',
              planType: 'basic'
            });
            res = mockRes();
            _context.next = 6;
            return regeneratorRuntime.awrap(paymentController.subscribe(req, res));

          case 6:
            expect(paymentService.createSubscription).toHaveBeenCalledWith('cus_123', 'pm_123', 'basic');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSubscription);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  it('should cancel a subscription and return the canceled subscription', function _callee2() {
    var mockCanceledSubscription, req, res;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mockCanceledSubscription = {
              id: 'sub_123',
              status: 'canceled'
            };
            paymentService.cancelSubscription.mockResolvedValue(mockCanceledSubscription);
            req = mockReq({
              subscriptionId: 'sub_123'
            });
            res = mockRes();
            _context2.next = 6;
            return regeneratorRuntime.awrap(paymentController.cancelSubscription(req, res));

          case 6:
            expect(paymentService.cancelSubscription).toHaveBeenCalledWith('sub_123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCanceledSubscription);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  it('should retrieve customer logs', function _callee3() {
    var mockLogs, req, res;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mockLogs = [{
              customerId: 'cus_123',
              subscriptionId: 'sub_123'
            }];
            paymentService.getCustomerLogs.mockResolvedValue(mockLogs);
            req = mockReq();
            res = mockRes();
            _context3.next = 6;
            return regeneratorRuntime.awrap(paymentController.getCustomerLogs(req, res));

          case 6:
            expect(paymentService.getCustomerLogs).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLogs);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
});