import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign,
  BarChart3,
  Sparkles,
  Trash2,
  Loader2,
  Plus,
  Edit
} from 'lucide-react';
import { User as UserType, adminApi, appointmentsApi } from '@/services/api';

interface AdminDashboardProps {
  user: UserType;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        adminApi.getSystemStats(),
        adminApi.getAllDoctors(),
        adminApi.getAllUsers({ role: 'patient' }),
        adminApi.getAllAppointments()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (doctorsRes.success) setDoctors(doctorsRes.data as any);
      if (patientsRes.success) setPatients(patientsRes.data);
      if (appointmentsRes.success) setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Failed to load admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to completely remove this user from the system?")) return;
    try {
      await adminApi.deleteUser(userId);
      setDoctors(prev => prev.filter(d => d.userId !== userId));
      setPatients(prev => prev.filter(p => p._id !== userId));
      alert("User removed successfully.");
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  const handleAppointmentStatus = async (id: string, status: string) => {
    try {
      await appointmentsApi.update(id, { status: status as any });
      setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status } : apt));
    } catch (error) {
      alert("Failed to update appointment status.");
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        role: 'patient'
      };
      await adminApi.createUser(payload);
      setShowAddPatient(false);
      fetchAdminData();
      alert("Patient created successfully.");
    } catch (error: any) {
      alert(error.message || "Failed to create patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'doctor',
        doctorDetails: {
          licenseNumber: formData.licenseNumber,
          specialty: formData.specialty,
          consultationFee: Number(formData.consultationFee),
          experience: Number(formData.experience),
          bio: formData.bio
        }
      };
      await adminApi.createUser(payload);
      setShowAddDoctor(false);
      fetchAdminData();
      alert("Doctor created successfully.");
    } catch (error: any) {
      alert(error.message || "Failed to create doctor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        licenseNumber: formData.licenseNumber,
        specialty: formData.specialty,
        consultationFee: Number(formData.consultationFee),
        experience: Number(formData.experience),
        bio: formData.bio
      };
      await adminApi.updateDoctor(selectedDoctor._id, payload);
      setShowEditDoctor(false);
      fetchAdminData();
      alert("Doctor updated successfully.");
    } catch (error: any) {
      alert(error.message || "Failed to update doctor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDoctorDialog = (doctor: any) => {
    setSelectedDoctor(doctor);
    setFormData({
      licenseNumber: doctor.licenseNumber || '',
      specialty: doctor.specialization || '',
      consultationFee: doctor.consultationFee || 100,
      experience: parseInt(doctor.experience) || 0,
      bio: doctor.bio || ''
    });
    setShowEditDoctor(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(180deg,_#f8fcff_0%,_#eef7fb_42%,_#f9fbfd_100%)] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-0 top-36 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                Executive Control Center
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                  Admin Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                  Manage your healthcare platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-sky-100">
                <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                <AvatarFallback className="bg-sky-600 text-white font-bold">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-sky-600 font-medium tracking-wide uppercase">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 rounded-[1.5rem] border border-white/70 bg-white/75 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
            <TabsTrigger value="patients">Patients ({patients.length})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 focus-visible:outline-none">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="overflow-hidden border-sky-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(14,165,233,0.16)]">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/25">
                      <Users className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Total Patients</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{stats?.totalUsers || patients.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-emerald-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,185,129,0.16)]">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-3 text-white shadow-lg shadow-emerald-500/25">
                      <UserCheck className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Doctors</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{stats?.totalDoctors || doctors.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-violet-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(139,92,246,0.16)]">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 p-3 text-white shadow-lg shadow-violet-500/25">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Appointments</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{stats?.totalAppointments || appointments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-amber-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(245,158,11,0.16)]">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-3 text-white shadow-lg shadow-amber-500/25">
                      <DollarSign className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Revenue</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">${((stats?.totalRevenue ?? 0) / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-white to-cyan-50/80">
                  <CardTitle className="flex items-center gap-2 text-slate-950">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl font-bold text-sky-600">99.9%</div>
                      <div className="text-sm text-gray-600 mt-1">System Uptime</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl font-bold text-emerald-600">4.8</div>
                      <div className="text-sm text-gray-600 mt-1">Avg. Rating</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl font-bold text-violet-600">{stats?.verifiedDoctors || 0}</div>
                      <div className="text-sm text-gray-600 mt-1">Verified Doctors</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl font-bold text-amber-600">1.2s</div>
                      <div className="text-sm text-gray-600 mt-1">Avg. Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="focus-visible:outline-none">
            <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-sky-50 via-white to-emerald-50/70 flex flex-row items-center justify-between py-4">
                <CardTitle className="text-slate-950 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-sky-600" />
                  Doctor Management
                </CardTitle>
                <Button onClick={() => { setFormData({}); setShowAddDoctor(true); }} className="bg-sky-600 hover:bg-sky-700 text-white rounded-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Doctor
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Specialty & Fee</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {doctors.map((doctor) => (
                        <tr key={doctor._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback>{doctor.name.split(' ').map((n: string) => n[0]).join('').substring(0,2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-800">Dr. {doctor.name}</p>
                                <p className="text-xs text-slate-500">{doctor.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <p>{doctor.specialization}</p>
                            <p className="text-xs font-semibold text-slate-800">Fee: ${doctor.consultationFee}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {doctor.education?.[0]?.degree || 'Education not provided'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {doctor.bio || 'Professional profile not provided'}
                            </p>
                            <p className="text-xs text-slate-500">
                              Schedule: {Object.values(doctor.workingHours || {}).filter((hours: any) => hours.isWorking).length} working days
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusColor(doctor.status)} border-0`}>{doctor.status || 'Active'}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => openEditDoctorDialog(doctor)} className="text-sky-600 border-sky-200 hover:bg-sky-50 mr-2">
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteUser(doctor.userId)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {doctors.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-slate-500">No doctors found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="focus-visible:outline-none">
            <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50 via-white to-sky-50/70 flex flex-row items-center justify-between py-4">
                <CardTitle className="text-slate-950 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Patient Management
                </CardTitle>
                <Button onClick={() => { setFormData({}); setShowAddPatient(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Patient
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patients.map((patient) => (
                        <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-800">{patient.firstName} {patient.lastName}</p>
                                <p className="text-xs text-slate-500">ID: {patient._id.substring(0,8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <p>{patient.email}</p>
                            <p className="text-xs">{patient.phone}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(patient.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => handleDeleteUser(patient._id)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {patients.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-slate-500">No patients found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="focus-visible:outline-none">
            <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50/70 py-4">
                <CardTitle className="text-slate-950 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-violet-600" />
                  Global Appointments Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Admin Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((apt) => (
                        <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600">Dr. {apt.doctor?.user?.lastName}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusColor(apt.status)} border-0`}>{apt.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Select 
                              value={apt.status} 
                              onValueChange={(val) => handleAppointmentStatus(apt._id, val)}
                            >
                              <SelectTrigger className="h-8 w-[140px] text-xs">
                                <SelectValue placeholder="Override Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                      {appointments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-500">No appointments found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Doctor Dialog */}
      <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDoctor} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input required name="firstName" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input required name="lastName" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" required name="email" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" required name="password" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input required name="phone" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input required name="licenseNumber" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select name="specialty" onValueChange={(val) => setFormData({ ...formData, specialty: val })}>
                  <SelectTrigger><SelectValue placeholder="Select Specialty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Consultation Fee ($)</Label>
                <Input type="number" required name="consultationFee" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" required name="experience" onChange={handleInputChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDoctor(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-sky-600 text-white">Create Doctor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={showEditDoctor} onOpenChange={setShowEditDoctor}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Doctor: Dr. {selectedDoctor?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditDoctor} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input required name="licenseNumber" value={formData.licenseNumber || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select value={formData.specialty || ''} onValueChange={(val) => setFormData({ ...formData, specialty: val })}>
                  <SelectTrigger><SelectValue placeholder="Select Specialty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Consultation Fee ($)</Label>
                <Input type="number" required name="consultationFee" value={formData.consultationFee || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" required name="experience" value={formData.experience || ''} onChange={handleInputChange} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Biography</Label>
                <Input name="bio" value={formData.bio || ''} onChange={handleInputChange} placeholder="Short bio..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDoctor(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-sky-600 text-white">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPatient} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input required name="firstName" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input required name="lastName" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" required name="email" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" required name="password" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input required name="phone" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" required name="dateOfBirth" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select name="gender" onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                  <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddPatient(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">Create Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminDashboard;
