
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, MapPin, CheckCircle } from 'lucide-react';

interface AppointmentBookingProps {
  preselectedDoctor?: string | null;
  preselectedSpecialty?: string | null;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  preselectedDoctor, 
  preselectedSpecialty 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Set preselected values when component mounts
  useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDoctor(preselectedDoctor);
    }
    if (preselectedSpecialty) {
      setSelectedDepartment(preselectedSpecialty);
    }
  }, [preselectedDoctor, preselectedSpecialty]);

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Ophthalmology',
    'General Medicine'
  ];

  const doctors = [
    { name: 'Dr. Sarah Johnson', department: 'Cardiology', rating: 4.9 },
    { name: 'Dr. Michael Chen', department: 'Neurology', rating: 4.8 },
    { name: 'Dr. Emily Davis', department: 'Pediatrics', rating: 4.9 },
    { name: 'Dr. James Wilson', department: 'Orthopedics', rating: 4.7 },
    { name: 'Dr. Lisa Anderson', department: 'Dermatology', rating: 4.8 }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking appointment:', {
      date: selectedDate,
      time: selectedTime,
      doctor: selectedDoctor,
      department: selectedDepartment,
      patient: { name: patientName, email: patientEmail, phone: patientPhone },
      symptoms
    });
    
    // Show success message
    setIsBookingConfirmed(true);
    
    // In a real app, you would send this data to your backend
    // For now, we'll just show a success message
  };

  return (
    <div className="min-h-screen gradient-sky-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-xl text-gray-600">Schedule your visit with our expert healthcare providers</p>
          {preselectedDoctor && (
            <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg">
              <p className="text-sky-800">
                <strong>Selected Doctor:</strong> {preselectedDoctor} 
                {preselectedSpecialty && ` - ${preselectedSpecialty}`}
              </p>
            </div>
          )}
        </div>

        {isBookingConfirmed ? (
          // Success Message
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0 bg-green-50 border-green-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  Appointment Confirmed!
                </h2>
                <div className="space-y-2 text-green-700 mb-6">
                  <p><strong>Date:</strong> {selectedDate ? format(selectedDate, "PPP") : "N/A"}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Doctor:</strong> {selectedDoctor}</p>
                  <p><strong>Department:</strong> {selectedDepartment}</p>
                </div>
                <p className="text-gray-600 mb-6">
                  A confirmation email has been sent to <strong>{patientEmail}</strong>. 
                  You will also receive a reminder 24 hours before your appointment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setIsBookingConfirmed(false)}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    Book Another Appointment
                  </Button>
                  <Button className="bg-sky-600 hover:bg-sky-700">
                    View My Appointments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Booking Form
          <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-6 w-6 text-sky-600" />
                  <span>Appointment Details</span>
                </CardTitle>
                <CardDescription>
                  Fill in your information to book your appointment
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2 text-sky-600" />
                      Patient Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2 text-sky-600" />
                      Appointment Details
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Department</Label>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Doctor</Label>
                        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map((doctor) => (
                              <SelectItem key={doctor.name} value={doctor.name}>
                                {doctor.name} - {doctor.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label>Preferred Time</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                      <Textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Please describe your symptoms or reason for the appointment"
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gradient-sky text-white hover:opacity-90 h-12 text-lg">
                    Book Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-gray-600">
                      {selectedDate ? format(selectedDate, "PPP") : "Not selected"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-gray-600">{selectedTime || "Not selected"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-medium">Doctor</p>
                    <p className="text-sm text-gray-600">{selectedDoctor || "Not selected"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-medium">Visit Us</p>
                    <p className="text-sm text-gray-600">123 Medical Center Dr, Health City</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
