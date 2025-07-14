const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

// Sample users data (doctors and patients)
const sampleUsers = [
  // Doctors
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@medicare.com',
    password: 'password123',
    phone: '+1 (555) 123-4567',
    role: 'doctor',
    profileImage: '/placeholder.svg',
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@medicare.com',
    password: 'password123',
    phone: '+1 (555) 234-5678',
    role: 'doctor',
    profileImage: '/placeholder.svg',
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@medicare.com',
    password: 'password123',
    phone: '+1 (555) 345-6789',
    role: 'doctor',
    profileImage: '/placeholder.svg',
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@medicare.com',
    password: 'password123',
    phone: '+1 (555) 456-7890',
    role: 'doctor',
    profileImage: '/placeholder.svg',
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@medicare.com',
    password: 'password123',
    phone: '+1 (555) 567-8901',
    role: 'doctor',
    profileImage: '/placeholder.svg',
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'James',
    lastName: 'Anderson',
    email: 'james.anderson@medicare.com',
    password: 'password123',
    phone: '+1 (555) 678-9012',
    role: 'doctor',
    profileImage: '/placeholder.svg',
    isActive: true,
    isEmailVerified: true
  },
  // Patients
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    password: 'password123',
    phone: '+1 (555) 987-6543',
    role: 'patient',
    dateOfBirth: new Date('1978-05-15'),
    gender: 'male',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@email.com',
    password: 'password123',
    phone: '+1 (555) 876-5432',
    role: 'patient',
    dateOfBirth: new Date('1992-08-22'),
    gender: 'female',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@email.com',
    password: 'password123',
    phone: '+1 (555) 765-4321',
    role: 'patient',
    dateOfBirth: new Date('1965-12-10'),
    gender: 'male',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    isActive: true,
    isEmailVerified: true
  },
  // Admin user
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@medicare.com',
    password: 'admin123',
    phone: '+1 (555) 000-0000',
    role: 'admin',
    isActive: true,
    isEmailVerified: true
  }
];

// Sample doctors data (to be linked with doctor users)
const sampleDoctors = [
  {
    licenseNumber: 'MD-001-2024',
    specialties: ['Cardiology'],
    education: [{
      degree: 'Doctor of Medicine (MD)',
      institution: 'Harvard Medical School',
      graduationYear: 2010
    }],
    certifications: [{
      name: 'Board Certified Cardiologist',
      issuingOrganization: 'American Board of Internal Medicine',
      issueDate: new Date('2015-06-01'),
      expiryDate: new Date('2025-06-01')
    }],
    experience: {
      years: 15,
      description: 'Specialized in interventional cardiology and heart surgery with over 1000 successful procedures.'
    },
    consultationFee: 300,
    languages: ['English', 'Spanish'],
    bio: 'Dr. Sarah Johnson is a leading cardiologist with expertise in complex heart procedures. She has published numerous research papers and is committed to providing compassionate care.',
    rating: {
      average: 4.9,
      count: 156
    },
    totalPatients: 1250,
    isAvailableForEmergency: true,
    isVerified: true,
    status: 'active'
  },
  {
    licenseNumber: 'MD-002-2024',
    specialties: ['Neurology'],
    education: [{
      degree: 'Doctor of Medicine (MD)',
      institution: 'Johns Hopkins University',
      graduationYear: 2012
    }],
    certifications: [{
      name: 'Board Certified Neurologist',
      issuingOrganization: 'American Board of Neurology',
      issueDate: new Date('2017-03-01'),
      expiryDate: new Date('2027-03-01')
    }],
    experience: {
      years: 12,
      description: 'Expert in treating neurological disorders including stroke, epilepsy, and neurodegenerative diseases.'
    },
    consultationFee: 280,
    languages: ['English', 'Mandarin'],
    bio: 'Dr. Michael Chen specializes in cutting-edge neurological treatments and has helped thousands of patients recover from complex neurological conditions.',
    rating: {
      average: 4.8,
      count: 134
    },
    totalPatients: 980,
    isAvailableForEmergency: false,
    isVerified: true,
    status: 'active'
  },
  {
    licenseNumber: 'MD-003-2024',
    specialties: ['Pediatrics'],
    education: [{
      degree: 'Doctor of Medicine (MD)',
      institution: 'Stanford University School of Medicine',
      graduationYear: 2014
    }],
    certifications: [{
      name: 'Board Certified Pediatrician',
      issuingOrganization: 'American Board of Pediatrics',
      issueDate: new Date('2018-08-01'),
      expiryDate: new Date('2028-08-01')
    }],
    experience: {
      years: 10,
      description: 'Dedicated to providing comprehensive healthcare for children from newborns to adolescents.'
    },
    consultationFee: 200,
    languages: ['English', 'Spanish', 'Portuguese'],
    bio: 'Dr. Emily Rodriguez is passionate about child health and development. She creates a warm, friendly environment that puts both children and parents at ease.',
    rating: {
      average: 4.95,
      count: 203
    },
    totalPatients: 1500,
    isAvailableForEmergency: true,
    isVerified: true,
    status: 'active'
  },
  {
    licenseNumber: 'MD-004-2024',
    specialties: ['Orthopedics'],
    education: [{
      degree: 'Doctor of Medicine (MD)',
      institution: 'Mayo Clinic School of Medicine',
      graduationYear: 2008
    }],
    certifications: [{
      name: 'Board Certified Orthopedic Surgeon',
      issuingOrganization: 'American Board of Orthopedic Surgery',
      issueDate: new Date('2014-10-01'),
      expiryDate: new Date('2024-10-01')
    }],
    experience: {
      years: 17,
      description: 'Expert in joint replacement surgery, sports medicine, and trauma orthopedics.'
    },
    consultationFee: 350,
    languages: ['English'],
    bio: 'Dr. David Thompson has performed over 2000 successful orthopedic surgeries and is renowned for his expertise in joint replacement and sports injuries.',
    rating: {
      average: 4.7,
      count: 89
    },
    totalPatients: 850,
    isAvailableForEmergency: false,
    isVerified: true,
    status: 'active'
  },
  {
    licenseNumber: 'MD-005-2024',
    specialties: ['Ophthalmology'],
    education: [{
      degree: 'Doctor of Medicine (MD)',
      institution: 'University of California, San Francisco',
      graduationYear: 2013
    }],
    certifications: [{
      name: 'Board Certified Ophthalmologist',
      issuingOrganization: 'American Board of Ophthalmology',
      issueDate: new Date('2018-05-01'),
      expiryDate: new Date('2028-05-01')
    }],
    experience: {
      years: 11,
      description: 'Specialized in retinal diseases, cataract surgery, and advanced eye procedures.'
    },
    consultationFee: 250,
    languages: ['English', 'Korean'],
    bio: 'Dr. Lisa Wang is dedicated to preserving and restoring vision through innovative surgical techniques and compassionate patient care.',
    rating: {
      average: 4.85,
      count: 167
    },
    totalPatients: 1100,
    isAvailableForEmergency: false,
    isVerified: true,
    status: 'active'
  },
  {
    licenseNumber: 'MD-006-2024',
    specialties: ['General Medicine', 'Family Medicine'],
    education: [{
      degree: 'Doctor of Medicine (MD)',
      institution: 'University of Michigan Medical School',
      graduationYear: 2011
    }],
    certifications: [{
      name: 'Board Certified Family Medicine',
      issuingOrganization: 'American Board of Family Medicine',
      issueDate: new Date('2016-07-01'),
      expiryDate: new Date('2026-07-01')
    }],
    experience: {
      years: 13,
      description: 'Comprehensive primary care for patients of all ages with focus on preventive medicine.'
    },
    consultationFee: 180,
    languages: ['English'],
    bio: 'Dr. James Anderson provides comprehensive family medicine services and believes in building long-term relationships with his patients and their families.',
    rating: {
      average: 4.6,
      count: 245
    },
    totalPatients: 2100,
    isAvailableForEmergency: false,
    isVerified: true,
    status: 'active'
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

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Service.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = await User.insertMany(sampleUsers);
    console.log('👥 Created sample users');
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Seed doctors
const seedDoctors = async (users) => {
  try {
    const doctorUsers = users.filter(user => user.role === 'doctor');
    const doctorsData = sampleDoctors.map((doctor, index) => ({
      ...doctor,
      user: doctorUsers[index]._id
    }));
    
    const doctors = await Doctor.insertMany(doctorsData);
    console.log('👨‍⚕️ Created sample doctors');
    return doctors;
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    throw error;
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearData();
    
    const users = await seedUsers();
    const doctors = await seedDoctors(users);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created: ${users.length} users, ${doctors.length} doctors`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
