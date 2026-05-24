import express from 'express';
const router = express.Router();
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview,
  getFoodReviews,
  toggleHelpful,
} from '../controllers/foodController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getFoods)
  .post(protect, admin, upload.single('image'), createFood);

router.route('/:id')
  .get(getFoodById)
  .put(protect, admin, upload.single('image'), updateFood)
  .delete(protect, admin, deleteFood);

router.route('/:id/reviews')
  .get(getFoodReviews)
  .post(protect, createFoodReview);

router.route('/:id/reviews/:reviewId/helpful')
  .put(protect, toggleHelpful);

export default router;
