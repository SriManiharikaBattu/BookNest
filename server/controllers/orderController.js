const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { address, paymentMethod, upiTransactionId } = req.body;
    const cart = await Cart.findOne({ userId: req.dbUser._id }).populate('items.bookId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate amounts
    let subtotal = 0;
    cart.items.forEach(item => {
      const price = item.bookId.price - (item.bookId.discount || 0);
      subtotal += price * item.qty;
    });

    const gst = subtotal * 0.05; // 5% GST
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + gst + delivery;

    // Check stock
    for (const item of cart.items) {
        if (item.bookId.stock < item.qty) {
            return res.status(400).json({ message: `Not enough stock for ${item.bookId.title}` });
        }
    }

    const orderId = `OD${Date.now()}`;
    const invoiceNumber = `INV-${Date.now()}`;

    const order = new Order({
      orderId,
      userId: req.dbUser._id,
      items: cart.items.map(item => ({
          bookId: item.bookId._id,
          title: item.bookId.title,
          price: item.bookId.price,
          qty: item.qty
      })),
      address,
      amounts: { subtotal, discount: 0, delivery, gst, total },
      paymentMethod,
      upiTransactionId,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      statusHistory: [{ status: 'Placed', date: new Date() }],
      invoiceNumber
    });

    const createdOrder = await order.save();

    // Reduce stock
    for (const item of cart.items) {
        await Book.findByIdAndUpdate(item.bookId._id, {
            $inc: { stock: -item.qty }
        });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.dbUser._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.dbUser._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', date: new Date() });
    await order.save();

    // Restock books
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stock: item.qty }
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, date: new Date() });
    
    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  cancelOrder,
  updateOrderStatus
};
