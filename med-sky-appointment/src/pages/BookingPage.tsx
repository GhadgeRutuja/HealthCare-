
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppointmentBooking from '@/components/booking/AppointmentBooking';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const doctorName = searchParams.get('doctor');
  const specialty = searchParams.get('specialty');

  return (
    <div>
      <Navbar />
      <AppointmentBooking 
        preselectedDoctor={doctorName}
        preselectedSpecialty={specialty}
      />
    </div>
  );
};

export default BookingPage;
