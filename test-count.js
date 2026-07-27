const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://rutujaghadge79:123@rutuja-shard-00-01.2jshv.mongodb.net/Medicare?retryWrites=true&w=majority');
    
    const User = require('./backend/models/User');
    const Appointment = require('./backend/models/Appointment');
    
    const patient = await User.findOne({ email: 'reeshoo@gmail.com' });
    if (!patient) {
      console.log('No user reeshoo@gmail.com found');
    } else {
      console.log('Patient found:', patient._id);
      const appts = await Appointment.find({ patient: patient._id });
      console.log('Appointments for patient:', appts.length);
      console.log('Appts details:', JSON.stringify(appts, null, 2));
    }
    
    const allAppts = await Appointment.find();
    console.log('Total appointments in DB:', allAppts.length);
    if(allAppts.length > 0) {
      console.log('First appt patient ID:', allAppts[0].patient);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
