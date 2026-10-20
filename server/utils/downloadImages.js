const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const Book = require('../models/Book');

// Helper to download image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      } else {
        // Fallback for dummyimage if network fails
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  
  // Ensure the public/books directory exists
  const publicBooksDir = path.join(__dirname, '../../client/public/books');
  if (!fs.existsSync(publicBooksDir)) {
    fs.mkdirSync(publicBooksDir, { recursive: true });
  }

  console.log(`Starting download for ${books.length} books...`);
  
  let successCount = 0;
  
  for (let book of books) {
    if (book.coverImage && book.coverImage.startsWith('http')) {
      const fileName = `${book._id}.jpg`;
      const filePath = path.join(publicBooksDir, fileName);
      
      try {
        await downloadImage(book.coverImage, filePath);
        // Update database to use local relative path
        book.coverImage = `/books/${fileName}`;
        await book.save();
        console.log(`Downloaded and updated: ${book.title}`);
        successCount++;
      } catch (err) {
        console.error(`Failed to download image for ${book.title}:`, err.message);
      }
    } else {
      console.log(`Skipped ${book.title}, already a local path: ${book.coverImage}`);
    }
  }
  
  console.log(`Completed. Downloaded and localized ${successCount} images.`);
  process.exit(0);
}).catch(console.error);
