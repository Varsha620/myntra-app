const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { 
  validateCartItem, 
  validateUpdateCartItem,
  validateProductId 
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart and saved items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name brand price originalPrice discount images sizes colors inStock')
      .populate('savedForLater.product', 'name brand price originalPrice discount images sizes colors inStock');

    // Filter out items with deleted products
    const validCartItems = user.cart.filter(item => item.product);
    const validSavedItems = user.savedForLater.filter(item => item.product);

    // Update user if items were filtered out
    if (validCartItems.length !== user.cart.length || validSavedItems.length !== user.savedForLater.length) {
      user.cart = validCartItems;
      user.savedForLater = validSavedItems;
      await user.save();
    }

    // Calculate totals
    const cartTotal = validCartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const cartItemsCount = validCartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      status: 'success',
      data: {
        cart: validCartItems,
        savedForLater: validSavedItems,
        summary: {
          itemsCount: cartItemsCount,
          subtotal: cartTotal,
          total: cartTotal // Add tax, shipping, etc. calculation here
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, validateCartItem, async (req, res) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    // Verify product exists and is active
    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if product is in stock
    if (!product.inStock) {
      return res.status(400).json({
        status: 'error',
        message: 'Product is out of stock'
      });
    }

    // Validate size and color
    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid size selected'
      });
    }

    const colorNames = product.colors.map(c => typeof c === 'string' ? c : c.name);
    if (!colorNames.includes(color)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid color selected'
      });
    }

    await req.user.addToCart(productId, size, color, quantity);

    res.status(201).json({
      status: 'success',
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding to cart'
    });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', auth, validateUpdateCartItem, async (req, res) => {
  try {
    const { productId, size, color, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      item => item.product.equals(productId) && 
               item.size === size && 
               item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    if (quantity === 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();

    res.json({
      status: 'success',
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating cart'
    });
  }
});

// @route   DELETE /api/cart/remove
// @desc    Remove item from cart
// @access  Private
router.delete('/remove', auth, async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID, size, and color are required'
      });
    }

    await req.user.removeFromCart(productId, size, color);

    res.json({
      status: 'success',
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing from cart'
    });
  }
});

// @route   POST /api/cart/save-for-later
// @desc    Move item from cart to saved for later
// @access  Private
router.post('/save-for-later', auth, async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID, size, and color are required'
      });
    }

    await req.user.saveForLater(productId, size, color);

    res.json({
      status: 'success',
      message: 'Item saved for later successfully'
    });
  } catch (error) {
    console.error('Save for later error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while saving item for later'
    });
  }
});

// @route   POST /api/cart/move-to-cart
// @desc    Move item from saved for later to cart
// @access  Private
router.post('/move-to-cart', auth, async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID, size, and color are required'
      });
    }

    await req.user.moveToCart(productId, size, color);

    res.json({
      status: 'success',
      message: 'Item moved to cart successfully'
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while moving item to cart'
    });
  }
});

// @route   DELETE /api/cart/remove-saved
// @desc    Remove item from saved for later
// @access  Private
router.delete('/remove-saved', auth, async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID, size, and color are required'
      });
    }

    const user = await User.findById(req.user._id);
    user.savedForLater = user.savedForLater.filter(
      item => !(item.product.equals(productId) && 
                item.size === size && 
                item.color === color)
    );

    await user.save();

    res.json({
      status: 'success',
      message: 'Item removed from saved items successfully'
    });
  } catch (error) {
    console.error('Remove saved item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing saved item'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      status: 'success',
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while clearing cart'
    });
  }
});

module.exports = router;