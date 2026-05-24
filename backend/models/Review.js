import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Food',
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  helpful: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// One review per user per food item
reviewSchema.index({ userId: 1, foodId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
