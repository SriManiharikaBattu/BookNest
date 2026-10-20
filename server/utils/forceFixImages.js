const mongoose = require('mongoose');
const Book = require('../models/Book');

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  let fixedCount = 0;
  
  for (let book of books) {
    // Aggressively replace all openlibrary images since they might be blocked by ISPs or returning 1x1 pixels
    if (book.coverImage && book.coverImage.includes('openlibrary.org')) {
      const encodedTitle = encodeURIComponent(book.title);
      book.coverImage = `https://placehold.co/400x600/3A2321/F5CA32?text=${encodedTitle}`;
      await book.save();
      fixedCount++;
    }
  }
  
  console.log(`Successfully replaced ${fixedCount} OpenLibrary images with reliable Placehold.co images.`);
  process.exit(0);
}).catch(console.error);
