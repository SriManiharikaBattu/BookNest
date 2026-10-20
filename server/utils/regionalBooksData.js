const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Book = require('../models/Book');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const regionalBooks = [
  {
    title: "Maha Prasthanam",
    author: "Sri Sri",
    genre: ["Poetry", "Classic"],
    price: 250,
    discount: 10,
    isbn: "9789332766345",
    publisher: "Visalandhra Publishing House",
    language: "Telugu",
    format: "Paperback",
    pages: 180,
    description: "Maha Prasthanam is an anthology of poems written by Telugu poet Sri Sri. It is considered an epic in Telugu literature.",
    coverImage: "https://covers.openlibrary.org/b/id/8302300-L.jpg",
    stock: 50
  },
  {
    title: "Veyi Padagalu",
    author: "Viswanatha Satyanarayana",
    genre: ["Fiction", "Classic"],
    price: 499,
    discount: 15,
    isbn: "9788190367301",
    publisher: "Viswanatha Publications",
    language: "Telugu",
    format: "Hardcover",
    pages: 998,
    description: "An epic Telugu novel written by Jnanpith Award winner Viswanatha Satyanarayana.",
    coverImage: "https://covers.openlibrary.org/b/id/10103117-L.jpg",
    stock: 30
  },
  {
    title: "Godan",
    author: "Munshi Premchand",
    genre: ["Fiction", "Classic"],
    price: 200,
    discount: 5,
    isbn: "9788185012544",
    publisher: "Rupa Publications",
    language: "Hindi",
    format: "Paperback",
    pages: 368,
    description: "Godan, meaning 'The Gift of a Cow', is a Hindi novel by Munshi Premchand, highlighting the socio-economic deprivation in rural India.",
    coverImage: "https://covers.openlibrary.org/b/isbn/9788185012544-L.jpg",
    stock: 120
  },
  {
    title: "Rashmirathi",
    author: "Ramdhari Singh Dinkar",
    genre: ["Poetry", "Epic"],
    price: 150,
    discount: 0,
    isbn: "9789350330369",
    publisher: "Lokbharti Prakashan",
    language: "Hindi",
    format: "Paperback",
    pages: 168,
    description: "Rashmirathi is one of the most celebrated epic poems in Hindi literature, based on the life of Karna from the Mahabharata.",
    coverImage: "https://covers.openlibrary.org/b/isbn/9789350330369-L.jpg",
    stock: 80
  },
  {
    title: "Amaravathi Ki Kathalu",
    author: "Satyam Sankaramanchi",
    genre: ["Short Stories"],
    price: 350,
    discount: 10,
    isbn: "9789380963383",
    publisher: "Navodaya Publishers",
    language: "Telugu",
    format: "Paperback",
    pages: 400,
    description: "A collection of 100 short stories in Telugu, giving a deep insight into the lives, culture, and folklore of Amaravathi.",
    coverImage: "https://covers.openlibrary.org/b/id/12839210-L.jpg",
    stock: 45
  }
];

const addRegionalBooks = async () => {
  try {
    await connectDB();
    await Book.insertMany(regionalBooks);
    console.log(`Successfully added ${regionalBooks.length} regional books!`);
    process.exit();
  } catch (error) {
    console.error('Error with import:', error);
    process.exit(1);
  }
};

addRegionalBooks();
