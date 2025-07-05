# Myntra Clone - React Native E-commerce App

A full-featured e-commerce mobile application built with React Native and Expo, featuring a complete shopping experience with product browsing, cart management, user authentication, and more.

## 🚀 Live Demo

- **Backend API**: [https://myntra-app-production.up.railway.app](https://myntra-app-production.up.railway.app)
- **Mobile App**: Available via Expo Go or build APK

## 📱 Tech Stack

### Frontend (Mobile App)
- **React Native** with **Expo SDK 53.0.17**
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Lucide React Native** for icons
- **Expo Secure Store** for secure data storage
- **React Native Reanimated** for smooth animations

### Backend (API)
- **Node.js** with **Express.js**
- **MongoDB Atlas** for database
- **Railway** for hosting and deployment
- **JWT** for authentication
- **bcryptjs** for password hashing

### Infrastructure
- **Railway** - Backend hosting and deployment
- **MongoDB Atlas** - Cloud database
- **Expo** - Mobile app development and distribution

## ✨ Features Implemented

### 🛍️ Shopping Experience
- **Product Catalog** with filtering and sorting
- **Category-based browsing** (Men, Women, Kids, Sports, etc.)
- **Advanced Search** with real-time results
- **Product Details** with image gallery and reviews
- **Recently Viewed Products** tracking
- **Wishlist** functionality

### 🛒 Cart & Checkout
- **Shopping Cart** with quantity management
- **Save for Later** functionality
- **Move between Cart and Saved Items**
- **Price calculations** with discounts
- **Guest and authenticated user support**

### 👤 User Management
- **User Registration & Login**
- **JWT-based Authentication**
- **Profile Management**
- **Address Management**
- **Order History** (backend ready)

### 🎨 UI/UX Features
- **Responsive Design** for all screen sizes
- **Dark/Light theme support**
- **Smooth animations** and transitions
- **Loading states** and error handling
- **Offline support** for cart and wishlist

### 🔧 Technical Features
- **Cross-platform storage** (Web/Native)
- **API integration** with error handling
- **State management** with React hooks
- **Type-safe development** with TypeScript
- **Performance optimizations**

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd myntra-clone
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd project
npm install

# Install backend dependencies (if running locally)
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `project` directory:

```env
# Expo Configuration
EXPO_PUBLIC_API_URL=https://myntra-app-production.up.railway.app/api

# Development Configuration
NODE_ENV=development

# Optional: Analytics and Tracking
EXPO_PUBLIC_ANALYTICS_ENABLED=false
```

### 4. Start the Development Server

```bash
cd project
npm run dev
```

This will start the Expo development server. You can then:
- Scan the QR code with Expo Go app on your phone
- Press `a` to open Android emulator
- Press `i` to open iOS simulator
- Press `w` to open in web browser

## 📱 Building for Production

### Android APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
npm run build:android
```

### iOS App
```bash
# Build for iOS (requires Apple Developer account)
npm run build:ios
```

### Web Build
```bash
npm run build:web
```

## 🌐 Backend API

The backend is already deployed and running on Railway. If you want to run it locally:

### Local Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB connection string
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Seed the database
npm run seed

# Start the server
npm run dev
```

### API Endpoints
- `GET /api/products` - Get products with filtering
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- And many more...

## 📁 Project Structure

```
myntra-clone/
├── project/                 # React Native app
│   ├── app/                # App screens (Expo Router)
│   │   ├── (auth)/         # Authentication screens
│   │   ├── (tabs)/         # Main tab screens
│   │   └── product/        # Product detail screens
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── data/               # Static data and constants
├── server/                 # Backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── scripts/            # Database seeding scripts
└── README.md
```

## 🔐 Authentication

The app supports both guest and authenticated users:

### Test Credentials
- **Admin**: admin@myntra.com / admin123
- **User**: john@example.com / password123

### Features by User Type
- **Guest Users**: Browse products, manage cart locally
- **Authenticated Users**: All guest features + wishlist, order history, profile management

## 🚀 Deployment

### Frontend (Mobile App)
- Built with Expo for easy distribution
- Can be published to Expo Go for testing
- Production builds available for App Store/Play Store

### Backend (API)
- Deployed on Railway with automatic deployments
- MongoDB Atlas for database hosting
- Environment variables managed through Railway dashboard

## 🧪 Testing

### Test User Accounts
The seeded database includes test accounts:
- Regular user: `john@example.com` / `password123`
- Admin user: `admin@myntra.com` / `admin123`

### Test Data
- 12+ sample products across different categories
- Sample cart and wishlist data
- Product reviews and ratings

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=https://myntra-app-production.up.railway.app/api
NODE_ENV=development
EXPO_PUBLIC_ANALYTICS_ENABLED=false
```

#### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=*
```

## 📱 Mobile App Features

### Performance Optimizations
- Lazy loading of images
- Efficient list rendering with FlatList
- Optimized state management
- Minimal re-renders with React.memo

### Offline Support
- Cart data persists offline
- Recently viewed products cached
- Graceful handling of network errors

### Cross-Platform Compatibility
- Works on iOS, Android, and Web
- Platform-specific optimizations
- Consistent UI across platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Railway** for reliable backend hosting
- **MongoDB Atlas** for database services
- **React Native Community** for excellent libraries and tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints at the backend URL

---

**Built with ❤️ using React Native, Expo, and Railway**