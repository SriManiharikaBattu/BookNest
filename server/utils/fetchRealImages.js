const mongoose = require('mongoose');
const Book = require('../models/Book');

async function fetchRealImage(title) {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}`);
    const data = await response.json();
    if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks) {
      // Get the thumbnail and replace http with https
      let url = data.items[0].volumeInfo.imageLinks.thumbnail;
      if (url) {
        url = url.replace('http:', 'https:');
        // Replace zoom=1 with zoom=0 for slightly better quality if available, or just leave it
        return url;
      }
    }
  } catch (err) {
    console.error(`Failed to fetch for ${title}`, err.message);
  }
  return null;
}

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  let fixedCount = 0;
  
  console.log(`Checking ${books.length} books to replace placeholders with real images...`);

  for (let book of books) {
    if (book.coverImage && book.coverImage.includes('placehold.co')) {
      const realImage = await fetchRealImage(book.title);
      if (realImage) {
        book.coverImage = realImage;
        await book.save();
        console.log(`Updated ${book.title} with real photo`);
        fixedCount++;
      } else {
        console.log(`Could not find real photo for ${book.title}`);
      }
      
      // Delay to avoid Google API rate limits
      await new Promise(res => setTimeout(res, 500));
    }
  }
  
  console.log(`Successfully fetched real photos for ${fixedCount} books.`);
  process.exit(0);
}).catch(console.error);
