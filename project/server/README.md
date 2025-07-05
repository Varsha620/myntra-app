# Myntra Clone Backend API

A comprehensive backend API for the Myntra Clone mobile application built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt

- **Product Management**
  - Product catalog with filtering and sorting
  - Category and brand management
  - Product search functionality
  - Product reviews and ratings
  - Recently viewed products tracking

- **Shopping Cart & Wishlist**
  - Add/remove items from cart
  - Update item quantities
  - Save for later functionality
  - Move items between cart and saved items
  - Wishlist management

- **User Profile Management**
  - Profile updates
  - Address management
  - Order history
  - Recently viewed products

- **Advanced Features**
  - MongoDB aggregation for analytics
  - Comprehensive input validation
  - Error handling middleware
  - Rate limiting
  - Security headers
  - Request logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Utilities**: compression, morgan, dotenv

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/myntra-clone
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8081
```

5. Start MongoDB service on your machine

6. Seed the database with sample data:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - Get all products with filtering/sorting
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/brands` - Get all brands
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/reviews` - Add product review
- `POST /api/products/:id/view` - Add to recently viewed

### Cart Management
- `GET /api/cart` - Get user's cart and saved items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `POST /api/cart/save-for-later` - Move item to saved for later
- `POST /api/cart/move-to-cart` - Move item back to cart
- `DELETE /api/cart/remove-saved` - Remove saved item
- `DELETE /api/cart/clear` - Clear entire cart

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/addresses` - Add new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/recently-viewed` - Get recently viewed products
- `DELETE /api/users/recently-viewed` - Clear recently viewed
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `GET /api/users/wishlist` - Get user's wishlist

## Database Schema

### User Model
- Personal information (name, email, phone, avatar)
- Authentication (password, role, isActive)
- Shopping data (cart, savedForLater, wishlist)
- Activity tracking (recentlyViewed, lastLogin)
- Address management

### Product Model
- Product details (name, brand, description, price)
- Media (images with primary/secondary designation)
- Variants (sizes, colors)
- Inventory (stock, isActive)
- Marketing (rating, reviews, tags, featured flags)
- SEO optimization fields

### Order Model (Ready for implementation)
- Order tracking (orderNumber, status, statusHistory)
- Items and pricing breakdown
- Shipping and payment information
- Delivery tracking

## Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API request throttling
- **Security Headers**: Helmet.js protection
- **Password Security**: bcrypt hashing with salt
- **CORS**: Configurable cross-origin requests

## Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication and authorization errors
- Database operation errors
- Custom error responses with consistent format

## Sample Data

The seed script creates:
- 1 Admin user (admin@myntra.com / admin123)
- 1 Regular user (john@example.com / password123)
- 8 Sample products across different categories
- Proper relationships and sample data

## Development

### Running in Development Mode
```bash
npm run dev
```

### Database Seeding
```bash
npm run seed
```

### Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Set secure JWT secret
4. Configure proper CORS origins
5. Use process manager like PM2

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## Contributing

1. Follow the existing code structure and patterns
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation for new features
5. Test thoroughly before submitting

## License

This project is licensed under the MIT License.