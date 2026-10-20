const mongoose = require('mongoose');
const Book = require('../models/Book');

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  console.log(`Found ${books.length} books.`);
  let openLibraryCount = 0;
  let placeholdCount = 0;
  
  books.forEach(b => {
    if (b.coverImage.includes('openlibrary')) openLibraryCount++;
    if (b.coverImage.includes('placehold.co')) placeholdCount++;
  });
  
  console.log(`OpenLibrary URLs: ${openLibraryCount}`);
  console.log(`Placehold URLs: ${placeholdCount}`);
  
  if (books.length > 0) {
    console.log('Sample images:', books.slice(0, 5).map(b => b.coverImage));
  }
  process.exit(0);
}).catch(console.error);
