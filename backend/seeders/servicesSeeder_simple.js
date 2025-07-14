const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Service = require('../models/Service');

// Simple services data that matches the Service model
const sampleServices = [
  {
    title: 'General Consultation',
    slug: 'general-consultation',
    description: 'Comprehensive health check-up and consultation with our experienced general practitioners.',
    category: 'General Medicine',
    features: [
      'Complete physical examination',
      'Medical history review',
      'Basic health screening',
      'Prescription management',
      'Health recommendations'
    ],
    availability: 'Mon-Fri 9AM-5PM',
    pricing: {
      consultationFee: {
        min: 80,
        max: 120,
        average: 100,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Cardiology Consultation',
    slug: 'cardiology-consultation',
    description: 'Specialized heart health assessment and treatment by certified cardiologists.',
    category: 'Cardiology',
    features: [
      'ECG and heart monitoring',
      'Blood pressure assessment',
      'Cardiovascular risk evaluation',
      'Treatment planning',
      'Lifestyle recommendations'
    ],
    availability: 'Mon-Fri 8AM-6PM',
    pricing: {
      consultationFee: {
        min: 250,
        max: 350,
        average: 300,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Pediatric Care',
    slug: 'pediatric-care',
    description: 'Comprehensive healthcare services for children from newborns to adolescents.',
    category: 'Pediatrics',
    features: [
      'Growth and development assessment',
      'Vaccination services',
      'Childhood illness treatment',
      'Nutritional guidance',
      'Parent education and support'
    ],
    availability: 'Mon-Sat 8AM-7PM',
    pricing: {
      consultationFee: {
        min: 120,
        max: 180,
        average: 150,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Orthopedic Consultation',
    slug: 'orthopedic-consultation',
    description: 'Expert diagnosis and treatment of bone, joint, and muscle conditions.',
    category: 'Orthopedics',
    features: [
      'Musculoskeletal examination',
      'X-ray interpretation',
      'Treatment plan development',
      'Physical therapy recommendations',
      'Surgical consultation if needed'
    ],
    availability: 'Mon-Fri 7AM-5PM',
    pricing: {
      consultationFee: {
        min: 200,
        max: 300,
        average: 250,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Eye Examination',
    slug: 'eye-examination',
    description: 'Comprehensive eye health assessment and vision testing by ophthalmologists.',
    category: 'Ophthalmology',
    features: [
      'Visual acuity testing',
      'Eye pressure measurement',
      'Retinal examination',
      'Prescription eye wear fitting',
      'Eye disease screening'
    ],
    availability: 'Mon-Fri 9AM-6PM',
    pricing: {
      consultationFee: {
        min: 150,
        max: 250,
        average: 200,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Neurological Assessment',
    slug: 'neurological-assessment',
    description: 'Specialized evaluation and treatment of nervous system disorders.',
    category: 'Neurology',
    features: [
      'Neurological examination',
      'Cognitive assessment',
      'Reflex and coordination testing',
      'Brain function evaluation',
      'Treatment recommendations'
    ],
    availability: 'Mon-Thu 8AM-5PM',
    pricing: {
      consultationFee: {
        min: 250,
        max: 320,
        average: 280,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Dermatology Consultation',
    slug: 'dermatology-consultation',
    description: 'Skin health assessment and treatment of dermatological conditions.',
    category: 'Dermatology',
    features: [
      'Skin examination',
      'Mole and lesion screening',
      'Acne treatment',
      'Cosmetic consultations',
      'Skin care recommendations'
    ],
    availability: 'Mon-Fri 10AM-4PM',
    pricing: {
      consultationFee: {
        min: 150,
        max: 220,
        average: 180,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Mental Health Consultation',
    slug: 'mental-health-consultation',
    description: 'Professional mental health assessment and therapy services.',
    category: 'Psychiatry',
    features: [
      'Mental health screening',
      'Therapy sessions',
      'Medication management',
      'Stress management techniques',
      'Follow-up care planning'
    ],
    availability: 'Mon-Fri 9AM-7PM',
    pricing: {
      consultationFee: {
        min: 180,
        max: 260,
        average: 220,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Emergency Care',
    slug: 'emergency-care',
    description: '24/7 emergency medical services for urgent health conditions.',
    category: 'Emergency Medicine',
    features: [
      'Immediate medical attention',
      'Trauma care',
      'Critical condition stabilization',
      'Emergency procedures',
      'Rapid diagnostic services'
    ],
    availability: '24/7',
    pricing: {
      consultationFee: {
        min: 350,
        max: 500,
        average: 400,
        currency: 'USD'
      }
    },
    isActive: true
  },
  {
    title: 'Surgical Consultation',
    slug: 'surgical-consultation',
    description: 'Pre-operative consultation and surgical planning with experienced surgeons.',
    category: 'Surgery',
    features: [
      'Surgical assessment',
      'Pre-operative planning',
      'Risk evaluation',
      'Post-operative care planning',
      'Alternative treatment options'
    ],
    availability: 'Mon-Fri 7AM-4PM',
    pricing: {
      consultationFee: {
        min: 300,
        max: 400,
        average: 350,
        currency: 'USD'
      }
    },
    isActive: true
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Clear existing services
const clearServices = async () => {
  try {
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');
  } catch (error) {
    console.error('❌ Error clearing services:', error);
  }
};

// Seed services
const seedServices = async () => {
  try {
    const services = await Service.insertMany(sampleServices);
    console.log('🏥 Created sample services');
    return services;
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
};

// Main seeder function
const seedServicesData = async () => {
  try {
    console.log('🌱 Starting services seeding...');
    
    await connectDB();
    await clearServices();
    
    const services = await seedServices();
    
    console.log('🎉 Services seeding completed successfully!');
    console.log(`📊 Created: ${services.length} services`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Services seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedServicesData();
}

module.exports = { seedServicesData };
