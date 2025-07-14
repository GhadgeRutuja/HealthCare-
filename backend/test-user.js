const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function checkUser() {
  try {
    console.log('🔍 Checking for user: rutuja@gmail.com');
    const user = await User.findOne({ email: 'rutuja@gmail.com' }).select('+password');
    
    if (user) {
      console.log('✅ User found:');
      console.log('Email:', user.email);
      console.log('FirstName:', user.firstName);
      console.log('LastName:', user.lastName);
      console.log('Role:', user.role);
      console.log('Is Active:', user.isActive);
      console.log('Has Password:', user.password ? 'Yes' : 'No');
      console.log('Password Hash:', user.password ? user.password.substring(0, 20) + '...' : 'None');
    } else {
      console.log('❌ User not found');
      console.log('Let me check all users in the database...');
      const allUsers = await User.find({}).limit(5);
      console.log('First 5 users in database:');
      allUsers.forEach(u => {
        console.log(`- ${u.email} (${u.firstName} ${u.lastName})`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkUser();
