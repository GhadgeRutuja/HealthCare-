const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function verifyAuth() {
  try {
    console.log('🔍 Checking authentication for: finaltest@test.com');
    
    // Find the user
    const user = await User.findOne({ email: 'finaltest@test.com' }).select('+password');
    
    if (user) {
      console.log('✅ User found');
      console.log('Email:', user.email);
      console.log('Password hash:', user.password);
      console.log('Password hash length:', user.password.length);
      
      // Test password matching
      const testPassword = 'test123';
      console.log(`\n🔐 Testing password: "${testPassword}"`);
      
      // Method 1: Using the model's matchPassword method
      const isMatch1 = await user.matchPassword(testPassword);
      console.log('✅ Model matchPassword result:', isMatch1);
      
      // Method 2: Using bcrypt directly
      const bcrypt = require('bcryptjs');
      const isMatch2 = await bcrypt.compare(testPassword, user.password);
      console.log('✅ Direct bcrypt compare result:', isMatch2);
      
      if (isMatch1 || isMatch2) {
        console.log('🎯 SUCCESS: Password verification works!');
      } else {
        console.log('❌ FAILED: Password verification not working');
        console.log('This suggests the password is not being hashed correctly during registration');
      }
      
    } else {
      console.log('❌ User not found');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

verifyAuth();
