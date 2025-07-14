const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  detailedDescription: {
    type: String,
    maxlength: [2000, 'Detailed description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Cardiology',
      'Neurology',
      'Ophthalmology', 
      'Orthopedics',
      'Pediatrics',
      'General Medicine',
      'Laboratory Services',
      'Radiology',
      'Pharmacy',
      'Emergency Medicine',
      'Surgery',
      'Dermatology',
      'Psychiatry',
      'Oncology'
    ]
  },
  features: [{
    type: String,
    maxlength: [100, 'Each feature cannot be more than 100 characters']
  }],
  procedures: [{
    name: String,
    description: String,
    duration: Number, // in minutes
    preparationRequired: Boolean,
    averageCost: Number
  }],
  equipment: [{
    name: String,
    description: String,
    model: String
  }],
  specialists: {
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    available: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  availability: {
    type: String,
    required: true,
    default: 'Mon-Fri 9AM-5PM'
  },
  workingHours: {
    monday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    tuesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    wednesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    thursday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    friday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    saturday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '13:00' }
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '13:00' }
    }
  },
  pricing: {
    consultationFee: {
      min: Number,
      max: Number,
      average: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    insuranceAccepted: [{
      provider: String,
      plans: [String]
    }]
  },
  location: {
    building: String,
    floor: String,
    wing: String,
    room: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    alt: String,
    type: {
      type: String,
      enum: ['equipment', 'facility', 'procedure', 'staff']
    }
  }],
  isEmergencyService: {
    type: Boolean,
    default: false
  },
  is24x7Available: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  appointmentRequired: {
    type: Boolean,
    default: true
  },
  averageWaitTime: {
    type: Number, // in minutes
    default: 15
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
  totalAppointments: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  prerequisites: [{
    type: String,
    maxlength: [200, 'Each prerequisite cannot be more than 200 characters']
  }],
  contraindications: [{
    type: String,
    maxlength: [200, 'Each contraindication cannot be more than 200 characters']
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  contactInfo: {
    phone: String,
    email: String,
    extension: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for specialists display
serviceSchema.virtual('specialistsDisplay').get(function() {
  if (this.specialists.count === 0) return 'No specialists available';
  return `${this.specialists.count} ${this.specialists.count === 1 ? 'Specialist' : 'Specialists'}`;
});

// Virtual for availability status
serviceSchema.virtual('availabilityStatus').get(function() {
  if (this.is24x7Available) return '24/7 Available';
  if (this.isEmergencyService) return 'Emergency Service';
  return this.availability;
});

// Virtual for rating display
serviceSchema.virtual('ratingDisplay').get(function() {
  if (this.rating.count === 0) return 'No ratings yet';
  return `${this.rating.average.toFixed(1)} (${this.rating.count} reviews)`;
});

// Virtual for price range display
serviceSchema.virtual('priceRangeDisplay').get(function() {
  if (!this.pricing || !this.pricing.consultationFee) return 'Contact for pricing';
  
  const { min, max, currency = 'USD' } = this.pricing.consultationFee;
  
  if (min && max && min !== max) {
    return `${currency} ${min} - ${max}`;
  } else if (min) {
    return `${currency} ${min}`;
  } else if (max) {
    return `Up to ${currency} ${max}`;
  }
  
  return 'Contact for pricing';
});

// Indexes for better query performance
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isEmergencyService: 1 });
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ 'rating.average': -1 });

// Pre-save middleware to generate slug
serviceSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Instance method to check if service is available on a specific day
serviceSchema.methods.isAvailableOnDay = function(dayName) {
  if (this.is24x7Available) return true;
  
  const day = dayName.toLowerCase();
  return this.workingHours[day] && this.workingHours[day].isAvailable;
};

// Instance method to get working hours for a day
serviceSchema.methods.getWorkingHours = function(dayName) {
  if (this.is24x7Available) {
    return { isAvailable: true, startTime: '00:00', endTime: '23:59' };
  }
  
  const day = dayName.toLowerCase();
  return this.workingHours[day] || { isAvailable: false };
};

// Static method to find services by category
serviceSchema.statics.findByCategory = function(category) {
  return this.find({
    category: category,
    isActive: true
  }).sort({ title: 1 });
};

// Static method to find emergency services
serviceSchema.statics.findEmergencyServices = function() {
  return this.find({
    isEmergencyService: true,
    isActive: true
  }).sort({ title: 1 });
};

// Static method to find 24x7 services
serviceSchema.statics.find24x7Services = function() {
  return this.find({
    is24x7Available: true,
    isActive: true
  }).sort({ title: 1 });
};

// Static method to search services
serviceSchema.statics.searchServices = function(searchTerm) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }
    ]
  }).sort({ 'rating.average': -1 });
};

// Static method to get popular services
serviceSchema.statics.getPopularServices = function(limit = 6) {
  return this.find({
    isActive: true,
    totalAppointments: { $gt: 0 }
  })
  .sort({ totalAppointments: -1, 'rating.average': -1 })
  .limit(limit);
};

module.exports = mongoose.model('Service', serviceSchema);
