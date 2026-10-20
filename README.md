# BookNest

A full-stack online bookstore application built with MERN stack (MongoDB, Express, React, Node.js) and Firebase Authentication.

## Features
- Browse and search books
- View book details (stock, ratings, etc.)
- Cart and Checkout flow with UPI placeholder
- Order History in Profile
- Secure Authentication with Firebase (Google & Email/Password)
- Secure backend token verification with Firebase Admin SDK

## Quick Start

### 1. Backend Setup
1. `cd server`
2. `npm install`
3. Check `server/.env` and ensure `MONGO_URI` is pointing to your local MongoDB instance.
4. (Optional) Run `node utils/seed.js` to seed the database with 42 real books!
5. Start server: `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1. `cd client`
2. `npm install`
3. Start frontend: `npm run dev` (Usually runs on http://localhost:5173)

### Notes
- Firebase Admin SDK is mocked for local development if a valid `FIREBASE_PRIVATE_KEY` is not provided in `server/.env`. If you want full backend token verification, please add your service account details to the `.env` file.
- Client Firebase keys are embedded in `client/src/firebase.js` as requested. 

Enjoy your BookNest!
