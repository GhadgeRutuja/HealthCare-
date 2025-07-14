const express = require('express');
const router = express.Router();

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Appointments endpoint working',
    data: [
      {
        id: 1,
        patientName: 'John Doe',
        doctorName: 'Dr. Sarah Johnson',
        date: '2025-07-15',
        time: '10:00 AM',
        status: 'confirmed'
      }
    ]
  });
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Appointment booking endpoint - Coming soon!',
    data: req.body
  });
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Appointment details for ID: ${req.params.id}`
  });
});

module.exports = router;
