const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Service = require('../models/Service');

// Sample services data
const sampleServices = [
  {
    title: 'General Consultation',
    description: 'Comprehensive health check-up and consultation with our experienced general practitioners.',
    category: 'General Medicine',
    basePrice: 100,
    duration: 30,
    isActive: true,
    specialties: ['General Medicine', 'Family Medicine'],
    features: [
      'Complete physical examination',
      'Medical history review',
      'Basic health screening',
      'Prescription management',
      'Health recommendations'
    ]
  },
  {
    title: 'Cardiology Consultation',
    description: 'Specialized heart health assessment and treatment by certified cardiologists.',
    category: 'Cardiology',
    basePrice: 300,
    duration: 45,
    isActive: true,
    specialties: ['Cardiology'],
    features: [
      'ECG and heart monitoring',
      'Blood pressure assessment',
      'Cardiovascular risk evaluation',
      'Treatment planning',
      'Lifestyle recommendations'
    ]
  },
  {
    title: 'Pediatric Care',
    description: 'Comprehensive healthcare services for children from newborns to adolescents.',
    category: 'Pediatrics',
    basePrice: 150,
    duration: 30,
    isActive: true,
    specialties: ['Pediatrics'],
    features: [
      'Growth and development assessment',
      'Vaccination services',
      'Childhood illness treatment',
      'Nutritional guidance',
      'Parent education and support'
    ]
  },
  {
    title: 'Orthopedic Consultation',
    description: 'Expert diagnosis and treatment of bone, joint, and muscle conditions.',
    category: 'Orthopedics',
    basePrice: 250,
    duration: 40,
    isActive: true,
    specialties: ['Orthopedics'],
    features: [
      'Musculoskeletal examination',
      'X-ray interpretation',
      'Treatment plan development',
      'Physical therapy recommendations',
      'Surgical consultation if needed'
    ]
  },
  {
    title: 'Eye Examination',
    description: 'Comprehensive eye health assessment and vision testing by ophthalmologists.',
    category: 'Ophthalmology',
    basePrice: 200,
    duration: 35,
    isActive: true,
    specialties: ['Ophthalmology'],
    features: [
      'Visual acuity testing',
      'Eye pressure measurement',
      'Retinal examination',
      'Prescription eye wear fitting',
      'Eye disease screening'
    ]
  },
  {
    title: 'Neurological Assessment',
    description: 'Specialized evaluation and treatment of nervous system disorders.',
    category: 'Neurology',
    basePrice: 280,
    duration: 50,
    isActive: true,
    specialties: ['Neurology'],
    features: [
      'Neurological examination',
      'Cognitive assessment',
      'Reflex and coordination testing',
      'Brain function evaluation',
      'Treatment recommendations'
    ]
  },
  {
    title: 'Dermatology Consultation',
    description: 'Skin health assessment and treatment of dermatological conditions.',
    category: 'Dermatology',
    basePrice: 180,
    duration: 30,
    isActive: true,
    specialties: ['Dermatology'],
    features: [
      'Skin examination',
      'Mole and lesion screening',
      'Acne treatment',
      'Cosmetic consultations',
      'Skin care recommendations'
    ]
  },
  {
    title: 'Mental Health Consultation',
    description: 'Professional mental health assessment and therapy services.',
    category: 'Psychiatry',
    basePrice: 220,
    duration: 60,
    isActive: true,
    specialties: ['Psychiatry'],
    features: [
      'Mental health screening',
      'Therapy sessions',
      'Medication management',
      'Stress management techniques',
      'Follow-up care planning'
    ]
  },
  {
    title: 'Emergency Care',
    description: '24/7 emergency medical services for urgent health conditions.',
    category: 'Emergency Medicine',
    basePrice: 400,
    duration: 60,
    isActive: true,
    specialties: ['Emergency Medicine'],
    features: [
      'Immediate medical attention',
      'Trauma care',
      'Critical condition stabilization',
      'Emergency procedures',
      'Rapid diagnostic services'
    ]
  },
  {
    title: 'Surgical Consultation',
    description: 'Pre-operative consultation and surgical planning with experienced surgeons.',
    category: 'Surgery',
    basePrice: 350,
    duration: 45,
    isActive: true,
    specialties: ['Surgery'],
    features: [
      'Surgical assessment',
      'Pre-operative planning',
      'Risk evaluation',
      'Post-operative care planning',
      'Alternative treatment options'
    ]
  },
  {
    title: 'Preventive Health Screening',
    description: 'Comprehensive health screening package for early disease detection.',
    category: 'Preventive Care',
    basePrice: 300,
    duration: 90,
    isActive: true,
    specialties: ['General Medicine', 'Internal Medicine'],
    features: [
      'Complete blood panel',
      'Cancer screening tests',
      'Cardiovascular assessment',
      'Diabetes screening',
      'Health risk evaluation'
    ]
  },
  {
    title: 'Telemedicine Consultation',
    description: 'Remote medical consultation via video call for non-emergency conditions.',
    category: 'Telemedicine',
    basePrice: 80,
    duration: 20,
    isActive: true,
    specialties: ['General Medicine', 'Family Medicine'],
    features: [
      'Video consultation',
      'Digital prescription',
      'Medical advice',
      'Follow-up scheduling',
      'Health monitoring'
    ]
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
