const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const usersToAdd = [
  { email: 'admin@booknest.com', password: 'password123', name: 'Admin Booknest', role: 'admin' },
  { email: 'staff@booknest.com', password: 'password123', name: 'Staff User', role: 'admin' },
  { email: 'user1@booknest.com', password: 'password123', name: 'Avid Reader', role: 'user' },
  { email: 'user2@booknest.com', password: 'password123', name: 'Casual Reader', role: 'user' },
  { email: 'john@booknest.com', password: 'password123', name: 'John Doe', role: 'user' }
];

const reseedUsers = async () => {
  await connectDB();
  try {
    await User.deleteMany();
    console.log('Old users deleted.');

    for (const u of usersToAdd) {
      await User.create(u);
    }
    console.log('New JWT users created successfully!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

reseedUsers();
