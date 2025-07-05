const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

// Enhanced sample products data with more items
const sampleProducts = [
  {
    name: 'Cotton Casual Shirt',
    brand: 'ZARA',
    description: 'A comfortable cotton casual shirt perfect for everyday wear. Made from premium quality cotton with a relaxed fit.',
    price: 1299,
    originalPrice: 1899,
    category: 'Men',
    images: [
      {
        url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
        alt: 'Cotton Casual Shirt - Front View',
        isPrimary: true
      },
      {
        url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
        alt: 'Cotton Casual Shirt - Side View'
      }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', code: '#FFFFFF' },
      { name: 'Blue', code: '#0066CC' },
      { name: 'Black', code: '#000000' }
    ],
    stock: 50,
    rating: { average: 4.2, count: 1204 },
    isNewProduct: true,
    isFeatured: true,
    tags: ['casual', 'cotton', 'shirt', 'men']
  },
  {
    name: 'Floral Summer Dress',
    brand: 'H&M',
    description: 'Beautiful floral print summer dress with flowing silhouette. Perfect for casual outings and summer events.',
    price: 2199,
    originalPrice: 2999,
    category: 'Women',
    images: [
      {
        url: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
        alt: 'Floral Summer Dress - Front View',
        isPrimary: true
      }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Floral Print', code: '#FF6B9D' },
      { name: 'Solid Blue', code: '#4A90E2' }
    ],
    stock: 30,
    rating: { average: 4.5, count: 856 },
    isBestseller: true,
    isFeatured: true,
    tags: ['dress', 'floral', 'summer', 'women']
  },
  {
    name: 'Kids Rainbow T-Shirt',
    brand: 'GAP Kids',
    description: 'Colorful rainbow t-shirt for kids with soft cotton fabric. Fun and comfortable for active children.',
    price: 899,
    originalPrice: 1299,
    category: 'Kids',
    images: [
      {
        url: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
        alt: 'Kids Rainbow T-Shirt',
        isPrimary: true
      }
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: [
      { name: 'Rainbow', code: '#FF6B9D' },
      { name: 'Pink', code: '#FF69B4' },
      { name: 'Blue', code: '#4169E1' }
    ],
    stock: 25,
    rating: { average: 4.7, count: 432 },
    isNewProduct: true,
    tags: ['kids', 'tshirt', 'rainbow', 'cotton']
  },
  {
    name: 'Leather Formal Shoes',
    brand: 'Clarks',
    description: 'Premium leather formal shoes for professional occasions. Crafted with genuine leather and comfortable sole.',
    price: 4999,
    originalPrice: 6999,
    category: 'Men',
    images: [
      {
        url: 'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg',
        alt: 'Leather Formal Shoes',
        isPrimary: true
      }
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Brown', code: '#8B4513' }
    ],
    stock: 15,
    rating: { average: 4.3, count: 298 },
    tags: ['shoes', 'formal', 'leather', 'men']
  },
  {
    name: 'Designer Handbag',
    brand: 'Michael Kors',
    description: 'Elegant designer handbag with premium leather finish. Perfect accessory for any occasion.',
    price: 8999,
    originalPrice: 12999,
    category: 'Accessories',
    images: [
      {
        url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
        alt: 'Designer Handbag',
        isPrimary: true
      }
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Brown', code: '#8B4513' },
      { name: 'Beige', code: '#F5F5DC' }
    ],
    stock: 10,
    rating: { average: 4.6, count: 672 },
    isBestseller: true,
    isFeatured: true,
    tags: ['handbag', 'designer', 'leather', 'women', 'accessories']
  },
  {
    name: 'Sports Sneakers',
    brand: 'Nike',
    description: 'High-performance sports sneakers for running and training. Lightweight and comfortable design.',
    price: 3499,
    originalPrice: 4999,
    category: 'Sports',
    images: [
      {
        url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
        alt: 'Sports Sneakers',
        isPrimary: true
      }
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'White', code: '#FFFFFF' },
      { name: 'Black', code: '#000000' },
      { name: 'Red', code: '#FF0000' }
    ],
    stock: 40,
    rating: { average: 4.4, count: 1890 },
    isNewProduct: true,
    isFeatured: true,
    tags: ['sneakers', 'sports', 'running', 'nike']
  },
  {
    name: 'Denim Jacket',
    brand: 'Levis',
    description: 'Classic denim jacket with vintage wash and comfortable fit. A timeless wardrobe essential.',
    price: 2899,
    originalPrice: 3999,
    category: 'Men',
    images: [
      {
        url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
        alt: 'Denim Jacket',
        isPrimary: true
      }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blue', code: '#4169E1' },
      { name: 'Black', code: '#000000' },
      { name: 'Light Blue', code: '#87CEEB' }
    ],
    stock: 20,
    rating: { average: 4.1, count: 543 },
    tags: ['jacket', 'denim', 'casual', 'men']
  },
  {
    name: 'Silk Scarf',
    brand: 'Hermès',
    description: 'Luxurious silk scarf with elegant pattern and premium quality. Perfect accessory for sophisticated looks.',
    price: 15999,
    originalPrice: 19999,
    category: 'Accessories',
    images: [
      {
        url: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
        alt: 'Silk Scarf',
        isPrimary: true
      }
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Pink', code: '#FF69B4' },
      { name: 'Blue', code: '#4169E1' },
      { name: 'Gold', code: '#FFD700' }
    ],
    stock: 5,
    rating: { average: 4.8, count: 234 },
    isBestseller: true,
    tags: ['scarf', 'silk', 'luxury', 'women', 'accessories']
  },
  // Additional products to reach 12 items
  {
    name: 'Yoga Leggings',
    brand: 'Lululemon',
    description: 'High-waisted yoga leggings with moisture-wicking fabric. Perfect for workouts and casual wear.',
    price: 1899,
    originalPrice: 2499,
    category: 'Women',
    images: [
      {
        url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
        alt: 'Yoga Leggings',
        isPrimary: true
      }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Navy', code: '#000080' },
      { name: 'Grey', code: '#808080' }
    ],
    stock: 35,
    rating: { average: 4.6, count: 987 },
    isNewProduct: true,
    tags: ['leggings', 'yoga', 'activewear', 'women']
  },
  {
    name: 'Wireless Earbuds',
    brand: 'Apple',
    description: 'Premium wireless earbuds with noise cancellation and long battery life. Crystal clear sound quality.',
    price: 12999,
    originalPrice: 15999,
    category: 'Accessories',
    images: [
      {
        url: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
        alt: 'Wireless Earbuds',
        isPrimary: true
      }
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'White', code: '#FFFFFF' },
      { name: 'Black', code: '#000000' }
    ],
    stock: 20,
    rating: { average: 4.7, count: 1543 },
    isBestseller: true,
    isFeatured: true,
    tags: ['earbuds', 'wireless', 'audio', 'technology']
  },
  {
    name: 'Skincare Set',
    brand: 'The Ordinary',
    description: 'Complete skincare routine set with cleanser, serum, and moisturizer. Suitable for all skin types.',
    price: 2499,
    originalPrice: 3299,
    category: 'Beauty',
    images: [
      {
        url: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
        alt: 'Skincare Set',
        isPrimary: true
      }
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Natural', code: '#F5F5DC' }
    ],
    stock: 15,
    rating: { average: 4.5, count: 678 },
    isNewProduct: true,
    tags: ['skincare', 'beauty', 'routine', 'natural']
  },
  {
    name: 'Gaming Chair',
    brand: 'DXRacer',
    description: 'Ergonomic gaming chair with lumbar support and adjustable height. Perfect for long gaming sessions.',
    price: 18999,
    originalPrice: 24999,
    category: 'Home',
    images: [
      {
        url: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
        alt: 'Gaming Chair',
        isPrimary: true
      }
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black/Red', code: '#000000' },
      { name: 'Black/Blue', code: '#000080' }
    ],
    stock: 8,
    rating: { average: 4.4, count: 234 },
    isFeatured: true,
    tags: ['chair', 'gaming', 'ergonomic', 'furniture']
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@myntra.com',
  password: 'admin123',
  role: 'admin',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

// Sample regular user
const regularUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '+1234567890',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myntra-clone');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedAdminPassword = await bcrypt.hash(adminUser.password, 12);
    const admin = new User({
      ...adminUser,
      password: hashedAdminPassword
    });
    await admin.save();

    // Create regular user
    console.log('👤 Creating regular user...');
    const hashedUserPassword = await bcrypt.hash(regularUser.password, 12);
    const user = new User({
      ...regularUser,
      password: hashedUserPassword
    });
    await user.save();

    // Create products
    console.log('📦 Creating products...');
    const products = [];
    for (const productData of sampleProducts) {
      const product = new Product({
        ...productData,
        createdBy: admin._id
      });
      products.push(product);
    }
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${products.length} products`);
    console.log('👤 Admin credentials: admin@myntra.com / admin123');
    console.log('👤 User credentials: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();