// models/CustomerLog.js
const mongoose = require('mongoose');

const CustomerLogSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  subscriptionId: { type: String, required: true },
  planType: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethodId: { type: String, required: true },
  subscriptionStatus: { type: String, required: true },
});

module.exports = mongoose.model('CustomerLog', CustomerLogSchema);
