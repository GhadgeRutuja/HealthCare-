const express = require('express');
const router = express.Router();

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Patients endpoint working',
    data: [
      {
        id: 1,
        name: 'John Smith',
        age: 45,
        email: 'john.smith@email.com',
        phone: '+1 (555) 987-6543',
        appointments: 3
      },
      {
        id: 2,
        name: 'Emma Davis',
        age: 32,
        email: 'emma.davis@email.com',
        phone: '+1 (555) 876-5432',
        appointments: 1
      }
    ]
  });
});

// @desc    Get patient profile
// @route   GET /api/patients/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Patient details for ID: ${req.params.id}`,
    data: {
      id: req.params.id,
      name: 'John Smith',
      age: 45,
      email: 'john.smith@email.com',
      phone: '+1 (555) 987-6543',
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      appointments: 3
    }
  });
});

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private
router.put('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Patient update endpoint - Coming soon!',
    data: req.body
  });
});

module.exports = router;
