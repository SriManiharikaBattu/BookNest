const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { verifyToken, adminCheck } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBooks)
  .post(verifyToken, adminCheck, createBook);

router.route('/:id')
  .get(getBookById)
  .put(verifyToken, adminCheck, updateBook)
  .delete(verifyToken, adminCheck, deleteBook);

module.exports = router;
