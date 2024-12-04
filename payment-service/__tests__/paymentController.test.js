jest.mock('../services/paymentService', () => ({
    createSubscription: jest.fn(),
    cancelSubscription: jest.fn(),
    getSubscription: jest.fn(),
    getCustomerLogs: jest.fn(),
  }));
  
  const paymentService = require('../services/paymentService');
  const paymentController = require('../controllers/paymentController');
  const mockReq = (body = {}, params = {}) => ({ body, params });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
describe('Payment Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should subscribe a customer and return the subscription', async () => {
      const mockSubscription = { id: 'sub_123', status: 'active' };
      paymentService.createSubscription.mockResolvedValue(mockSubscription);
  
      const req = mockReq({
        customerId: 'cus_123',
        paymentMethodId: 'pm_123',
        planType: 'basic',
      });
      const res = mockRes();
  
      await paymentController.subscribe(req, res);
  
      expect(paymentService.createSubscription).toHaveBeenCalledWith(
        'cus_123',
        'pm_123',
        'basic'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSubscription);
    });
  
    it('should cancel a subscription and return the canceled subscription', async () => {
      const mockCanceledSubscription = { id: 'sub_123', status: 'canceled' };
      paymentService.cancelSubscription.mockResolvedValue(mockCanceledSubscription);
  
      const req = mockReq({ subscriptionId: 'sub_123' });
      const res = mockRes();
  
      await paymentController.cancelSubscription(req, res);
  
      expect(paymentService.cancelSubscription).toHaveBeenCalledWith('sub_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCanceledSubscription);
    });
  
    it('should retrieve customer logs', async () => {
      const mockLogs = [{ customerId: 'cus_123', subscriptionId: 'sub_123' }];
      paymentService.getCustomerLogs.mockResolvedValue(mockLogs);
  
      const req = mockReq();
      const res = mockRes();
  
      await paymentController.getCustomerLogs(req, res);
  
      expect(paymentService.getCustomerLogs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLogs);
    });
  });
  