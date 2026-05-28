// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder, payOrder,
  getAllOrders, updateOrderStatus, getOrderStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',              protect, createOrder);
router.get('/my',             protect, getMyOrders);
router.get('/stats',          protect, adminOnly, getOrderStats);
router.get('/',               protect, adminOnly, getAllOrders);
router.get('/:id',            protect, getOrder);
router.put('/:id/pay',        protect, payOrder);
router.put('/:id/status',     protect, adminOnly, updateOrderStatus);

module.exports = router;
