import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderedItems, deliveryAddress, paymentMethod, totalPrice, tax, deliveryFee, discount } = req.body;

    if (orderedItems && orderedItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      userId: req.user._id,
      orderedItems,
      deliveryAddress,
      paymentMethod,
      totalPrice,
      tax: tax || 0,
      deliveryFee: deliveryFee || 0,
      discount: discount || 0,
      isPaid: paymentMethod === 'Mock Payment' ? true : false,
      paidAt: paymentMethod === 'Mock Payment' ? Date.now() : null,
    });

    const createdOrder = await order.save();

    // If Mock Payment, clear cart immediately. For Stripe, we might wait until success.
    // However, since we are doing a simple redirect, we can clear it here to prevent duplicate submission,
    // or clear it on the frontend. We will let the frontend clear it after success.
    if (paymentMethod === 'Mock Payment') {
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], totalPrice: 0 });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      const updatedOrder = await order.save();
      
      // Clear user cart
      await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], totalPrice: 0 });
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);

    if (order) {
      order.orderStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder, getOrders, getMyOrders, updateOrderStatus, updateOrderToPaid };
