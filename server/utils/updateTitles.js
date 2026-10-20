const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Book = require('../models/Book');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateTitles = async () => {
  await connectDB();
  
  await Book.updateOne({ isbn: "9789332766345" }, { $set: { title: "మహా ప్రస్థానం" }});
  await Book.updateOne({ isbn: "9788190367301" }, { $set: { title: "వేయి పడగలు" }});
  await Book.updateOne({ isbn: "9789380963383" }, { $set: { title: "అమరావతి కథలు" }});
  
  await Book.updateOne({ isbn: "9788185012544" }, { $set: { title: "गोदान" }});
  await Book.updateOne({ isbn: "9789350330369" }, { $set: { title: "रश्मिरथी" }});

  console.log("Titles updated to native scripts.");
  process.exit();
};

updateTitles();
