import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import PatientDashboard from '@/components/dashboard/PatientDashboard-simple';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard-new';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Calendar,
  FileText,
  Activity,
  UserCheck,
  Users,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Settings,
  Eye,
  Mail,
  Edit,
  Trash2,
  ShieldBan,
  ShieldCheck,
  UserCog,
  Stethoscope,
  ChevronRight,
  User,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Please log in to access the dashboard.</div>
      </div>
    );
  }

  const userType = user.role;
  const userProfile = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patientName: 'John Smith',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-07-15',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'confirmed',
      symptoms: 'Chest pain and shortness of breath',
      duration: '30 min',
      patientPhone: '+1 (555) 987-6543',
      previousVisits: 3
    },
    {
      id: 2,
      patientName: 'Emma Davis',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-07-15',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'pending',
      symptoms: 'Asthma symptoms worsening',
      duration: '20 min',
      patientPhone: '+1 (555) 876-5432',
      previousVisits: 5
    },
    {
      id: 3,
      patientName: 'Robert Garcia',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-07-15',
      time: '02:00 PM',
      type: 'Check-up',
      status: 'confirmed',
      symptoms: 'Post-surgery recovery check',
      duration: '30 min',
      patientPhone: '+1 (555) 543-2109',
      previousVisits: 8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'urgent': return AlertCircle;
      default: return Clock;
    }
  };

  const getDashboardContent = () => {
    switch (userType) {
      case 'patient':
        return {
          title: 'Patient Dashboard',
          description: 'Manage your appointments and health records',
          stats: [
            { title: 'Upcoming Appointments', value: '3', icon: Calendar, color: 'text-blue-600' },
            { title: 'Medical Records', value: '12', icon: FileText, color: 'text-green-600' },
            { title: 'Prescriptions', value: '5', icon: Activity, color: 'text-purple-600' },
            { title: 'Health Score', value: '85%', icon: UserCheck, color: 'text-orange-600' }
          ],
          quickActions: [
            { title: 'Book Appointment', icon: Calendar, description: 'Schedule a new appointment' },
            { title: 'View Records', icon: FileText, description: 'Access your medical history' },
            { title: 'Prescriptions', icon: Activity, description: 'View current medications' }
          ]
        };
      
      case 'doctor':
        return {
          title: 'Doctor Dashboard',
          description: `Welcome back, ${userProfile.name}`,
          stats: [
            { title: 'Today\'s Appointments', value: '3', icon: Calendar, color: 'text-blue-600' },
            { title: 'Total Patients', value: '145', icon: Users, color: 'text-green-600' },
            { title: 'Pending Reviews', value: '2', icon: Clock, color: 'text-orange-600' },
            { title: 'Patient Rating', value: '4.9', icon: Star, color: 'text-purple-600' }
          ],
          quickActions: [
            { title: 'View Schedule', icon: Calendar, description: 'Check today\'s appointments' },
            { title: 'Patient Records', icon: Users, description: 'Access patient information' },
            { title: 'Write Prescription', icon: FileText, description: 'Create new prescriptions' }
          ]
        };
      
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'System administration and management',
          stats: [
            { title: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600' },
            { title: 'Total Doctors', value: '156', icon: UserCheck, color: 'text-green-600' },
            { title: 'Pending Verifications', value: '23', icon: Clock, color: 'text-orange-600' },
            { title: 'System Status', value: 'Online', icon: CheckCircle, color: 'text-green-600' }
          ],
          quickActions: [
            { title: 'User Management', icon: Users, description: 'Manage user accounts' },
            { title: 'Doctor Verification', icon: UserCheck, description: 'Verify doctor credentials' },
            { title: 'System Settings', icon: Settings, description: 'Configure system parameters' }
          ]
        };
    }
  };

  // Special rendering for admin dashboard
  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  if (userType === 'patient') {
    return <PatientDashboard user={user} />;
  }

  if (userType === 'doctor') {
    return <DoctorDashboard user={user} />;
  }

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <p className="text-gray-600 mt-1">{content.description}</p>
            </div>
            <Button className="gradient-sky text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {content.stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used features and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-sky-300 hover:bg-sky-50"
                    >
                      <action.icon className="h-8 w-8 text-sky-600" />
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{action.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity or Profile */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/placeholder.svg" alt={userProfile.name} />
                      <AvatarFallback className="text-lg">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{userProfile.name}</h3>
                      <p className="text-sm text-gray-600">{userProfile.email}</p>
                      <Badge className="mt-1 text-xs">
                        {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  {userProfile.doctorProfile && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Doctor Information</h4>
                      <p className="text-sm text-gray-600">
                        <strong>Specialization:</strong> {userProfile.doctorProfile.specialization}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>License:</strong> {userProfile.doctorProfile.licenseNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Status:</strong> 
                        <Badge className={`ml-2 text-xs ${
                          userProfile.doctorProfile.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userProfile.doctorProfile.status}
                        </Badge>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Appointments (for doctors and patients) */}
        {(userType === 'doctor' || userType === 'patient') && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>
                {userType === 'doctor' ? 'Today\'s Appointments' : 'Your Appointments'}
              </CardTitle>
              <CardDescription>
                {userType === 'doctor' 
                  ? 'Manage your patient appointments for today' 
                  : 'View and manage your upcoming appointments'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const StatusIcon = getStatusIcon(appointment.status);
                  return (
                    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100">
                              <StatusIcon className={`h-6 w-6 ${
                                appointment.status === 'confirmed' ? 'text-green-600' :
                                appointment.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {userType === 'doctor' ? appointment.patientName : appointment.doctorName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {appointment.date} at {appointment.time}
                              </p>
                              <p className="text-sm text-gray-500">{appointment.symptoms}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    specialty: '',
    licenseNumber: '',
    consultationFee: '',
    experience: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, doctorsData, appointmentsData] = await Promise.all([
        adminApi.getSystemStats(),
        adminApi.getAllUsers(),
        adminApi.getAllDoctors(),
        adminApi.getAllAppointments()
      ]);
      
      setSystemStats(statsData);
      setUsers(usersData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId: string) => {
    try {
      await adminApi.verifyDoctor(doctorId);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error verifying doctor:', error);
    }
  };

  const handleEditClick = (doctor: any) => {
    setEditingDoctor(doctor);
    setEditForm({
      specialty: doctor.specialization !== 'Not specified' ? doctor.specialization : '',
      licenseNumber: doctor.licenseNumber || '',
      consultationFee: doctor.consultationFee?.toString() || '',
      experience: doctor.experience !== 'Not specified' ? doctor.experience.replace(' years', '') : ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateDoctor = async () => {
    try {
      await adminApi.updateDoctor(editingDoctor._id, {
        specialty: editForm.specialty,
        licenseNumber: editForm.licenseNumber,
        consultationFee: Number(editForm.consultationFee),
        experience: Number(editForm.experience)
      });
      toast.success('Doctor details updated successfully');
      setIsEditModalOpen(false);
      fetchAdminData();
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor details');
    }
  };

  const handleToggleBlockDoctor = async (doctor: any) => {
    const newStatus = doctor.status === 'suspended' ? 'active' : 'suspended';
    try {
      await adminApi.updateDoctorStatus(doctor._id, newStatus);
      toast.success(`Doctor ${newStatus === 'suspended' ? 'blocked' : 'unblocked'} successfully`);
      fetchAdminData();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      toast.error('Failed to update doctor status');
    }
  };

  const handleDeleteDoctor = async (doctor: any) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${doctor.name}? This will also delete their user account.`)) {
      try {
        await adminApi.deleteUser(doctor.userId);
        toast.success('Doctor deleted successfully');
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        fetchAdminData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      <Card className="glass-card overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Users</p>
              <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{systemStats?.totalUsers || 0}</h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white shadow-[0_8px_16px_rgb(0_0_0_/_0.05)] flex items-center justify-center border border-slate-100/50 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-7 w-7 text-blue-500" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm">
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full flex items-center font-semibold text-xs mr-3 border border-emerald-100">
              <TrendingUp className="h-3 w-3 mr-1" /> +12%
            </span>
            <span className="text-slate-400 font-medium text-xs">vs last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card overflow-hidden group stagger-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Doctors</p>
              <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{systemStats?.totalDoctors || 0}</h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white shadow-[0_8px_16px_rgb(0_0_0_/_0.05)] flex items-center justify-center border border-slate-100/50 group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="h-7 w-7 text-indigo-500" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm">
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full flex items-center font-semibold text-xs mr-3 border border-emerald-100">
              <TrendingUp className="h-3 w-3 mr-1" /> +4%
            </span>
            <span className="text-slate-400 font-medium text-xs">vs last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card overflow-hidden group stagger-2">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Verify</p>
              <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{systemStats?.pendingVerifications || 0}</h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white shadow-[0_8px_16px_rgb(0_0_0_/_0.05)] flex items-center justify-center border border-slate-100/50 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-7 w-7 text-amber-500" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm">
            <span className={`px-2.5 py-1 rounded-full flex items-center font-semibold text-xs border ${systemStats?.pendingVerifications > 0 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
              {systemStats?.pendingVerifications > 0 ? "Requires attention" : "All caught up"}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card overflow-hidden group stagger-3">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Appointments</p>
              <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{systemStats?.totalAppointments || 0}</h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white shadow-[0_8px_16px_rgb(0_0_0_/_0.05)] flex items-center justify-center border border-slate-100/50 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-7 w-7 text-emerald-500" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm">
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full flex items-center font-semibold text-xs mr-3 border border-emerald-100">
              <TrendingUp className="h-3 w-3 mr-1" /> +18%
            </span>
            <span className="text-slate-400 font-medium text-xs">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <Card className="glass-panel overflow-hidden animate-slide-up">
      <CardHeader className="bg-white/40 border-b border-slate-200/50 pb-6 px-8 pt-8">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">User Management</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">Manage all users in the system</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full gradient-mesh-accent shadow-lg flex items-center justify-center text-white">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/60">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Created</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-transparent">
              {users.map((u, i) => (
                <tr key={u._id} className="table-row-hover group" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm shadow-slate-200/50">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{u.firstName} {u.lastName}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3.5 w-3.5" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        u.role === 'admin' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                        u.role === 'doctor' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' :
                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      }`}></span>
                      <span className="font-semibold text-slate-700">
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className={`p-2.5 rounded-full transition-all duration-300 ${
                        u.role === 'admin' 
                          ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                          : 'text-slate-400 hover:text-white hover:bg-rose-500 hover:shadow-md hover:shadow-rose-500/30'
                      }`}
                      disabled={u.role === 'admin'}
                      title={u.role === 'admin' ? 'Protected' : 'Delete User'}
                    >
                      {u.role === 'admin' ? <ShieldCheck className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderDoctors = () => (
    <Card className="glass-panel overflow-hidden animate-slide-up">
      <CardHeader className="bg-white/40 border-b border-slate-200/50 pb-6 px-8 pt-8">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">Doctor Management</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">Verify and manage doctor accounts</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full gradient-mesh-purple shadow-lg flex items-center justify-center text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/60">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Specialization</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">License</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-transparent">
              {doctors.map((doctor, i) => (
                <tr key={doctor._id} className="table-row-hover group" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm shadow-indigo-200/50">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="font-bold text-slate-800 text-base">{doctor.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                    {doctor.specialization}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{doctor.licenseNumber}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <button
                      onClick={() => doctor.status === 'pending_verification' ? handleVerifyDoctor(doctor._id) : null}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        doctor.status === 'active' || doctor.isVerified 
                          ? 'bg-emerald-50 text-emerald-600 cursor-default shadow-sm' 
                          : doctor.status === 'pending_verification' 
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' 
                            : 'bg-rose-50 text-rose-600 cursor-default shadow-sm'
                      }`}
                      disabled={doctor.status !== 'pending_verification'}
                    >
                      {doctor.status === 'active' || doctor.isVerified ? (
                        <><ShieldCheck className="w-4 h-4 mr-1.5" /> Verified</>
                      ) : doctor.status === 'pending_verification' ? (
                        'Verify Doctor'
                      ) : (
                        doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)
                      )}
                    </button>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(doctor)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 hover:shadow-sm"
                        title="Edit Doctor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleBlockDoctor(doctor)}
                        className={`p-2.5 rounded-full transition-all duration-300 hover:shadow-sm ${
                          doctor.status === 'suspended' 
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                            : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                        }`}
                        title={doctor.status === 'suspended' ? 'Unblock Doctor' : 'Block Doctor'}
                      >
                        <ShieldBan className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor)}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-rose-500 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-rose-500/30"
                        title="Delete Doctor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Doctor Info</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialty" className="text-right">Specialty</Label>
              <Input 
                id="specialty" 
                value={editForm.specialty} 
                onChange={(e) => setEditForm({...editForm, specialty: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licenseNumber" className="text-right">License</Label>
              <Input 
                id="licenseNumber" 
                value={editForm.licenseNumber} 
                onChange={(e) => setEditForm({...editForm, licenseNumber: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="consultationFee" className="text-right">Fee ($)</Label>
              <Input 
                id="consultationFee" 
                type="number"
                value={editForm.consultationFee} 
                onChange={(e) => setEditForm({...editForm, consultationFee: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">Exp (Yrs)</Label>
              <Input 
                id="experience" 
                type="number"
                value={editForm.experience} 
                onChange={(e) => setEditForm({...editForm, experience: e.target.value})} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateDoctor}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );

  const renderAppointments = () => (
    <Card className="glass-panel overflow-hidden animate-slide-up">
      <CardHeader className="bg-white/40 border-b border-slate-200/50 pb-6 px-8 pt-8">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">Appointment Management</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">Monitor all appointments in the system</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full gradient-mesh-emerald shadow-lg flex items-center justify-center text-white">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 shadow-inner">
              <Calendar className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-800 font-extrabold text-xl">No appointments found</p>
            <p className="text-base text-slate-400 mt-2 max-w-sm mx-auto font-medium">Appointments will appear here once the system is fully active.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-transparent">
                {appointments.map((appointment, i) => (
                  <tr key={appointment._id} className="table-row-hover group" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold border border-blue-100 shadow-sm">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="font-bold text-slate-800">
                          {appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : appointment.patientName || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                          <Stethoscope className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-600">
                          {appointment.doctor?.user ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : appointment.doctorName || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-800 font-semibold flex items-center gap-2">
                           <Calendar className="h-3.5 w-3.5 text-slate-400" />
                           {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="flex items-center gap-2 text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {appointment.appointmentTime || appointment.time || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          ['confirmed', 'completed'].includes(appointment.status) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                          ['scheduled', 'in-progress', 'rescheduled'].includes(appointment.status) ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' :
                          'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        }`}></span>
                        <span className="font-semibold text-slate-700">
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading admin data...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'doctors':
        return renderDoctors();
      case 'appointments':
        return renderAppointments();
      case 'analytics':
        return <AdminAnalytics stats={systemStats} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-mesh-bg flex flex-col relative overflow-hidden font-sans">
      <Navbar />
      
      {/* Header section with glassmorphism */}
      <div className="glass-panel sticky top-0 z-20 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-b-0 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="animate-slide-in-right">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Admin <span className="text-gradient text-gradient-blue">Dashboard</span></h1>
              <p className="text-slate-500 mt-2 font-medium">System administration and management</p>
            </div>
            <button
              onClick={fetchAdminData}
              className="bg-white text-slate-700 px-5 py-3 rounded-full hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 font-bold animate-slide-in-right stagger-1"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
        {/* Navigation Tabs */}
        <div className="mb-10 flex justify-center animate-scale-up stagger-2">
          <nav className="inline-flex space-x-2 bg-white/70 backdrop-blur-xl p-2 rounded-2xl shadow-lg shadow-slate-200/50 border border-white/80">
            {['overview', 'analytics', 'users', 'doctors', 'appointments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? 'gradient-mesh-accent text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic Content */}
        <div className="transition-all duration-500">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
