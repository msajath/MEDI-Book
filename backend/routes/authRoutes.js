const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ──────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user (patient or doctor)
// @access  Public
// ──────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, role, phone, licenseNumber } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'patient',
        phone: phone || '',
      });

      // If registering as doctor, also create a Doctor profile
      if (role === 'doctor') {
        await Doctor.create({
          user: user._id,
          specialty: req.body.specialty || 'General Practice',
          fee: req.body.fee || 100,
          licenseNumber: licenseNumber || '',
          location: req.body.location || '',
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ──────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user & return JWT
// @access  Public
// ──────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user and include password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(user._id);

      // If doctor, fetch doctor-specific info
      let doctorInfo = null;
      if (user.role === 'doctor') {
        doctorInfo = await Doctor.findOne({ user: user._id });
      }

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          ...(doctorInfo && { specialty: doctorInfo.specialty }),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ──────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged-in user's profile
// @access  Private
// ──────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        bloodType: user.bloodType,
        address: user.address,
        avatar: user.avatar,
        createdAt: user.createdAt,
        ...(doctorProfile && { doctorProfile }),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
// ──────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, email, dob, gender, bloodType, address } = req.body;

    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (bloodType) user.bloodType = bloodType;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        bloodType: user.bloodType,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
// ──────────────────────────────────────────────
router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user = await User.findById(req.user._id).select('+password');
      const isMatch = await user.matchPassword(req.body.currentPassword);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      user.password = req.body.newPassword;
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ──────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @desc    Generate password reset OTP code
// @access  Public
// ──────────────────────────────────────────────
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email address' });
      }

      // Generate reset code
      const resetCode = user.generateResetToken();
      await user.save({ validateBeforeSave: false });

      // In production, send this code via email
      // For now, return it in the response
      res.json({
        success: true,
        message: 'Password reset code generated successfully',
        resetCode, // In production, remove this and send via email
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ──────────────────────────────────────────────
// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP code
// @access  Public
// ──────────────────────────────────────────────
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('resetCode').notEmpty().withMessage('Reset code is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, resetCode, newPassword } = req.body;

      // Hash the provided code to compare with stored hash
      const crypto = require('crypto');
      const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

      const user = await User.findOne({
        email,
        resetPasswordToken: hashedCode,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
      }

      // Set new password
      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      res.json({ success: true, message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
