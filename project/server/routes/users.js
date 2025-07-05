const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { validateProfileUpdate, validateAddress } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('recentlyViewed.product', 'name brand price images rating')
      .populate('wishlist', 'name brand price images rating');

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          addresses: user.addresses,
          recentlyViewed: user.recentlyViewed.slice(0, 20),
          wishlist: user.wishlist,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, validateProfileUpdate, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', auth, validateAddress, async (req, res) => {
  try {
    const { type, name, street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    // If this is set as default, unset other default addresses
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      type,
      name,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0 // First address is default
    });

    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully',
      data: {
        address: user.addresses[user.addresses.length - 1]
      }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding address'
    });
  }
});

// @route   PUT /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', auth, validateAddress, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { type, name, street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    // Update address fields
    address.type = type || address.type;
    address.name = name || address.name;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.json({
      status: 'success',
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating address'
    });
  }
});

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);

    // If deleted address was default, make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting address'
    });
  }
});

// @route   GET /api/users/recently-viewed
// @desc    Get recently viewed products
// @access  Private
router.get('/recently-viewed', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const user = await User.findById(req.user._id)
      .populate('recentlyViewed.product', 'name brand price images rating category')
      .select('recentlyViewed');

    const recentlyViewed = user.recentlyViewed
      .filter(item => item.product) // Filter out deleted products
      .slice(0, parseInt(limit));

    res.json({
      status: 'success',
      data: { recentlyViewed }
    });
  } catch (error) {
    console.error('Get recently viewed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching recently viewed products'
    });
  }
});

// @route   DELETE /api/users/recently-viewed
// @desc    Clear recently viewed products
// @access  Private
router.delete('/recently-viewed', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { recentlyViewed: [] } }
    );

    res.json({
      status: 'success',
      message: 'Recently viewed products cleared successfully'
    });
  } catch (error) {
    console.error('Clear recently viewed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while clearing recently viewed products'
    });
  }
});

// @route   POST /api/users/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({
      status: 'success',
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding to wishlist'
    });
  }
});

// @route   DELETE /api/users/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } }
    );

    res.json({
      status: 'success',
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing from wishlist'
    });
  }
});

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name brand price images rating category inStock')
      .select('wishlist');

    res.json({
      status: 'success',
      data: {
        wishlist: user.wishlist.filter(product => product) // Filter out deleted products
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching wishlist'
    });
  }
});

module.exports = router;