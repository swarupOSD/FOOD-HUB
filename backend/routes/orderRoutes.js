import express from 'express';
const router = express.Router();
import {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  updateOrderToPaid
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/create')
  .post(protect, createOrder);

router.route('/')
  .get(protect, admin, getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

export default router;
