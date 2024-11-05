const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-payment-method', paymentController.createPaymentMethod);
router.post('/attach-payment-method', paymentController.attachPaymentMethod);
router.post('/subscribe', paymentController.createSubscription);

// Define routes
//router.post('/subscribe', paymentController.subscribe);
router.post('/cancel-subscription', paymentController.cancelSubscription);
router.get('/subscription/:subscriptionId', paymentController.getSubscription);

module.exports = router;
