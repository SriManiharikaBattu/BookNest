const mongoose = require('mongoose');
const Book = require('../models/Book');

const fixes = {
  "The Diary of a Young Girl": "https://upload.wikimedia.org/wikipedia/en/4/47/Het_Achterhuis_%28Diary_of_Anne_Frank%29_-_front_cover%2C_first_edition.jpg",
  "Thinking, Fast and Slow": "https://upload.wikimedia.org/wikipedia/en/c/c1/Thinking%2C_Fast_and_Slow.jpg",
  "The Power of Habit": "https://upload.wikimedia.org/wikipedia/en/7/7f/The_Power_of_Habit.jpg",
  "Man's Search for Meaning": "https://upload.wikimedia.org/wikipedia/en/b/b5/Mans_Search_for_Meaning.jpg",
  "The 7 Habits of Highly Effective People": "https://upload.wikimedia.org/wikipedia/en/a/a2/The_7_Habits_of_Highly_Effective_People.jpg",
  "Meditations": "https://upload.wikimedia.org/wikipedia/commons/2/29/Marcus_Aurelius_Meditations.jpg",
  "The Martian": "https://upload.wikimedia.org/wikipedia/en/c/c3/The_Martian_2014.jpg",
  "Project Hail Mary": "https://upload.wikimedia.org/wikipedia/en/7/70/Project_Hail_Mary_cover.jpg",
  "The Kite Runner": "https://upload.wikimedia.org/wikipedia/en/e/e4/Kite_runner.jpg",
  "The Book Thief": "https://upload.wikimedia.org/wikipedia/en/8/8f/The_Book_Thief_by_Markus_Zusak_book_cover.jpg",
  "A Game of Thrones": "https://upload.wikimedia.org/wikipedia/en/9/93/AGameOfThrones.jpg",
  "మహా ప్రస్థానం": "https://placehold.co/400x600/3A2321/F5CA32?text=Maha+Prasthanam",
  "వేయి పడగలు": "https://placehold.co/400x600/3A2321/F5CA32?text=Veyi+Padagalu",
  "गोदान": "https://placehold.co/400x600/3A2321/F5CA32?text=Godaan",
  "रश्मिरथी": "https://placehold.co/400x600/3A2321/F5CA32?text=Rashmirathi",
  "అమరావతి కథలు": "https://placehold.co/400x600/3A2321/F5CA32?text=Amaravati+Kathalu"
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
  
  console.log(`Successfully fixed ${fixedCount} broken Wikipedia URLs.`);
  process.exit(0);
}).catch(console.error);
