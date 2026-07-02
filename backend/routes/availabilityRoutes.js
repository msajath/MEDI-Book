const express = require('express');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ──────────────────────────────────────────────
// @route   PUT /api/availability
// @desc    Set/update doctor's weekly availability
// @access  Private (doctor only)
// ──────────────────────────────────────────────
router.put('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const { schedule } = req.body;

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ success: false, message: 'Schedule array is required' });
    }

    // Find the doctor profile for the current user
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Upsert availability
    let availability = await Availability.findOne({ doctor: doctor._id });

    if (availability) {
      availability.schedule = schedule;
      await availability.save();
    } else {
      availability = await Availability.create({
        doctor: doctor._id,
        schedule,
      });
    }

    res.json({ success: true, schedule: availability.schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   GET /api/availability/slots/:doctorId/:date
// @desc    Get available time slots for a specific doctor on a date
// @access  Public
// NOTE: This route MUST be defined before /:doctorId to avoid
//       Express matching "slots" as a doctorId parameter.
// ──────────────────────────────────────────────
router.get('/slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    // Determine day of week from date (use UTC-safe parsing for YYYY-MM-DD)
    const dateParts = date.split('-');
    const dateObj = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Get doctor's availability
    const availability = await Availability.findOne({ doctor: doctorId });

    let daySchedule;
    if (availability) {
      daySchedule = availability.schedule.find((s) => s.day === dayOfWeek);
    }

    if (!daySchedule || !daySchedule.enabled) {
      return res.json({ success: true, slots: { morning: [], afternoon: [], evening: [] }, bookedSlots: [] });
    }

    // Generate 30-min slots within the doctor's hours
    const allSlots = {
      morning: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
      afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
      evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'],
    };

    // Query existing appointments for this doctor on this date
    // that are not cancelled (i.e., pending or confirmed)
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: date,
      status: { $in: ['pending', 'confirmed'] },
    });

    // Collect already-booked time slots
    const bookedSlots = existingAppointments.map((appt) => appt.time);

    res.json({ success: true, slots: allSlots, bookedSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// @route   GET /api/availability/:doctorId
// @desc    Get a doctor's weekly availability
// @access  Public
// ──────────────────────────────────────────────
router.get('/:doctorId', async (req, res) => {
  try {
    const availability = await Availability.findOne({ doctor: req.params.doctorId });

    if (!availability) {
      // Return default schedule if none set
      const defaultSchedule = [
        { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Wednesday', enabled: true, start: '10:00', end: '16:00' },
        { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Friday', enabled: true, start: '09:00', end: '14:00' },
        { day: 'Saturday', enabled: false, start: '10:00', end: '13:00' },
        { day: 'Sunday', enabled: false, start: '', end: '' },
      ];
      return res.json({ success: true, schedule: defaultSchedule });
    }

    res.json({ success: true, schedule: availability.schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
