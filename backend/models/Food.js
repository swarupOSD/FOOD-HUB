import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // Store as base64 string
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  restaurantName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
