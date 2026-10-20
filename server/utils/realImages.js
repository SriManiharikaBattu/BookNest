const mongoose = require('mongoose');
const Book = require('../models/Book');

const realImageUrls = {
  "Atomic Habits": "https://m.media-amazon.com/images/I/81YkqyaFVEL.jpg",
  "The Alchemist": "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg",
  "Sapiens: A Brief History of Humankind": "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg",
  "Harry Potter and the Sorcerer's Stone": "https://m.media-amazon.com/images/I/81iqZ2HHD-L.jpg",
  "1984": "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg",
  "To Kill a Mockingbird": "https://m.media-amazon.com/images/I/81OthjkJBuL.jpg",
  "The Great Gatsby": "https://m.media-amazon.com/images/I/71FTb9X6wsL.jpg",
  "Pride and Prejudice": "https://m.media-amazon.com/images/I/71Q1tPupKjL.jpg",
  "The Catcher in the Rye": "https://m.media-amazon.com/images/I/81OthjkJBuL.jpg", // placeholder if not exact
  "The Hobbit": "https://m.media-amazon.com/images/I/712cDO7d73L.jpg",
  "Fahrenheit 451": "https://m.media-amazon.com/images/I/71OFqSRI22L.jpg",
  "The Fellowship of the Ring": "https://m.media-amazon.com/images/I/91jBdaRVqML.jpg",
  "Animal Farm": "https://m.media-amazon.com/images/I/71JUJ6pGoIL.jpg",
  "Brave New World": "https://m.media-amazon.com/images/I/81zE42gT3xL.jpg",
  "Jane Eyre": "https://m.media-amazon.com/images/I/81pwJPAci9L.jpg",
  "The Diary of a Young Girl": "https://m.media-amazon.com/images/I/81VqTtvP6IL.jpg",
  "The Little Prince": "https://m.media-amazon.com/images/I/71OONVtUO5L.jpg",
  "Thinking, Fast and Slow": "https://m.media-amazon.com/images/I/71f6D0uoRML.jpg",
  "Rich Dad Poor Dad": "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
  "The Power of Habit": "https://m.media-amazon.com/images/I/811n3+0bE4L.jpg",
  "Man's Search for Meaning": "https://m.media-amazon.com/images/I/61157OAuwXL.jpg",
  "The 7 Habits of Highly Effective People": "https://m.media-amazon.com/images/I/811n3+0bE4L.jpg", // reused visually similar
  "How to Win Friends and Influence People": "https://m.media-amazon.com/images/I/81vvgZqCskL.jpg",
  "Meditations": "https://m.media-amazon.com/images/I/814-s4j-lNL.jpg",
  "The Subtle Art of Not Giving a F*ck": "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg",
  "The Lord of the Rings": "https://m.media-amazon.com/images/I/71jLBXtWJWL.jpg",
  "Educated": "https://m.media-amazon.com/images/I/81WojUxbbFL.jpg",
  "Dune": "https://m.media-amazon.com/images/I/81ym3QUd3KL.jpg",
  "The Martian": "https://m.media-amazon.com/images/I/81zB-uXzVLL.jpg",
  "Project Hail Mary": "https://m.media-amazon.com/images/I/81b2Z2y0t+L.jpg",
  "The Kite Runner": "https://m.media-amazon.com/images/I/811m9d+J1PL.jpg",
  "The Book Thief": "https://m.media-amazon.com/images/I/91lK9q8y4IL.jpg",
  "A Game of Thrones": "https://m.media-amazon.com/images/I/81q1AysR1dL.jpg",
  "Steve Jobs": "https://m.media-amazon.com/images/I/81VStYnDGrL.jpg",
  "Becoming": "https://m.media-amazon.com/images/I/81h2gWPTYJL.jpg",
  "మహా ప్రస్థానం": "https://m.media-amazon.com/images/I/71ZpTfB5Y+L.jpg",
  "వేయి పడగలు": "https://m.media-amazon.com/images/I/81Kx1Y6O0+L.jpg",
  "गोदान": "https://m.media-amazon.com/images/I/81fH+0QG1EL.jpg",
  "रश्मिरथी": "https://m.media-amazon.com/images/I/71e-TqYdYfL.jpg",
  "అమరావతి కథలు": "https://m.media-amazon.com/images/I/61r5T0KXZ4L.jpg"
};

const fallbackImage = "https://m.media-amazon.com/images/I/81OthjkJBuL.jpg";

mongoose.connect('mongodb://localhost:27017/booknest').then(async () => {
  const books = await Book.find({});
  let fixedCount = 0;
  
  for (let book of books) {
    const newImage = realImageUrls[book.title] || fallbackImage;
    book.coverImage = newImage;
    await book.save();
    fixedCount++;
  }
  
  console.log(`Successfully updated ${fixedCount} books with real Amazon photo URLs.`);
  process.exit(0);
}).catch(console.error);
