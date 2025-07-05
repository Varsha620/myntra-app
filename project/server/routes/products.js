const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { 
  validateProductId, 
  validateProductQuery, 
  validateReview 
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and sorting
// @access  Public
router.get('/', validateProductQuery, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brands,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy = 'popularity',
      isNew,
      isBestseller,
      isFeatured
    } = req.query;

    // Build filter object
    const filters = {
      category: category !== 'all' ? category : undefined,
      brands: brands ? brands.split(',') : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      search,
      isNew: isNew === 'true',
      isBestseller: isBestseller === 'true',
      isFeatured: isFeatured === 'true'
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    // Build query
    let query = Product.findWithFilters(filters);
    
    // Apply sorting
    query = Product.applySorting(query, sortBy);

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await query
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews -createdBy -updatedBy');

    // Get total count for pagination
    const totalQuery = Product.findWithFilters(filters);
    const total = await totalQuery.countDocuments();

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        filters: {
          applied: filters,
          available: {
            categories: await Product.distinct('category', { isActive: true }),
            brands: await Product.distinct('brand', { isActive: true }),
            priceRange: {
              min: await Product.findOne({ isActive: true }).sort({ price: 1 }).select('price'),
              max: await Product.findOne({ isActive: true }).sort({ price: -1 }).select('price')
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('-reviews -createdBy -updatedBy');

    res.json({
      status: 'success',
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching featured products'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all categories with product counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        } 
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/products/brands
// @desc    Get all brands with product counts
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$brand', 
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating.average' }
        } 
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      status: 'success',
      data: { brands }
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching brands'
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $text: { $search: q },
      isActive: true
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('name brand price images category rating');

    res.json({
      status: 'success',
      data: { 
        products,
        query: q,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during product search'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', validateProductId, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('reviews.user', 'name avatar')
    .select('-createdBy -updatedBy');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Add to recently viewed if user is authenticated
    if (req.user) {
      await req.user.addToRecentlyViewed(product._id);
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
    .limit(8)
    .select('name brand price images rating');

    res.json({
      status: 'success',
      data: { 
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching product'
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', auth, validateProductId, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    await product.addReview(req.user._id, rating, comment);

    res.status(201).json({
      status: 'success',
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding review'
    });
  }
});

// @route   POST /api/products/:id/view
// @desc    Add product to recently viewed
// @access  Private
router.post('/:id/view', auth, validateProductId, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    await req.user.addToRecentlyViewed(product._id);

    res.json({
      status: 'success',
      message: 'Product added to recently viewed'
    });
  } catch (error) {
    console.error('Add to recently viewed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding to recently viewed'
    });
  }
});

module.exports = router;