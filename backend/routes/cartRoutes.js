import express from 'express';
const router = express.Router();
import {
  getCart,
  addToCart,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, getCart);

router.route('/add')
  .post(protect, addToCart);

router.route('/remove')
  .delete(protect, removeFromCart);

export default router;
