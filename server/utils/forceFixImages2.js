const mongoose = require('mongoose');
const Book = require('../models/Book');

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  let fixedCount = 0;
  
  for (let book of books) {
    const encodedTitle = encodeURIComponent(book.title.replace(/\s+/g, '+'));
    book.coverImage = `https://dummyimage.com/400x600/3a2321/f5ca32.jpg&text=${encodedTitle}`;
    await book.save();
    fixedCount++;
  }
  
  console.log(`Successfully updated ${fixedCount} DB books to dummyimage.com.`);
  process.exit(0);
}).catch(console.error);
