import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true, // One cart per user
  },
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Food',
      },
      title: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  }
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
