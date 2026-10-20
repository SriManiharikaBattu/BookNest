const mongoose = require('mongoose');
const Book = require('../models/Book');

const fixes = {
  "Fahrenheit 451": "https://m.media-amazon.com/images/I/41qI9quGIdL.jpg",
  "Jane Eyre": "https://m.media-amazon.com/images/I/81hO1yga8IL.jpg",
  "The Diary of a Young Girl": "https://m.media-amazon.com/images/I/8135Xvj29bL.jpg",
  "The Little Prince": "https://m.media-amazon.com/images/I/51-MlKnv+iL.jpg",
  "Thinking, Fast and Slow": "https://m.media-amazon.com/images/I/61f-C-lZ2fL.jpg",
  "The Power of Habit": "https://m.media-amazon.com/images/I/717c-A2H4nL.jpg",
  "Man's Search for Meaning": "https://m.media-amazon.com/images/I/61157OAuwXL.jpg",
  "The 7 Habits of Highly Effective People": "https://m.media-amazon.com/images/I/711J0BwB2mL.jpg",
  "Meditations": "https://m.media-amazon.com/images/I/71hwUKOOM8L.jpg",
  "The Martian": "https://m.media-amazon.com/images/I/71Z8tHl6R9L.jpg",
  "Project Hail Mary": "https://m.media-amazon.com/images/I/714h3T13pLL.jpg",
  "The Kite Runner": "https://m.media-amazon.com/images/I/71rQ1OQ-pBL.jpg",
  "The Book Thief": "https://m.media-amazon.com/images/I/91pZEozfNQL.jpg",
  "A Game of Thrones": "https://m.media-amazon.com/images/I/91dSMhdIzTL.jpg",
  "మహా ప్రస్థానం": "https://m.media-amazon.com/images/I/81J45U2x2VL.jpg",
  "వేయి పడగలు": "https://m.media-amazon.com/images/I/81kS8vJ9uEL.jpg",
  "गोदान": "https://m.media-amazon.com/images/I/71wLpW6sNOL.jpg",
  "रश्मिरथी": "https://m.media-amazon.com/images/I/71e-TqYdYfL.jpg",
  "అమరావతి కథలు": "https://m.media-amazon.com/images/I/61r5T0KXZ4L.jpg"
};

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  let fixedCount = 0;
  
  for (let book of books) {
    if (fixes[book.title]) {
      book.coverImage = fixes[book.title];
      await book.save();
      fixedCount++;
    }
  }
  
  console.log(`Successfully fixed ${fixedCount} broken URLs.`);
  process.exit(0);
}).catch(console.error);
