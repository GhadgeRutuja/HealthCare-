const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function testPassword() {
  try {
    console.log('🔍 Testing password for: rutuja@gmail.com');
    const user = await User.findOne({ email: 'rutuja@gmail.com' }).select('+password');
    
    if (user) {
      console.log('✅ User found');
      console.log('Stored password hash:', user.password);
      
      const testPasswords = ['rutuja', 'Rutuja', 'rutuja123', 'password', 'password123'];
      
      for (const testPass of testPasswords) {
        console.log(`\n🔐 Testing password: "${testPass}"`);
        const isMatch = await bcrypt.compare(testPass, user.password);
        console.log(`Result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        
        if (isMatch) {
          console.log(`🎯 CORRECT PASSWORD FOUND: "${testPass}"`);
          break;
        }
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

testPassword();
