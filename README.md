# ShopNova Backend API

A RESTful API built with Node.js, Express.js and MongoDB for the ShopNova e-commerce platform.

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 🚀 Live API
https://shopnova-server-production.up.railway.app

## 📌 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

### Products
- GET    /api/products
- GET    /api/products/:id
- POST   /api/products (Admin)
- PUT    /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

### Orders
- POST /api/orders
- GET  /api/orders/my
- GET  /api/orders (Admin)
- PUT  /api/orders/:id/status (Admin)

### Categories
- GET    /api/categories
- POST   /api/categories (Admin)
- PUT    /api/categories/:id (Admin)
- DELETE /api/categories/:id (Admin)

## ⚙️ Setup Locally

### 1. Install dependencies
npm install

### 2. Create .env file
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:3000

### 3. Seed database
node seeder.js

### 4. Start server
npm run dev

## 🔑 Demo Credentials
- Admin: admin@shopnova.com / admin123
- User:  user@shopnova.com  / user123
