const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Book = require('../models/Book');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixImages = async () => {
  await connectDB();
  
  // Use reliable Placehold.co images with titles since OpenLibrary is returning blank 1x1 images for these specific ISBNs
  await Book.updateOne({ title: "మహా ప్రస్థానం" }, { $set: { coverImage: "https://placehold.co/400x600/3A2321/F5CA32?text=Maha+Prasthanam" }});
  await Book.updateOne({ title: "వేయి పడగలు" }, { $set: { coverImage: "https://placehold.co/400x600/3A2321/F5CA32?text=Veyi+Padagalu" }});
  await Book.updateOne({ title: "అమరావతి కథలు" }, { $set: { coverImage: "https://placehold.co/400x600/3A2321/F5CA32?text=Amaravathi" }});
  
  await Book.updateOne({ title: "गोदान" }, { $set: { coverImage: "https://placehold.co/400x600/3A2321/F5CA32?text=Godan" }});
  await Book.updateOne({ title: "रश्मिरथी" }, { $set: { coverImage: "https://placehold.co/400x600/3A2321/F5CA32?text=Rashmirathi" }});

  console.log("Images fixed successfully!");
  process.exit();
};

fixImages();
