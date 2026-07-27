

async function testBooking() {
  try {
    // 1. Login as patient
    // If we don't know a patient, let's just make one or use a known one.
    // Actually, I can just use mongoose directly to create an appointment since we have access to the codebase!
    const mongoose = require('mongoose');
    require('dotenv').config({ path: './backend/.env' });
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://rutujaghadge79:123@rutuja-shard-00-01.2jshv.mongodb.net/Medicare?retryWrites=true&w=majority');
    
    const User = require('./backend/models/User');
    const Doctor = require('./backend/models/Doctor');
    const Appointment = require('./backend/models/Appointment');
    
    const patient = await User.findOne({ role: 'patient' });
    const doctorProfile = await Doctor.findOne();
    
    if (!patient || !doctorProfile) {
      console.log('Missing patient or doctor in DB');
      process.exit(1);
    }

    console.log(`Testing with Patient: ${patient.email} and Doctor: ${doctorProfile._id}`);

    // Let's test the checkConflict logic just like the route does
    const date = new Date();
    date.setDate(date.getDate() + 1); // tomorrow
    const time = '10:30';

    const conflict = await Appointment.checkConflict(doctorProfile._id, date, time);
    console.log(`Conflict check: ${conflict}`);

    const newAppt = new Appointment({
      patient: patient._id,
      doctor: doctorProfile._id,
      appointmentDate: date,
      appointmentTime: time,
      reason: 'Automated Test Check',
      consultation: {
        fee: doctorProfile.consultationFee || 500,
        paymentStatus: 'pending'
      }
    });

    // Test validation
    const validationError = newAppt.validateSync();
    if (validationError) {
      console.error('Validation failed:', validationError.message);
    } else {
      console.log('Validation passed!');
      // We won't save it to not clutter the DB, or we can save and delete
      await newAppt.save();
      console.log('Successfully saved to DB!');
      await Appointment.findByIdAndDelete(newAppt._id);
      console.log('Successfully cleaned up.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testBooking();
