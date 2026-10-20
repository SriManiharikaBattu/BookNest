const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:bookId')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
