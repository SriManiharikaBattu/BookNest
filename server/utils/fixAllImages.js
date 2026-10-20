const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const Book = require('../models/Book');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixAllImages = async () => {
  await connectDB();
  
  const books = await Book.find({});
  let fixedCount = 0;

  console.log(`Checking ${books.length} books for broken images...`);

  for (let book of books) {
    if (book.coverImage && book.coverImage.includes('openlibrary.org')) {
      try {
        const response = await fetch(book.coverImage, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        
        // If it's less than 500 bytes, it's almost certainly the 1x1 pixel placeholder
        if (contentLength && parseInt(contentLength) < 500) {
          const encodedTitle = encodeURIComponent(book.title);
          book.coverImage = `https://placehold.co/400x600/3A2321/F5CA32?text=${encodedTitle}`;
          await book.save();
          console.log(`Fixed broken image for: ${book.title}`);
          fixedCount++;
        }
      } catch (err) {
        // If request fails, also replace
        const encodedTitle = encodeURIComponent(book.title);
        book.coverImage = `https://placehold.co/400x600/3A2321/F5CA32?text=${encodedTitle}`;
        await book.save();
        console.log(`Fixed failed image for: ${book.title}`);
        fixedCount++;
      }
    } else if (!book.coverImage) {
      const encodedTitle = encodeURIComponent(book.title);
      book.coverImage = `https://placehold.co/400x600/3A2321/F5CA32?text=${encodedTitle}`;
      await book.save();
      console.log(`Added missing image for: ${book.title}`);
      fixedCount++;
    }
  }

  console.log(`Finished. Fixed ${fixedCount} images.`);
  process.exit();
};

fixAllImages();
