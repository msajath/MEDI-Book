const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

// ──────────────────────────────────────────────
// @route   GET /api/admin/stats
// @desc    Get platform-wide statistics
// @access  Private (admin only)
// ──────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const monthlyAppointments = await Appointment.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }, // from 1st of current month
    });
    const pendingApprovals = await User.countDocuments({ role: 'doctor', isVerified: false });

    // Calculate revenue (sum of all confirmed appointment fees)
    const confirmedAppointments = await Appointment.find({ status: 'confirmed' }).populate('doctor');
    const revenue = confirmedAppointments.reduce((sum, appt) => sum + (appt.doctor?.fee || 0), 0);

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers.toLocaleString(),
        totalDoctors: totalDoctors.toLocaleString(),
        totalPatients: totalPatients.toLocaleString(),
        totalAppointments: totalAppointments.toLocaleString(),
        monthlyAppointments: monthlyAppointments.toLocaleString(),
        pendingApprovals: pendingApprovals.toString(),
        revenue: `$${revenue.toLocaleString()}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (admin only)
// ──────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   PUT /api/admin/verify-doctor/:userId
// @desc    Verify/approve a doctor account
// @access  Private (admin only)
// ──────────────────────────────────────────────
router.put('/verify-doctor/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'doctor') {
      return res.status(400).json({ success: false, message: 'User is not a doctor' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ success: true, message: `Dr. ${user.name} has been verified`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   POST /api/admin/doctors
// @desc    Add a new doctor to the system
// @access  Private (admin only)
// ──────────────────────────────────────────────
router.post('/doctors', async (req, res) => {
  try {
    const { name, email, password, specialty, fee } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // 2. Create User document
    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      isVerified: true // Pre-verified since admin is adding them
    });

    // 3. Create Doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      specialty: specialty || 'General Practice',
      fee: fee || 100
    });

    // 4. Create default Availability
    const defaultAvailability = [
      { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Wednesday', enabled: true, start: '10:00', end: '16:00' },
      { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Friday', enabled: true, start: '09:00', end: '14:00' },
      { day: 'Saturday', enabled: false, start: '00:00', end: '00:00' },
      { day: 'Sunday', enabled: false, start: '00:00', end: '00:00' },
    ];
    
    await Availability.create({
      doctor: doctor._id,
      schedule: defaultAvailability
    });

    res.status(201).json({ success: true, message: 'Doctor added successfully', user, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   DELETE /api/admin/users/:userId
// @desc    Delete a user account
// @access  Private (admin only)
// ──────────────────────────────────────────────
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Also delete doctor profile if applicable
    if (user.role === 'doctor') {
      await Doctor.deleteOne({ user: user._id });
    }

    // Delete user's appointments
    await Appointment.deleteMany({
      $or: [{ patient: user._id }],
    });

    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: `User ${user.name} has been deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   GET /api/admin/recent-activity
// @desc    Get recent platform activity
// @access  Private (admin only)
// ──────────────────────────────────────────────
router.get('/recent-activity', async (req, res) => {
  try {
    // Fetch recent appointments
    const recentAppointments = await Appointment.find()
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('patient', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch recently registered users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    // Build activity feed
    const activity = [];

    recentAppointments.forEach((appt) => {
      activity.push({
        id: appt._id,
        type: 'booking',
        message: `${appt.patient?.name || 'A patient'} booked with ${appt.doctor?.user?.name || 'a doctor'}`,
        time: appt.createdAt,
        icon: 'calendar_today',
      });
    });

    recentUsers.forEach((user) => {
      activity.push({
        id: user._id,
        type: 'registration',
        message: `${user.name} registered as ${user.role}`,
        time: user.createdAt,
        icon: 'person_add',
      });
    });

    // Sort by time descending
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({ success: true, activity: activity.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
