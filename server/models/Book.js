const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: [{ type: String }],
  price: { type: Number, required: true },
  discount: { type: Number },
  isbn: { type: String },
  publisher: { type: String },
  language: { type: String },
  format: { type: String },
  pages: { type: Number },
  description: { type: String },
  coverImage: { type: String },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
