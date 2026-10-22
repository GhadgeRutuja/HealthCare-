const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get all users (with optional search)
// @route   GET /api/users
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};
    
    // Always exclude the current user from the results
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    if (role) {
      query.role = role;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex }
      ];
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile endpoint - Coming soon!'
  });
});

module.exports = router;
