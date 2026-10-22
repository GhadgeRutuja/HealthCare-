const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Update the authenticated doctor's profile and schedule.
router.put('/profile', protect, authorize('doctor'), async (req, res) => {
  try {
    const { personalInfo, professionalInfo, schedule } = req.body;
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    if (personalInfo) {
      await User.findByIdAndUpdate(req.user._id, {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        dateOfBirth: personalInfo.dateOfBirth || undefined,
        gender: personalInfo.gender || undefined,
        address: {
          street: personalInfo.address,
          city: personalInfo.city,
          state: personalInfo.state,
          zipCode: personalInfo.zipCode,
          country: personalInfo.country
        }
      });
    }

    if (professionalInfo) {
      doctor.licenseNumber = professionalInfo.medicalLicense;
      doctor.specialties = [professionalInfo.specialty, professionalInfo.subSpecialty]
        .filter(Boolean);
      doctor.education = (professionalInfo.education || [])
        .map((entry) => {
          const match = String(entry).match(/^\s*(.+?)\s*-\s*(.+?)\s*\((\d{4})\)\s*$/);
          return match
            ? {
                degree: match[1],
                institution: match[2],
                graduationYear: Number(match[3])
              }
            : null;
        })
        .filter(Boolean);
      doctor.certifications = (professionalInfo.certifications || [])
        .filter(Boolean)
        .map((name) => ({ name: String(name) }));
      doctor.experience.years = Number(professionalInfo.yearsOfExperience) || 0;
      doctor.consultationFee = Number(professionalInfo.consultationFee) || 0;
      doctor.languages = professionalInfo.languages || [];
      doctor.bio = professionalInfo.biography || '';
      doctor.hospitalAffiliations = professionalInfo.currentHospital
        ? [{ name: professionalInfo.currentHospital }]
        : [];
    }

    if (schedule) {
      const workingDays = new Set(schedule.workingDays || []);
      const workingHours = schedule.workingHours || {};
      Object.keys(doctor.workingHours).forEach((day) => {
        doctor.workingHours[day].isWorking = workingDays.has(
          day.charAt(0).toUpperCase() + day.slice(1)
        );
        doctor.workingHours[day].startTime = workingHours.start || doctor.workingHours[day].startTime;
        doctor.workingHours[day].endTime = workingHours.end || doctor.workingHours[day].endTime;
      });
      doctor.appointmentDuration = schedule.appointmentDuration;
      doctor.maxDailyAppointments = schedule.maxDailyAppointments;
    }

    await doctor.save();
    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate('user', 'firstName lastName email phone profileImage gender dateOfBirth address');

    res.json({ success: true, data: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update doctor profile' });
  }
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialty, search, limit = 10, page = 1 } = req.query;
    let query = { status: 'active' };
    
    // Filter by specialty if provided
    if (specialty) {
      query.specialties = { $in: [specialty] };
    }
    
    // Search by doctor name, designation, or department.
    const searchTerm = typeof search === 'string' ? search.trim() : '';
    if (searchTerm) {
      const searchRegex = new RegExp(escapeRegex(searchTerm), 'i');
      const nameParts = searchTerm
        .split(/\s+/)
        .map((part) => new RegExp(escapeRegex(part), 'i'));
      const matchingUsers = await User.find({
        role: 'doctor',
        $or: nameParts.flatMap((part) => [
          { firstName: part },
          { lastName: part }
        ])
      }).select('_id');

      query.$or = [
        { user: { $in: matchingUsers.map((user) => user._id) } },
        { specialties: searchRegex },
        { 'education.degree': searchRegex },
        { 'certifications.name': searchRegex },
        { 'hospitalAffiliations.position': searchRegex },
        { bio: searchRegex }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const doctors = await Doctor.find(query)
      .populate('user', 'firstName lastName email phone profileImage gender')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Doctor.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDoctors: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'firstName lastName email phone profileImage gender');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor details retrieved successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor details',
      error: error.message
    });
  }
});

module.exports = router;
