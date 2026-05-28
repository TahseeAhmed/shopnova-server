const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

const categories = [
  { name: 'Electronics',   slug: 'electronics',   image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Fashion',       slug: 'fashion',       image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Living', slug: 'home-living',   image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { name: 'Sports',        slug: 'sports',        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400' },
  { name: 'Beauty',        slug: 'beauty',        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400' },
  { name: 'Books',         slug: 'books',         image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Order.deleteMany()]);
  console.log('Cleared existing data');

  const createdCats = await Category.insertMany(categories);
  const catMap = {};
  createdCats.forEach((c) => (catMap[c.slug] = c._id));

  // Admin user
  const admin = await User.create({
    name: 'Admin User', email: 'admin@shopnova.com',
    password: 'admin123', role: 'admin',
  });
  // Test user
  await User.create({ name: 'Test User', email: 'user@shopnova.com', password: 'user123' });

  const products = [
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling headphones with 30-hour battery life and exceptional sound quality.',
      price: 299, originalPrice: 399,
      category: catMap['electronics'], brand: 'Sony',
      images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' }],
      stock: 50, isFeatured: true, ratings: 4.8, numReviews: 1204,
    },
    {
      name: 'Apple MacBook Pro 14"',
      description: 'Supercharged by M3 Pro or M3 Max chip. Mind-blowing performance for demanding workflows.',
      price: 1999, originalPrice: null,
      category: catMap['electronics'], brand: 'Apple',
      images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600' }],
      stock: 20, isFeatured: true, ratings: 4.9, numReviews: 892,
    },
    {
      name: 'Samsung 4K Smart TV 55"',
      description: 'Crystal UHD 4K display with HDR and smart features including voice control.',
      price: 699, originalPrice: 899,
      category: catMap['electronics'], brand: 'Samsung',
      images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600' }],
      stock: 15, isFeatured: false, ratings: 4.5, numReviews: 567,
    },
    {
      name: 'iPhone 15 Pro Max',
      description: 'Titanium design. A17 Pro chip. Pro camera system with 5x optical zoom.',
      price: 1199, originalPrice: null,
      category: catMap['electronics'], brand: 'Apple',
      images: [{ url: 'https://images.unsplash.com/photo-1696446702183-cbd97ca9e9f3?w=600' }],
      stock: 30, isFeatured: true, ratings: 4.9, numReviews: 3421,
    },
    {
      name: 'Nike Air Max 270',
      description: 'The Nike Air Max 270 delivers a look inspired by the Air Max 180 and Air Max 93.',
      price: 130, originalPrice: 160,
      category: catMap['fashion'], brand: 'Nike',
      images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' }],
      stock: 80, isFeatured: true, ratings: 4.6, numReviews: 2341,
    },
    {
      name: 'Levi\'s 501 Original Jeans',
      description: 'The original blue jean since 1873. Sits at waist, straight through thigh and leg.',
      price: 89, originalPrice: null,
      category: catMap['fashion'], brand: 'Levi\'s',
      images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600' }],
      stock: 120, isFeatured: false, ratings: 4.4, numReviews: 889,
    },
    {
      name: 'Ray-Ban Aviator Sunglasses',
      description: 'Classic aviator sunglasses with gold frame and green G-15 lens.',
      price: 154, originalPrice: 180,
      category: catMap['fashion'], brand: 'Ray-Ban',
      images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' }],
      stock: 60, isFeatured: true, ratings: 4.7, numReviews: 1567,
    },
    {
      name: 'IKEA KALLAX Shelf Unit',
      description: 'Versatile storage solution. Can be used as a room divider, TV bench or shelf.',
      price: 199, originalPrice: null,
      category: catMap['home-living'], brand: 'IKEA',
      images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' }],
      stock: 25, isFeatured: false, ratings: 4.3, numReviews: 445,
    },
    {
      name: 'Luxury Scented Candle Set',
      description: 'Set of 3 hand-poured soy wax candles with natural essential oils. Burns for 45 hours.',
      price: 49, originalPrice: 65,
      category: catMap['home-living'], brand: 'LuxeHome',
      images: [{ url: 'https://images.unsplash.com/photo-1602607144808-a82832da9ccc?w=600' }],
      stock: 200, isFeatured: true, ratings: 4.8, numReviews: 3201,
    },
    {
      name: 'Adidas Ultraboost 23',
      description: 'A high-performance running shoe with BOOST midsole for incredible energy return.',
      price: 180, originalPrice: 220,
      category: catMap['sports'], brand: 'Adidas',
      images: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600' }],
      stock: 55, isFeatured: false, ratings: 4.7, numReviews: 987,
    },
    {
      name: 'Professional Yoga Mat',
      description: 'Extra-thick 6mm yoga mat with superior grip, alignment lines, and carrying strap.',
      price: 45, originalPrice: null,
      category: catMap['sports'], brand: 'YogaPro',
      images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600' }],
      stock: 150, isFeatured: false, ratings: 4.5, numReviews: 723,
    },
    {
      name: 'La Mer Moisturizing Cream',
      description: 'The iconic Moisturizing Cream with Miracle Broth™. Deeply hydrates and renews skin.',
      price: 190, originalPrice: null,
      category: catMap['beauty'], brand: 'La Mer',
      images: [{ url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600' }],
      stock: 40, isFeatured: true, ratings: 4.6, numReviews: 2109,
    },
  ];

  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products, ${categories.length} categories`);
  console.log('Admin: admin@shopnova.com / admin123');
  console.log('User:  user@shopnova.com  / user123');
  process.exit(0);
};

seedDB().catch((err) => { console.error(err); process.exit(1); });
