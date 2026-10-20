const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: Object }],
  address: { type: Object },
  amounts: {
    subtotal: { type: Number },
    discount: { type: Number },
    delivery: { type: Number },
    gst: { type: Number },
    total: { type: Number }
  },
  paymentMethod: { type: String },
  upiTransactionId: { type: String },
  paymentStatus: { type: String },
  orderStatus: { type: String, default: 'Placed' },
  statusHistory: [{ type: Object }],
  invoiceNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
