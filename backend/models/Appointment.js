const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  duration: {
    type: Number,
    default: 30, // minutes
    min: 15,
    max: 120
  },
  appointmentType: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'surgery', 'checkup', 'vaccination'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  symptoms: [{
    type: String,
    maxlength: [100, 'Each symptom cannot be more than 100 characters']
  }],
  notes: {
    patient: {
      type: String,
      maxlength: [1000, 'Patient notes cannot be more than 1000 characters']
    },
    doctor: {
      type: String,
      maxlength: [1000, 'Doctor notes cannot be more than 1000 characters']
    },
    admin: {
      type: String,
      maxlength: [500, 'Admin notes cannot be more than 500 characters']
    }
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    notes: String
  },
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    oxygenSaturation: Number
  },
  diagnosis: [{
    condition: String,
    icd10Code: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    notes: String
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpInstructions: String,
  consultation: {
    fee: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'online'],
      default: 'online'
    },
    transactionId: String
  },
  remindersSent: {
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    lastReminderSent: Date
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number
  },
  rescheduling: {
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    previousDate: Date,
    previousTime: String,
    reason: String,
    rescheduledAt: Date
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function() {
  if (!this.appointmentDate || !this.appointmentTime) return null;
  
  const dateStr = this.appointmentDate.toISOString().split('T')[0];
  return new Date(`${dateStr}T${this.appointmentTime}:00`);
});

// Virtual for appointment end time
appointmentSchema.virtual('appointmentEndTime').get(function() {
  if (!this.appointmentDateTime) return null;
  
  const endTime = new Date(this.appointmentDateTime.getTime() + (this.duration * 60000));
  return endTime.toTimeString().slice(0, 5);
});

// Virtual for status display
appointmentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'scheduled': 'Scheduled',
    'confirmed': 'Confirmed',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'no-show': 'No Show',
    'rescheduled': 'Rescheduled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for priority display
appointmentSchema.virtual('priorityDisplay').get(function() {
  const priorityMap = {
    'low': 'Low Priority',
    'normal': 'Normal',
    'high': 'High Priority',
    'urgent': 'Urgent'
  };
  return priorityMap[this.priority] || this.priority;
});

// Indexes for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ priority: 1 });

// Compound index to prevent double booking
appointmentSchema.index({ 
  doctor: 1, 
  appointmentDate: 1, 
  appointmentTime: 1 
}, { 
  unique: true,
  partialFilterExpression: { 
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] } 
  }
});

// Pre-populate related data
appointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName email phone dateOfBirth gender'
  }).populate({
    path: 'doctor',
    select: 'specialties consultationFee',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  });
  next();
});

// Instance method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentDateTime = this.appointmentDateTime;
  
  if (!appointmentDateTime) return false;
  
  // Can't cancel if appointment is in the past
  if (appointmentDateTime <= now) return false;
  
  // Can't cancel if already cancelled or completed
  if (['cancelled', 'completed', 'no-show'].includes(this.status)) return false;
  
  // Can cancel if at least 2 hours before appointment
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  return hoursUntilAppointment >= 2;
};

// Instance method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const appointmentDateTime = this.appointmentDateTime;
  
  if (!appointmentDateTime) return false;
  
  // Can't reschedule if already cancelled, completed, or no-show
  if (['cancelled', 'completed', 'no-show'].includes(this.status)) return false;
  
  // Can reschedule if at least 24 hours before appointment
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  return hoursUntilAppointment >= 24;
};

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate, options = {}) {
  const query = {
    appointmentDate: {
      $gte: startDate,
      $lte: endDate
    },
    ...options
  };
  
  return this.find(query).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to find today's appointments for a doctor
appointmentSchema.statics.findTodayAppointments = function(doctorId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    doctor: doctorId,
    appointmentDate: {
      $gte: today,
      $lt: tomorrow
    },
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
  }).sort({ appointmentTime: 1 });
};

// Static method to check for conflicts
appointmentSchema.statics.checkConflict = async function(doctorId, date, time, excludeId = null) {
  const query = {
    doctor: doctorId,
    appointmentDate: date,
    appointmentTime: time,
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflict = await this.findOne(query);
  return !!conflict;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
