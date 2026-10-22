const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @desc    Get all appointments for the logged-in user
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'patient') {
      // Find all appointments for this patient
      appointments = await Appointment.find({ patient: req.user._id })
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'firstName lastName profileImage' }
        })
        .sort({ appointmentDate: 1, appointmentTime: 1 });
    } else if (req.user.role === 'doctor') {
      // Find the doctor profile associated with this user
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }
      
      // Find all appointments for this doctor
      appointments = await Appointment.find({ doctor: doctorProfile._id })
        .populate('patient', 'firstName lastName email profileImage dateOfBirth gender')
        .sort({ appointmentDate: 1, appointmentTime: 1 });
    } else {
      // Admin - return all
      appointments = await Appointment.find()
        .populate('patient', 'firstName lastName')
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'firstName lastName' }
        });
    }

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { doctor, patientId, appointmentDate, appointmentTime, reason, notes } = req.body;

    let targetDoctorId = doctor;
    let targetPatientId = req.user._id;

    let doctorExists;
    if (req.user.role === 'doctor') {
      // Doctor is creating the appointment
      doctorExists = await Doctor.findOne({ user: req.user._id });
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }
      targetDoctorId = doctorExists._id;
      if (!patientId) {
        return res.status(400).json({ success: false, message: 'Please select a patient' });
      }
      targetPatientId = patientId;
    } else if (req.user.role === 'admin') {
      // Admin is creating the appointment
      if (!targetDoctorId) {
        return res.status(400).json({ success: false, message: 'Please select a doctor' });
      }
      if (!patientId) {
        return res.status(400).json({ success: false, message: 'Please select a patient' });
      }
      targetPatientId = patientId;
      doctorExists = await Doctor.findById(targetDoctorId);
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
    } else {
      // Patient is creating the appointment
      if (!targetDoctorId) {
        return res.status(400).json({ success: false, message: 'Please select a doctor' });
      }
      doctorExists = await Doctor.findById(targetDoctorId);
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
    }

    if (!appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, time, and reason'
      });
    }

    // Check for conflict
    const conflict = await Appointment.checkConflict(targetDoctorId, new Date(appointmentDate), appointmentTime);
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = await Appointment.create({
      patient: targetPatientId,
      doctor: targetDoctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      notes: notes ? { patient: notes } : undefined,
      consultation: {
        fee: doctorExists.consultationFee || 500,
        paymentStatus: 'pending'
      }
    });

    // Create Notification for the doctor
    const notification = await Notification.create({
      user: doctorExists.user, // Doctor's user ID
      type: 'new_appointment',
      title: 'New Appointment Booked',
      message: `${req.user.firstName} ${req.user.lastName} has booked an appointment for ${appointmentDate} at ${appointmentTime}.`,
      relatedId: appointment._id
    });

    // Emit live notification if doctor is online
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    if (io && userSockets) {
      const doctorSocketId = userSockets.get(doctorExists.user.toString());
      if (doctorSocketId) {
        io.to(doctorSocketId).emit('notification', notification);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking appointment',
      error: error.message
    });
  }
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'firstName lastName email phone' }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Ensure the user is authorized to view this appointment
    if (
      req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString() ||
      req.user.role === 'doctor' && appointment.doctor.user._id.toString() !== req.user._id.toString()
    ) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this appointment'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private (Doctor or Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, appointmentDate, appointmentTime, reason, notes } = req.body;
    const appointmentId = req.params.id;

    let appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify ownership or admin rights
    if (
      req.user.role !== 'admin' && 
      (req.user.role === 'doctor' && appointment.doctor.user._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment' });
    }

    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (reason) appointment.reason = reason;
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error while updating appointment' });
  }
});

// @desc    Add or update prescription for an appointment
// @route   PUT /api/appointments/:id/prescription
// @access  Private (Doctor only)
router.put('/:id/prescription', protect, async (req, res) => {
  try {
    // Only doctors can write prescriptions
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can write prescriptions'
      });
    }

    const { medications, notes } = req.body;

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one medication'
      });
    }

    const prescriptionData = {
      medications,
      notes: notes || '',
      dateIssued: Date.now()
    };

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 'consultation.prescriptions': prescriptionData },
        status: 'completed'
      },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Create Notification for the patient
    const notification = await Notification.create({
      user: updatedAppointment.patient,
      type: 'prescription_added',
      title: 'New Prescription',
      message: `Dr. ${req.user.lastName} has written a new prescription for your appointment.`,
      relatedId: updatedAppointment._id
    });

    // Emit live notification if patient is online
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    if (io && userSockets) {
      const patientSocketId = userSockets.get(updatedAppointment.patient.toString());
      if (patientSocketId) {
        io.to(patientSocketId).emit('notification', notification);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Prescription added successfully',
      data: updatedAppointment
    });

  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding prescription'
    });
  }
});

module.exports = router;
