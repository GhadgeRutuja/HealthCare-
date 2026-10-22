import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Heart,
  MapPin,
  Phone,
  Mail,
  Shield,
  Activity,
  Pill,
  AlertCircle,
  Plus,
  Eye,
  Upload,
  Loader2,
  Video,
  Download,
  MessageSquare
} from 'lucide-react';
import { User as UserType, appointmentsApi, recordsApi } from '@/services/api';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import ChatInterface from '../chat/ChatInterface';

interface PatientDashboardProps {
  user: UserType;
}

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  doctor: string;
  fileUrl: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  date: string;
  status: 'active' | 'completed' | 'discontinued';
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const appointmentsRes = await appointmentsApi.getAll();
        
        if (appointmentsRes.success) {
          const mappedAppointments = appointmentsRes.data.map((apt: any) => {
            const doc = apt.doctor?.user || {};
            const dateObj = new Date(apt.appointmentDate);
            return {
              id: apt._id,
              date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: apt.appointmentTime,
              doctor: `${doc.firstName} ${doc.lastName}`,
              specialty: apt.doctor?.specialties?.[0] || 'General',
              type: apt.appointmentType || 'consultation',
              status: apt.status
            };
          });
          setAppointments(mappedAppointments);
          
          const extractedPrescriptions: any[] = [];
          appointmentsRes.data.forEach((apt: any) => {
            if (apt.prescription && apt.prescription.medications && apt.prescription.medications.length > 0) {
              apt.prescription.medications.forEach((med: any, index: number) => {
                const doc = apt.doctor?.user || {};
                extractedPrescriptions.push({
                  id: `${apt._id}-${index}`,
                  medication: med.name,
                  dosage: med.dosage,
                  frequency: med.frequency,
                  duration: med.duration,
                  doctor: `Dr. ${doc.lastName || ''}`,
                  instructions: med.instructions,
                  notes: apt.prescription.notes,
                  date: new Date(apt.updatedAt || apt.appointmentDate).toLocaleDateString(),
                  status: apt.status === 'cancelled' ? 'cancelled' : 'active'
                });
              });
            }
          });
          setPrescriptions(extractedPrescriptions);
        }
        
        const recordsRes = await recordsApi.getAll();
        if (recordsRes.success) {
          const mappedRecords = recordsRes.data.map((rec: any) => ({
            id: rec._id,
            title: rec.title,
            date: new Date(rec.recordDate).toLocaleDateString(),
            doctor: rec.doctor ? `Dr. ${rec.doctor.user?.lastName || ''}` : 'Self Uploaded',
            fileUrl: rec.fileUrl,
            status: rec.status,
            priority: 'medium'
          }));
          setMedicalRecords(mappedRecords);
        } else {
          setMedicalRecords([]);
        }
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user._id]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('recordFile', uploadFile);
      formData.append('title', uploadTitle);

      const res = await recordsApi.upload(formData);
      if (res.success) {
        const rec = res.data;
        setMedicalRecords([{
            id: rec._id,
            title: rec.title,
            date: new Date(rec.recordDate).toLocaleDateString(),
            doctor: 'Self Uploaded',
            fileUrl: rec.fileUrl,
            status: rec.status,
            priority: 'medium'
        }, ...medicalRecords]);
        setUploadFile(null);
        setUploadTitle('');
      }
    } catch (error: any) {
      alert(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => ['scheduled', 'confirmed', 'in-progress', 'rescheduled'].includes(apt.status))
    .slice(0, 3);
  const activePrescriptions = prescriptions.filter(rx => rx.status === 'active').slice(0, 3);
  const recentRecords = medicalRecords.slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 px-8 py-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-sky-600" />
          <p className="text-slate-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(180deg,_#f8fcff_0%,_#eef7fb_42%,_#f9fbfd_100%)] flex flex-col">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-0 top-36 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 sm:space-y-8 px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Welcome back, {user.name?.split(' ')[0]}
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">Here's your health overview</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 shadow-sm">
                <Shield className="h-3 w-3 mr-1" />
                Verified Patient
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="overflow-hidden border-sky-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(14,165,233,0.16)]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/25">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Upcoming</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{upcomingAppointments.length}</p>
                  <p className="text-sm text-slate-500">Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-emerald-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,185,129,0.16)]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-3 text-white shadow-lg shadow-emerald-500/25">
                  <Pill className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Active</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{activePrescriptions.length}</p>
                  <p className="text-sm text-slate-500">Prescriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-violet-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(139,92,246,0.16)]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 p-3 text-white shadow-lg shadow-violet-500/25">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Medical</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{medicalRecords.length}</p>
                  <p className="text-sm text-slate-500">Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-rose-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(244,63,94,0.16)]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 p-3 text-white shadow-lg shadow-rose-500/25">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Health</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">Good</p>
                  <p className="text-sm text-emerald-600">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-[1.5rem] border border-white/70 bg-white/75 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 bg-gradient-to-r from-sky-50 via-white to-emerald-50/70">
                  <CardTitle className="flex items-center text-slate-950">
                    <Calendar className="h-5 w-5 mr-2 text-sky-600" />
                    Upcoming Appointments
                  </CardTitle>
                  <Button size="sm" variant="outline" className="rounded-full border-sky-200 bg-white/90 text-slate-700 hover:bg-sky-50" onClick={() => setActiveTab('appointments')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_32px_rgba(14,165,233,0.1)]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {appointment.doctor.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Dr. {appointment.doctor}</p>
                                <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-gray-500 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {appointment.date}
                                  </span>
                                  <span className="text-sm text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex gap-2">
                                <Badge 
                                  variant={appointment.type === 'emergency' ? 'destructive' : 'secondary'}
                                >
                                  {appointment.type}
                                </Badge>
                                <Badge className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0'}>
                                  {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </Badge>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-500/20 rounded-full px-4"
                                onClick={() => window.location.href = `/telemedicine/${appointment.id}`}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming appointments</p>
                      <Button className="mt-4" size="sm" onClick={() => navigate('/book-appointment')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 bg-gradient-to-r from-violet-50/80 via-white to-fuchsia-50/70">
                  <CardTitle className="flex items-center text-slate-950">
                    <FileText className="h-5 w-5 mr-2 text-violet-600" />
                    Recent Medical Records
                  </CardTitle>
                  <Button size="sm" variant="outline" className="rounded-full border-sky-200 bg-white/90 text-slate-700 hover:bg-sky-50" onClick={() => setActiveTab('records')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentRecords.length > 0 ? (
                    <div className="space-y-4">
                      {recentRecords.map((record) => (
                        <div key={record.id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_32px_rgba(14,165,233,0.1)]">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{record.title}</p>
                              <p className="text-sm text-gray-600">Dr. {record.doctor}</p>
                              <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={record.priority === 'high' ? 'destructive' : 
                                        record.priority === 'medium' ? 'default' : 'secondary'}
                              >
                                {record.priority}
                              </Badge>
                              <Badge variant="outline">
                                {record.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No medical records available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-slate-50 via-white to-sky-50/70">
                  <CardTitle className="flex items-center text-slate-950">
                    <User className="h-5 w-5 mr-2 text-slate-600" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {user.name?.split(' ').map(n => n[0]).join('') || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <Badge variant="secondary" className="mt-1">Patient ID: #{user._id?.slice(-6)}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.phone || 'Phone not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {[
                          user.address?.street,
                          user.address?.city,
                          user.address?.state,
                          user.address?.zipCode
                        ].filter(Boolean).join(', ') || 'Address not provided'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-white to-cyan-50/80">
                  <CardTitle className="flex items-center text-slate-950">
                    <Pill className="h-5 w-5 mr-2 text-emerald-600" />
                    Active Prescriptions
                  </CardTitle>
                  <Button size="sm" variant="outline" className="rounded-full border-sky-200 bg-white/90 text-slate-700 hover:bg-sky-50" onClick={() => setActiveTab('prescriptions')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {activePrescriptions.length > 0 ? (
                    <div className="space-y-3">
                      {activePrescriptions.map((prescription) => (
                        <div key={prescription.id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
                          <p className="font-medium text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">{prescription.dosage} - {prescription.frequency}</p>
                          <p className="text-xs text-gray-500">Prescribed by Dr. {prescription.prescribedBy}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No active prescriptions</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Metrics */}
              <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-sky-50 via-white to-emerald-50/70">
                  <CardTitle className="flex items-center text-slate-950">
                    <Activity className="h-5 w-5 mr-2 text-sky-600" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Health Score</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Medication Adherence</span>
                      <span className="text-sm text-gray-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Appointment Attendance</span>
                      <span className="text-sm text-gray-600">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="font-medium mb-2">Latest Vitals</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Blood Pressure</span>
                        <span className="font-medium">120/80 mmHg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Heart Rate</span>
                        <span className="font-medium">72 bpm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-medium">70 kg</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-sky-50 via-white to-emerald-50/70">
              <CardTitle className="text-slate-950">All Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Dr. {appointment.doctor}</p>
                        <p className="text-sm text-slate-600">{appointment.specialty}</p>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <Badge variant={appointment.status === 'cancelled' ? 'destructive' : 'secondary'} className="w-fit capitalize">
                        {appointment.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="mb-4 text-gray-600">No appointments scheduled</p>
                  <Button onClick={() => navigate('/book-appointment')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="bg-white rounded-[2rem] shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl border border-white/70 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Messages</h2>
            <ChatInterface />
          </div>
        </TabsContent>

        {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-violet-50/80 via-white to-fuchsia-50/70">
              <CardTitle className="text-slate-950">Prescription History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No prescriptions found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-6">
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-slate-50 via-white to-sky-50/70">
              <CardTitle className="text-slate-950">Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Upload Section */}
              <div className="mb-8 rounded-2xl bg-slate-50 p-6 border border-slate-200 border-dashed">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Upload New Record</h3>
                <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
                  <div>
                    <Label htmlFor="title">Record Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Blood Test Results" 
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">Select File (PDF, Image)</Label>
                    <Input 
                      id="file" 
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isUploading || !uploadFile || !uploadTitle} className="bg-sky-600 hover:bg-sky-700">
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isUploading ? 'Uploading...' : 'Upload Record'}
                  </Button>
                </form>
              </div>

              {/* Records List */}
              {medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-violet-100 p-3 text-violet-600">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{record.title}</p>
                          <p className="text-sm text-slate-500">
                            Uploaded on {record.date} • {record.doctor}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-sky-600 hover:text-sky-700"
                        onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${record.fileUrl}`, '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No medical records available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
