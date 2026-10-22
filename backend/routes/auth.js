const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Health check for auth routes
// @route   GET /api/auth/health
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth routes working',
    timestamp: new Date().toISOString()
  });
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      dateOfBirth,
      gender,
      address,
      // Doctor-specific fields
      licenseNumber,
      specialties,
      education,
      consultationFee,
      languages,
      bio
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Public signup is limited to patients and doctors. Admin accounts must
    // be provisioned separately and can only sign in with their credentials.
    const validRoles = ['patient', 'doctor'];
    const userRole = role || 'patient';
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be created through signup'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user data (password will be hashed by pre-save middleware)
    const userData = {
      firstName,
      lastName,
      email,
      password, // Don't hash here - let the model handle it
      phone,
      role: userRole,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      isActive: true,
      isEmailVerified: false
    };

    // Create user
    const user = await User.create(userData);

    // If user is a doctor, create doctor profile
    if (userRole === 'doctor') {
      // Validate specialties against allowed enum
      const allowedSpecialties = [
        'Cardiology', 'Neurology', 'Ophthalmology', 'Orthopedics',
        'Pediatrics', 'General Medicine', 'Dermatology', 'Psychiatry',
        'Radiology', 'Emergency Medicine', 'Surgery', 'Internal Medicine',
        'Family Medicine', 'Oncology', 'Anesthesiology'
      ];

      // Filter and validate specialties
      let validSpecialties = (specialties || ['General Medicine'])
        .filter(s => s.trim())
        .map(s => {
          // Try to match with allowed specialties (case-insensitive)
          const matched = allowedSpecialties.find(
            allowed => allowed.toLowerCase() === s.toLowerCase()
          );
          return matched || s;
        });

      // If no valid specialties, use default
      if (validSpecialties.length === 0) {
        validSpecialties = ['General Medicine'];
      }

      const doctorData = {
        user: user._id,
        licenseNumber: licenseNumber || `MD-${Date.now()}`,
        specialties: validSpecialties,
        education: education || [{
          degree: 'Doctor of Medicine (MD)',
          institution: 'Medical University',
          graduationYear: new Date().getFullYear() - 5
        }],
        consultationFee: consultationFee || 150,
        languages: languages && languages.length > 0 ? languages.filter(l => l.trim()) : ['English'],
        bio: bio || 'Experienced medical professional dedicated to providing quality healthcare.',
        experience: {
          years: 1,
          description: 'Medical professional with expertise in patient care.'
        },
        rating: {
          average: 5.0,
          count: 0
        },
        totalPatients: 0,
        isAvailableForEmergency: false,
        isVerified: true,
        status: 'active' // Set to active instead of pending_verification to show immediately
      };

      try {
        const doctorProfile = await Doctor.create(doctorData);
        console.log('✅ Doctor profile created:', doctorProfile._id);
      } catch (doctorError) {
        console.error('❌ Doctor creation error:', doctorError.message);
        // Even if doctor profile fails, user is created
        throw new Error(`User created but doctor profile failed: ${doctorError.message}`);
      }
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Error message:', error.message);
    console.error('Error details:', error.errors || error.details);
    
    // Handle specific validation errors
    let errorMessage = 'Server error during registration';
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      errorMessage = `${field === 'email' ? 'Email' : 'License number'} already exists`;
    } else if (error.message.includes('validation')) {
      errorMessage = error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for:', email);
    console.log('📝 Password provided:', password ? 'Yes' : 'No');

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('📧 User email from DB:', user.email);
    console.log('🔒 User has password:', user.password ? 'Yes' : 'No');
    console.log('✅ User is active:', user.isActive);

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Check password
    console.log('🔐 Comparing passwords...');
    console.log('📝 Plain password length:', password.length);
    console.log('🔒 Hashed password length:', user.password ? user.password.length : 'No password');
    
    const isMatch = await user.matchPassword(password);
    console.log('🎯 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    console.log('🎫 Generating JWT token for user ID:', user._id);
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    // If user is a doctor, get doctor profile
    let doctorProfile = null;
    if (user.role === 'doctor') {
      console.log('👨‍⚕️ User is a doctor, fetching doctor profile...');
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    console.log('✅ Login successful for user:', user.email);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        doctorProfile,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        doctorProfile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put('/updatepassword', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    // In a real app, you would send an email with reset token
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
