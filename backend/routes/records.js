const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../middleware/auth');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/records');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only images, PDFs, and Word documents are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// @desc    Upload a new medical record
// @route   POST /api/records/upload
// @access  Private (Patient/Doctor)
router.post('/upload', protect, upload.single('recordFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, recordDate } = req.body;

    if (!title) {
      // Clean up file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }

    // Determine the patient ID
    // If patient uploads, it's their ID. If doctor uploads, it must be provided in body.
    let patientId = req.user._id;
    let doctorId = null;

    if (req.user.role === 'doctor') {
      if (!req.body.patientId) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: 'Please provide a patient ID' });
      }
      patientId = req.body.patientId;
      
      // Look up doctor profile ID
      const Doctor = require('../models/Doctor');
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        doctorId = doctorProfile._id;
      }
    }

    // Construct the public URL
    // Format: /uploads/records/filename.ext
    const fileUrl = `/uploads/records/${req.file.filename}`;

    const newRecord = await MedicalRecord.create({
      patient: patientId,
      doctor: doctorId,
      title: title,
      description: description || '',
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
      originalFileName: req.file.originalname,
      recordDate: recordDate ? new Date(recordDate) : Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Record uploaded successfully',
      data: newRecord
    });
  } catch (error) {
    console.error('Upload Error:', error);
    // Cleanup on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error during upload'
    });
  }
});

// @desc    Get all medical records for the logged-in user
// @route   GET /api/records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let records = [];

    if (req.user.role === 'patient') {
      records = await MedicalRecord.find({ patient: req.user._id })
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'firstName lastName' }
        })
        .sort({ recordDate: -1 });
    } else if (req.user.role === 'doctor') {
      // Find doctor profile
      const Doctor = require('../models/Doctor');
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      
      if (!doctorProfile) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }
      
      // If patientId is provided in query, fetch records for that specific patient
      if (req.query.patientId) {
        records = await MedicalRecord.find({ patient: req.query.patientId })
          .populate({
            path: 'doctor',
            populate: { path: 'user', select: 'firstName lastName' }
          })
          .sort({ recordDate: -1 });
      } else {
        // Otherwise, maybe return records uploaded BY this doctor
        records = await MedicalRecord.find({ doctor: doctorProfile._id })
          .populate('patient', 'firstName lastName')
          .sort({ recordDate: -1 });
      }
    } else {
      // Admin gets all
      records = await MedicalRecord.find()
        .populate('patient', 'firstName lastName')
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'firstName lastName' }
        })
        .sort({ recordDate: -1 });
    }

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching records'
    });
  }
});

// @desc    Delete a medical record
// @route   DELETE /api/records/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Authorization check
    if (req.user.role === 'patient' && record.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this record' });
    }
    
    // Delete the actual file from storage
    const filePath = path.join(__dirname, '../', record.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while deleting record'
    });
  }
});

module.exports = router;
