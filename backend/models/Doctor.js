const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true
  },
  specialties: [{
    type: String,
    required: true,
    enum: [
      'Cardiology',
      'Neurology', 
      'Ophthalmology',
      'Orthopedics',
      'Pediatrics',
      'General Medicine',
      'Dermatology',
      'Psychiatry',
      'Radiology',
      'Emergency Medicine',
      'Surgery',
      'Internal Medicine',
      'Family Medicine',
      'Oncology',
      'Anesthesiology'
    ]
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear()
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date
  }],
  experience: {
    years: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
      max: 60
    },
    description: String
  },
  workingHours: {
    monday: {
      isWorking: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    tuesday: {
      isWorking: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    wednesday: {
      isWorking: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    thursday: {
      isWorking: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    friday: {
      isWorking: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    saturday: {
      isWorking: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '13:00' }
    },
    sunday: {
      isWorking: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '13:00' }
    }
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: 0
  },
  languages: [{
    type: String,
    default: ['English']
  }],
  hospitalAffiliations: [{
    name: String,
    address: String,
    position: String
  }],
  awards: [{
    title: String,
    organization: String,
    year: Number
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  isAvailableForEmergency: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String, // URLs to uploaded documents
    documentType: {
      type: String,
      enum: ['license', 'degree', 'certificate', 'other']
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for primary specialty
doctorSchema.virtual('primarySpecialty').get(function() {
  return this.specialties && this.specialties.length > 0 ? this.specialties[0] : null;
});

// Virtual for experience level
doctorSchema.virtual('experienceLevel').get(function() {
  if (!this.experience || !this.experience.years) return 'Unknown';
  const years = this.experience.years;
  if (years < 2) return 'New';
  if (years < 5) return 'Junior';
  if (years < 10) return 'Mid-level';
  if (years < 20) return 'Senior';
  return 'Expert';
});

// Virtual for rating display
doctorSchema.virtual('ratingDisplay').get(function() {
  if (!this.rating || this.rating.count === 0) return 'No ratings yet';
  return `${this.rating.average.toFixed(1)} (${this.rating.count} reviews)`;
});

// Indexes for better query performance
doctorSchema.index({ 'user': 1 });
doctorSchema.index({ 'specialties': 1 });
doctorSchema.index({ 'rating.average': -1 });
doctorSchema.index({ 'status': 1 });
doctorSchema.index({ 'isVerified': 1 });

// Pre-populate user data when querying
doctorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email phone profileImage isActive'
  });
  next();
});

// Instance method to check if doctor is available on a specific day
doctorSchema.methods.isAvailableOnDay = function(dayName) {
  const day = dayName.toLowerCase();
  return this.workingHours[day] && this.workingHours[day].isWorking;
};

// Instance method to get available time slots for a day
doctorSchema.methods.getAvailableSlots = function(dayName, appointmentDuration = 30) {
  const day = dayName.toLowerCase();
  const workingDay = this.workingHours[day];
  
  if (!workingDay || !workingDay.isWorking) {
    return [];
  }
  
  const slots = [];
  const startTime = workingDay.startTime;
  const endTime = workingDay.endTime;
  
  // Convert time strings to minutes
  const startMinutes = this.timeToMinutes(startTime);
  const endMinutes = this.timeToMinutes(endTime);
  
  // Generate slots
  for (let time = startMinutes; time < endMinutes; time += appointmentDuration) {
    slots.push(this.minutesToTime(time));
  }
  
  return slots;
};

// Helper method to convert time string to minutes
doctorSchema.methods.timeToMinutes = function(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper method to convert minutes to time string
doctorSchema.methods.minutesToTime = function(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Static method to find doctors by specialty
doctorSchema.statics.findBySpecialty = function(specialty) {
  return this.find({
    specialties: { $in: [specialty] },
    status: 'active',
    isVerified: true
  }).populate('user');
};

// Static method to find highly rated doctors
doctorSchema.statics.findTopRated = function(limit = 10) {
  return this.find({
    status: 'active',
    isVerified: true,
    'rating.count': { $gte: 5 }
  })
  .sort({ 'rating.average': -1 })
  .limit(limit)
  .populate('user');
};

module.exports = mongoose.model('Doctor', doctorSchema);
