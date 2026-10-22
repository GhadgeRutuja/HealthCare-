const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Admin middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Access denied' });
  }
};

// Get system statistics
router.get('/stats', protect, adminAuth, async (req, res) => {
  try {
    console.log('Admin stats request from user:', req.user.id);
    
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const pendingVerifications = await Doctor.countDocuments({ status: 'pending_verification' });
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    
    // Get real appointments data
    const appointments = await Appointment.find({}).populate('doctor');
    const totalAppointments = appointments.length;

    // Calculate total revenue from all appointments
    let totalRevenue = 0;
    appointments.forEach(apt => {
      if (apt.consultation?.fee) totalRevenue += apt.consultation.fee;
    });

    // 1. Revenue Data (Last 6 months)
    const revenueData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonth - i;
      let yIndex = currentYear;
      if (mIndex < 0) {
        mIndex += 12;
        yIndex -= 1;
      }
      
      let monthRevenue = 0;
      appointments.forEach(apt => {
        const aptDate = new Date(apt.createdAt);
        if (aptDate.getMonth() === mIndex && aptDate.getFullYear() === yIndex) {
          if (apt.consultation?.fee) monthRevenue += apt.consultation.fee;
        }
      });
      revenueData.push({ name: months[mIndex], revenue: monthRevenue });
    }

    // 2. Appointment Trends (Last 7 days)
    const appointmentTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      // Count appointments for this day
      const count = appointments.filter(a => new Date(a.createdAt).toDateString() === d.toDateString()).length;
      appointmentTrends.push({ name: dateStr, appointments: count });
    }

    // 3. Department Breakdown
    const deptMap = {};
    const doctorsList = await Doctor.find({});
    doctorsList.forEach(doc => {
      const spec = (doc.specialties && doc.specialties[0]) ? doc.specialties[0] : 'General';
      deptMap[spec] = (deptMap[spec] || 0) + 1;
    });
    const departmentBreakdown = Object.keys(deptMap).map(k => ({ name: k, value: deptMap[k] }));
    
    const stats = {
      totalUsers,
      totalDoctors,
      pendingVerifications,
      verifiedDoctors,
      totalAppointments,
      totalRevenue,
      revenueData,
      appointmentTrends,
      departmentBreakdown,
      systemHealth: 'online'
    };
    
    console.log('Sending admin stats summary');
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching system statistics' });
  }
});

// Get all users
router.get('/users', protect, adminAuth, async (req, res) => {
  try {
    console.log('Admin users request from user:', req.user.id);
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create new user (Doctor or Patient)
router.post('/users', protect, adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, gender, dateOfBirth, doctorDetails } = req.body;

    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Only patient or doctor accounts can be created here'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      gender,
      dateOfBirth,
      isVerified: true
    });

    if (role === 'doctor' && doctorDetails) {
      await Doctor.create({
        user: user._id,
        licenseNumber: doctorDetails.licenseNumber,
        specialties: [doctorDetails.specialty],
        experience: { years: doctorDetails.experience || 0 },
        consultationFee: doctorDetails.consultationFee || 100,
        bio: doctorDetails.bio,
        status: 'active',
        isVerified: true
      });
    }

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', protect, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Admin delete user request:', userId);
    
    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete from Doctor collection if they were a doctor
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ user: userId });
    }
    
    console.log('User deleted successfully:', userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Update user status
router.put('/users/:id/status', protect, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    console.log('Admin update user status:', userId, status);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get all doctors
router.get('/doctors', protect, adminAuth, async (req, res) => {
  try {
    console.log('Admin doctors request from user:', req.user.id);
    
    const doctors = await Doctor.find({})
      .populate('user', 'firstName lastName email phone createdAt')
      .sort({ createdAt: -1 });
    
    // Transform data to include user information
    const doctorsWithUserInfo = doctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.user ? `${doctor.user.firstName} ${doctor.user.lastName}` : 'Unknown',
      email: doctor.user?.email,
      phone: doctor.user?.phone,
      specialization: doctor.specialties?.join(', ') || 'Not specified',
      licenseNumber: doctor.licenseNumber,
      experience: doctor.experience?.years ? `${doctor.experience.years} years` : 'Not specified',
      status: doctor.status,
      isVerified: doctor.isVerified,
      createdAt: doctor.createdAt,
      userId: doctor.user?._id,
      consultationFee: doctor.consultationFee,
      bio: doctor.bio,
      education: doctor.education,
      certifications: doctor.certifications,
      languages: doctor.languages,
      hospitalAffiliations: doctor.hospitalAffiliations,
      workingHours: doctor.workingHours,
      appointmentDuration: doctor.appointmentDuration,
      maxDailyAppointments: doctor.maxDailyAppointments
    }));
    
    console.log(`Found ${doctorsWithUserInfo.length} doctors`);
    res.json(doctorsWithUserInfo);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Update doctor details
router.put('/doctors/:id', protect, adminAuth, async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { specialty, experience, consultationFee, licenseNumber, bio } = req.body;
    
    let doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (specialty) {
      doctor.specialties = specialty.split(',').map(s => s.trim());
    }
    if (experience !== undefined) {
      if (!doctor.experience) doctor.experience = {};
      doctor.experience.years = experience;
    }
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (bio !== undefined) doctor.bio = bio;

    await doctor.save();

    res.json({ success: true, message: 'Doctor updated successfully', data: doctor });
  } catch (error) {
    console.error('Error updating doctor details:', error);
    res.status(500).json({ message: 'Error updating doctor details', error: error.message });
  }
});

// Verify doctor
router.put('/doctors/:id/verify', protect, adminAuth, async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log('Admin verify doctor request:', doctorId);
    
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { 
        status: 'active',
        isVerified: true 
      },
      { new: true }
    ).populate('user', 'firstName lastName email');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    console.log('Doctor verified successfully:', doctorId);
    res.json({ 
      message: 'Doctor verified successfully',
      doctor: {
        _id: doctor._id,
        name: doctor.user ? `${doctor.user.firstName} ${doctor.user.lastName}` : 'Unknown',
        status: doctor.status,
        isVerified: doctor.isVerified
      }
    });
  } catch (error) {
    console.error('Error verifying doctor:', error);
    res.status(500).json({ message: 'Error verifying doctor' });
  }
});

// Update doctor status
router.put('/doctors/:id/status', protect, adminAuth, async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { status } = req.body;
    
    console.log('Admin update doctor status:', doctorId, status);
    
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    ).populate('user', 'firstName lastName email');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Error updating doctor status' });
  }
});

// Get all appointments
router.get('/appointments', protect, adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'firstName lastName')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .sort({ createdAt: -1 });
      
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Generate reports (placeholder)
router.post('/reports', protect, adminAuth, async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;
    console.log('Admin generate report request:', reportType, startDate, endDate);
    
    // Mock report generation - implement actual report logic later
    const report = {
      type: reportType,
      generatedAt: new Date(),
      data: {
        message: 'Report generation functionality will be implemented'
      }
    };
    
    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

module.exports = router;
