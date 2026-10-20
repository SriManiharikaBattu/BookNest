const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders, cancelOrder, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, adminCheck } = require('../middleware/authMiddleware');

router.route('/')
  .post(verifyToken, createOrder)
  .get(verifyToken, adminCheck, getOrders);

router.route('/myorders').get(verifyToken, getMyOrders);

router.route('/:id/cancel').put(verifyToken, cancelOrder);
router.route('/:id/status').put(verifyToken, adminCheck, updateOrderStatus);

module.exports = router;
