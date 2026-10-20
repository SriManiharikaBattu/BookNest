const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Book = require('../models/Book');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const addMoreBooks = async () => {
  try {
    await connectDB();
    
    // Will be created by subagent
    const newBooks = require('./moreBooksData');

    await Book.insertMany(newBooks);
    console.log(`Successfully added ${newBooks.length} new books!`);

    process.exit();
  } catch (error) {
    console.error('Error with import:', error);
    process.exit(1);
  }
};

addMoreBooks();
