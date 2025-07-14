const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    const plainPassword = 'test123';
    console.log('🔐 Testing bcrypt with password:', plainPassword);
    
    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    console.log('✅ Hashed password:', hashedPassword);
    console.log('✅ Hash length:', hashedPassword.length);
    
    // Compare the password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('✅ Comparison result:', isMatch);
    
    // Test with wrong password
    const wrongMatch = await bcrypt.compare('wrongpassword', hashedPassword);
    console.log('✅ Wrong password result:', wrongMatch);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testBcrypt();
