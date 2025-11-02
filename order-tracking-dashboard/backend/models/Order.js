const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  item: { type: String, required: true },
  status: { type: String, default: "Đang chờ xử lý" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
