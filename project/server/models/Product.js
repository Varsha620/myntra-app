const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Men', 'Women', 'Kids', 'Sports', 'Accessories', 'Beauty', 'Home'],
      message: 'Category must be one of: Men, Women, Kids, Sports, Accessories, Beauty, Home'
    }
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  sizes: [{
    type: String,
    required: true
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    code: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      min: [0, 'Rating count cannot be negative'],
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  specifications: {
    material: String,
    care: String,
    origin: String,
    weight: String,
    dimensions: String
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewProduct: { // Changed from isNew to avoid Mongoose conflict
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  suppressReservedKeysWarning: true // Suppress the isNew warning
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isNewProduct: 1, isActive: 1 });
productSchema.index({ isBestseller: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Virtual for primary image - Fixed to handle empty arrays
productSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) {
    return null;
  }
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : this.images[0].url;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for isNew (maps to isNewProduct)
productSchema.virtual('isNew').get(function() {
  return this.isNewProduct;
});

// Pre-save middleware to calculate discount
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Method to update rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  return this.save();
};

// Method to add review
productSchema.methods.addReview = function(userId, rating, comment) {
  // Remove existing review from same user
  this.reviews = this.reviews.filter(review => !review.user.equals(userId));
  
  // Add new review
  this.reviews.push({
    user: userId,
    rating,
    comment
  });
  
  // Update rating
  return this.updateRating();
};

// Static method for advanced filtering
productSchema.statics.findWithFilters = function(filters = {}) {
  const query = { isActive: true };
  
  // Category filter
  if (filters.category && filters.category !== 'all') {
    query.category = filters.category;
  }
  
  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    query.brand = { $in: filters.brands };
  }
  
  // Price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }
  
  // Rating filter
  if (filters.minRating) {
    query['rating.average'] = { $gte: filters.minRating };
  }
  
  // Search filter
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  // Special filters
  if (filters.isNewProduct) query.isNewProduct = true;
  if (filters.isBestseller) query.isBestseller = true;
  if (filters.isFeatured) query.isFeatured = true;
  
  return this.find(query);
};

// Static method for sorting
productSchema.statics.applySorting = function(query, sortBy = 'popularity') {
  switch (sortBy) {
    case 'price-low':
      return query.sort({ price: 1 });
    case 'price-high':
      return query.sort({ price: -1 });
    case 'rating':
      return query.sort({ 'rating.average': -1, 'rating.count': -1 });
    case 'newest':
      return query.sort({ createdAt: -1 });
    case 'name':
      return query.sort({ name: 1 });
    case 'popularity':
    default:
      return query.sort({ 'rating.count': -1, 'rating.average': -1 });
  }
};

module.exports = mongoose.model('Product', productSchema);