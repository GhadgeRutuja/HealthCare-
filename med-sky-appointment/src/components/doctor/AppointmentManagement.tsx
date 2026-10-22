import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Search,
  Plus,
  Edit3,
  Check,
  X,
  AlertCircle,
  FileText,
  Video,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { User as UserType, appointmentsApi, usersApi } from '@/services/api';

interface AppointmentManagementProps {
  user: UserType;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  symptoms?: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [patients, setPatients] = useState<UserType[]>([]);
  const [creating, setCreating] = useState(false);
  const [newApt, setNewApt] = useState({
    patientId: '',
    date: selectedDate,
    time: '09:00',
    reason: '',
    notes: ''
  });

  // Generate time slots for the day
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: TimeSlot[] = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const appointment = appointments.find(
            apt => apt.date === selectedDate && apt.time === timeString && ['scheduled', 'confirmed', 'in-progress'].includes(apt.status)
          );
          
          slots.push({
            time: timeString,
            available: !appointment,
            appointmentId: appointment?.id
          });
        }
      }
      
      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, [appointments, selectedDate]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsAndPatients = async () => {
      try {
        setLoading(true);
        const [response, patientsRes] = await Promise.all([
          appointmentsApi.getAll(),
          usersApi.getPatients()
        ]);
        
        if (patientsRes.success && patientsRes.data) {
          setPatients(patientsRes.data);
        }

        if (response.success && response.data) {
          const mappedAppointments: Appointment[] = response.data.map((apt: any) => {
            const aptDateObj = new Date(apt.appointmentDate);
            const aptDateStr = `${aptDateObj.getFullYear()}-${String(aptDateObj.getMonth() + 1).padStart(2, '0')}-${String(aptDateObj.getDate()).padStart(2, '0')}`;
            return {
              id: apt._id,
              patientId: apt.patient?._id || '',
              patientName: apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient',
              patientEmail: apt.patient?.email || '',
              patientPhone: apt.patient?.phone || '',
              date: aptDateStr,
              time: apt.appointmentTime || '09:00',
              duration: apt.duration || 30,
              type: apt.type || 'consultation',
              status: apt.status || 'scheduled',
              reason: apt.reason || 'General Consultation',
              notes: apt.notes,
              symptoms: apt.symptoms || [],
              urgency: apt.urgency || 'medium',
              location: apt.location,
              isVirtual: apt.isVirtual || false,
              meetingLink: apt.meetingLink,
              reminderSent: apt.reminderSent || false,
              createdAt: apt.createdAt || new Date().toISOString(),
              updatedAt: apt.updatedAt || new Date().toISOString()
            };
          });
          
          setAppointments(mappedAppointments);
          setFilteredAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsAndPatients();
  }, [user._id]);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filter by selected date
    filtered = filtered.filter(apt => apt.date === selectedDate);

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'telemedicine': return <Video className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      case 'follow-up': return <FileText className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentsApi.update(appointmentId, { status: newStatus as any });
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus as any, updatedAt: new Date().toISOString() }
            : apt
        )
      );
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApt.patientId || !newApt.date || !newApt.time || !newApt.reason) return;
    
    try {
      setCreating(true);
      const res = await appointmentsApi.create({
        doctor: user._id,
        patientId: newApt.patientId,
        appointmentDate: newApt.date,
        appointmentTime: newApt.time,
        reason: newApt.reason,
        notes: newApt.notes
      });
      
      if (res.success) {
        setShowNewAppointment(false);
        // Quick local state update to reflect immediately
        const created = res.data as any;
        const aptDateObj = new Date(created.appointmentDate);
        const aptDateStr = `${aptDateObj.getFullYear()}-${String(aptDateObj.getMonth() + 1).padStart(2, '0')}-${String(aptDateObj.getDate()).padStart(2, '0')}`;
        
        // Find patient name from our list
        const patientObj = patients.find(p => p._id === newApt.patientId);
        
        const newAptObj: Appointment = {
          id: created._id,
          patientId: created.patient || newApt.patientId,
          patientName: patientObj ? `${patientObj.firstName} ${patientObj.lastName}` : 'Unknown Patient',
          patientEmail: patientObj?.email || '',
          patientPhone: patientObj?.phone || '',
          date: aptDateStr,
          time: created.appointmentTime || newApt.time,
          duration: created.duration || 30,
          type: created.type || 'consultation',
          status: 'scheduled',
          reason: created.reason || newApt.reason,
          notes: newApt.notes,
          urgency: 'medium',
          isVirtual: false,
          reminderSent: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setAppointments(prev => [...prev, newAptObj]);
        // Reset form
        setNewApt({ patientId: '', date: selectedDate, time: '09:00', reason: '', notes: '' });
      }
    } catch (error) {
      console.error('Failed to create appointment:', error);
      alert('Failed to book appointment: Time slot might be unavailable.');
    } finally {
      setCreating(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date > today).slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
          <p className="text-gray-600">Manage your patient appointments and schedule</p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
            <DialogTrigger asChild>
              <Button className="bg-sky-600 hover:bg-sky-700">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Add a new appointment to your schedule
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select value={newApt.patientId} onValueChange={(val) => setNewApt({...newApt, patientId: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(p => (
                          <SelectItem key={p._id} value={p._id}>{p.firstName} {p.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={newApt.date} onChange={e => setNewApt({...newApt, date: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={newApt.time} onChange={e => setNewApt({...newApt, time: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input value={newApt.reason} onChange={e => setNewApt({...newApt, reason: e.target.value})} placeholder="e.g. Follow-up" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea value={newApt.notes} onChange={e => setNewApt({...newApt, notes: e.target.value})} placeholder="Any additional instructions..." />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowNewAppointment(false)}>Cancel</Button>
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={creating}>
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Schedule'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-sky-600">{getTodayAppointments().length}</p>
              </div>
              <Calendar className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(apt => apt.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Virtual</p>
                <p className="text-2xl font-bold text-purple-600">
                  {appointments.filter(apt => apt.isVirtual).length}
                </p>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Navigation and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <Label htmlFor="date-picker" className="text-sm font-medium">Date</Label>
            <Input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Schedule for {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(appointment.type)}
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.patientName}
                              </h3>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <Badge className={getUrgencyColor(appointment.urgency)}>
                              {appointment.urgency}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{appointment.time} ({appointment.duration} min)</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{appointment.patientEmail}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                            {appointment.isVirtual ? (
                              <div className="flex items-center text-sm text-gray-600">
                                <Video className="h-4 w-4 mr-2" />
                                <span>Virtual Appointment</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{appointment.location || 'Clinic'}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-700 mb-3">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>

                          {appointment.symptoms && appointment.symptoms.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                              <div className="flex flex-wrap gap-1">
                                {appointment.symptoms.map((symptom, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {appointment.notes && (
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={appointment.status} 
                              onValueChange={(val) => handleStatusChange(appointment.id, val)}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled (Pending)</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="no-show">No Show</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingAppointment(appointment)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            
                            {appointment.isVirtual && appointment.meetingLink && (
                              <Button variant="outline" size="sm">
                                <Video className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No matching appointments found' 
                      : 'No appointments scheduled'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : `No appointments scheduled for ${new Date(selectedDate).toLocaleDateString()}`
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={`p-2 text-center text-sm rounded-md border ${
                      slot.available 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {getUpcomingAppointments().length > 0 ? (
                <div className="space-y-3">
                  {getUpcomingAppointments().map((appointment) => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{appointment.patientName}</p>
                        <Badge className={getStatusColor(appointment.status)} variant="secondary">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">{appointment.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">
                  No upcoming appointments
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
