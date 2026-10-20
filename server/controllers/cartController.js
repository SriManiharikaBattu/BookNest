const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.dbUser._id }).populate('items.bookId');
    if (!cart) {
      cart = await Cart.create({ userId: req.dbUser._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { bookId, qty } = req.body;
    let cart = await Cart.findOne({ userId: req.dbUser._id });

    if (!cart) {
      cart = await Cart.create({ userId: req.dbUser._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty;
    } else {
      cart.items.push({ bookId, qty });
    }

    await cart.save();
    cart = await cart.populate('items.bookId');
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:bookId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ userId: req.dbUser._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.bookId.toString() === req.params.bookId);
      if (itemIndex > -1) {
        cart.items[itemIndex].qty = qty;
        await cart.save();
        await cart.populate('items.bookId');
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:bookId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.dbUser._id });

    if (cart) {
      cart.items = cart.items.filter(item => item.bookId.toString() !== req.params.bookId);
      await cart.save();
      await cart.populate('items.bookId');
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
