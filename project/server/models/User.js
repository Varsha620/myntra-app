const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  avatar: {
    type: String,
    default: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  savedForLater: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  recentlyViewed: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'recentlyViewed.viewedAt': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for cart total
userSchema.virtual('cartTotal').get(function() {
  return this.cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
});

// Virtual for cart items count
userSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add product to recently viewed
userSchema.methods.addToRecentlyViewed = function(productId) {
  // Remove if already exists
  this.recentlyViewed = this.recentlyViewed.filter(
    item => !item.product.equals(productId)
  );
  
  // Add to beginning
  this.recentlyViewed.unshift({
    product: productId,
    viewedAt: new Date()
  });
  
  // Keep only last 20 items
  if (this.recentlyViewed.length > 20) {
    this.recentlyViewed = this.recentlyViewed.slice(0, 20);
  }
  
  return this.save();
};

// Method to add item to cart
userSchema.methods.addToCart = function(productId, size, color, quantity = 1) {
  const existingItemIndex = this.cart.findIndex(
    item => item.product.equals(productId) && 
             item.size === size && 
             item.color === color
  );
  
  if (existingItemIndex >= 0) {
    this.cart[existingItemIndex].quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      size,
      color,
      quantity
    });
  }
  
  return this.save();
};

// Method to remove item from cart
userSchema.methods.removeFromCart = function(productId, size, color) {
  this.cart = this.cart.filter(
    item => !(item.product.equals(productId) && 
              item.size === size && 
              item.color === color)
  );
  
  return this.save();
};

// Method to move item to saved for later
userSchema.methods.saveForLater = function(productId, size, color) {
  const itemIndex = this.cart.findIndex(
    item => item.product.equals(productId) && 
            item.size === size && 
            item.color === color
  );
  
  if (itemIndex >= 0) {
    const item = this.cart[itemIndex];
    this.cart.splice(itemIndex, 1);
    
    this.savedForLater.push({
      product: item.product,
      size: item.size,
      color: item.color,
      quantity: item.quantity
    });
  }
  
  return this.save();
};

// Method to move item back to cart
userSchema.methods.moveToCart = function(productId, size, color) {
  const itemIndex = this.savedForLater.findIndex(
    item => item.product.equals(productId) && 
            item.size === size && 
            item.color === color
  );
  
  if (itemIndex >= 0) {
    const item = this.savedForLater[itemIndex];
    this.savedForLater.splice(itemIndex, 1);
    
    this.cart.push({
      product: item.product,
      size: item.size,
      color: item.color,
      quantity: item.quantity
    });
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);