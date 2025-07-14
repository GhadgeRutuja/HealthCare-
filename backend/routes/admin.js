const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
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
    
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const pendingVerifications = await Doctor.countDocuments({ status: 'pending_verification' });
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    
    // Mock appointments count for now (until we have appointments model)
    const totalAppointments = 0;
    
    const stats = {
      totalUsers,
      totalDoctors,
      pendingVerifications,
      verifiedDoctors,
      totalAppointments,
      systemHealth: 'online'
    };
    
    console.log('Sending admin stats:', stats);
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
      userId: doctor.user?._id
    }));
    
    console.log(`Found ${doctorsWithUserInfo.length} doctors`);
    res.json(doctorsWithUserInfo);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
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
    ).populate('userId', 'name email');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Error updating doctor status' });
  }
});

// Get all appointments (placeholder - will be implemented when appointments model is ready)
router.get('/appointments', protect, adminAuth, async (req, res) => {
  try {
    console.log('Admin appointments request from user:', req.user.id);
    
    // Mock data for now - replace with real appointment fetching when model is ready
    const appointments = [];
    
    console.log(`Found ${appointments.length} appointments`);
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
