const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');
const connectDB = require('../config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    await connectDB();
    
    // Will be created by subagent
    const books = require('./booksData');

    await Book.deleteMany();
    console.log('Books deleted.');

    await Book.insertMany(books);
    console.log('Books imported.');

    process.exit();
  } catch (error) {
    console.error('Error with import:', error);
    process.exit(1);
  }
};

seedDB();
