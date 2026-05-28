const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: String, street: String, city: String,
      state: String, zipCode: String, country: String, phone: String,
    },
    paymentMethod: { type: String, required: true, default: 'stripe' },
    paymentResult: {
      id: String, status: String, updateTime: String, emailAddress: String,
    },
    itemsPrice:    { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice:      { type: Number, required: true, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid:     { type: Boolean, default: false },
    paidAt:     { type: Date },
    isDelivered:{ type: Boolean, default: false },
    deliveredAt:{ type: Date },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
