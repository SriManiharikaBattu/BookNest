const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupUsers = async () => {
  await connectDB();

  // 1. Create or update Admin User
  let admin = await User.findOne({ email: 'admin@booknest.com' });

  if (admin) {
    admin.password = 'adminpassword';
    admin.role = 'admin';
    await admin.save();
  } else {
    await User.create({
      name: 'Admin Manager',
      email: 'admin@booknest.com',
      password: 'adminpassword',
      role: 'admin',
      phone: '1234567890'
    });
  }

  // 2. Create or update Standard User
  let standardUser = await User.findOne({ email: 'user@booknest.com' });

  if (standardUser) {
    standardUser.password = 'userpassword';
    standardUser.role = 'user';
    await standardUser.save();
  } else {
    await User.create({
      name: 'Test User',
      email: 'user@booknest.com',
      password: 'userpassword',
      role: 'user',
      phone: '0987654321'
    });
  }

  console.log("Default Admin and User configured successfully (without double hashing).");
  process.exit();
};

setupUsers();
