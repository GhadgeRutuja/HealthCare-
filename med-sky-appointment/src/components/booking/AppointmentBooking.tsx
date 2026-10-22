
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { appointmentsApi, doctorsApi, Doctor } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface AppointmentBookingProps {
  preselectedDoctor?: string | null;
  preselectedDoctorId?: string | null;
  preselectedSpecialty?: string | null;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  preselectedDoctor, 
  preselectedDoctorId,
  preselectedSpecialty 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbDoctors, setDbDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (!user) return;

    setPatientName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
    setPatientEmail(user.email || '');
    setPatientPhone(user.phone || '');
  }, [user]);

  // Set preselected values and fetch doctors when component mounts
  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctor(preselectedDoctorId);
    } else if (preselectedDoctor) {
      setSelectedDoctor(preselectedDoctor); // fallback for existing string matches
    }
    
    if (preselectedSpecialty) {
      setSelectedDepartment(preselectedSpecialty);
    }
    
    // Fetch real doctors
    const fetchDoctors = async () => {
      try {
        const res = await doctorsApi.getAll({ limit: 100 });
        if (res.success) {
          setDbDoctors(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };
    
    fetchDoctors();
  }, [preselectedDoctorId, preselectedDoctor, preselectedSpecialty]);

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Ophthalmology',
    'General Medicine'
  ];

  const displayDoctors = dbDoctors.length > 0 
    ? dbDoctors.map(doc => ({ 
        id: doc._id, 
        name: `Dr. ${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`, 
        department: doc.specialties?.[0] || 'General' 
      }))
    : [
        { id: '1', name: 'Dr. Sarah Johnson', department: 'Cardiology' },
        { id: '2', name: 'Dr. Michael Chen', department: 'Neurology' },
        { id: '3', name: 'Dr. Emily Davis', department: 'Pediatrics' },
      ];

  // Bulletproof fallback: if a doctor is preselected but not in the fetched list (e.g., due to pagination), add them
  if (preselectedDoctorId && preselectedDoctor && dbDoctors.length > 0) {
    if (!displayDoctors.some(d => d.id === preselectedDoctorId)) {
      displayDoctors.push({
        id: preselectedDoctorId,
        name: preselectedDoctor,
        department: preselectedSpecialty || 'General'
      });
    }
  }

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedDoctor) return;
    
    if (!user) {
      alert("You must be logged in as a patient to book an appointment.");
      navigate('/login/patient');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert "10:30 AM" to "10:30" or "02:00 PM" to "14:00"
      const [time, modifier] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
      const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;

      const res = await appointmentsApi.create({
        doctor: selectedDoctor, // This is now the doctor's ID
        appointmentDate: selectedDate.toISOString(),
        appointmentTime: formattedTime,
        reason: symptoms || 'General Checkup',
      });
      
      if (res.success) {
        setIsBookingConfirmed(true);
      }
    } catch (err) {
      console.error("Failed to book appointment", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <p><strong>Doctor:</strong> {displayDoctors.find(d => d.id === selectedDoctor)?.name || selectedDoctor}</p>
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
                  <Button 
                    className="bg-sky-600 hover:bg-sky-700"
                    onClick={() => navigate('/dashboard')}
                  >
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
                        {dbDoctors.length === 0 ? (
                          <div className="h-10 px-3 py-2 border rounded-md bg-slate-50 text-sm text-slate-500 flex items-center">
                            Loading doctors...
                          </div>
                        ) : (
                          <Select value={selectedDoctor || undefined} onValueChange={setSelectedDoctor}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {displayDoctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name} - {doctor.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
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

                  <Button type="submit" disabled={isSubmitting} className="w-full gradient-sky text-white hover:opacity-90 h-12 text-lg">
                    {isSubmitting ? "Booking..." : "Book Appointment"}
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
                    <p className="text-sm text-gray-600">{displayDoctors.find(d => d.id === selectedDoctor)?.name || "Not selected"}</p>
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
