const express = require('express');
const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Users endpoint working',
    data: []
  });
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
