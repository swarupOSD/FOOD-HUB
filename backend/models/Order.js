import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderedItems: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Food',
      },
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  tax: {
    type: Number,
    required: true,
    default: 0.0,
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0.0,
  },
  discount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Stripe',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  deliveryAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
