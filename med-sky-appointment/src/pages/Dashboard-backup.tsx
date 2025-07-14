import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Mail
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
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
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    ...(user.doctorProfile && { doctorProfile: user.doctorProfile })
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

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-gray-50">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats?.totalUsers || 0}</div>
          <p className="text-xs text-muted-foreground">Active users in system</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats?.totalDoctors || 0}</div>
          <p className="text-xs text-muted-foreground">Registered doctors</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats?.pendingVerifications || 0}</div>
          <p className="text-xs text-muted-foreground">Doctors awaiting approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats?.totalAppointments || 0}</div>
          <p className="text-xs text-muted-foreground">All time appointments</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      disabled={user.role === 'admin'}
                    >
                      {user.role === 'admin' ? 'Protected' : 'Delete'}
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
    <Card>
      <CardHeader>
        <CardTitle>Doctor Management</CardTitle>
        <CardDescription>Verify and manage doctor accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Specialization</th>
                <th className="border border-gray-300 px-4 py-2 text-left">License</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td className="border border-gray-300 px-4 py-2">{doctor.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.specialization}</td>
                  <td className="border border-gray-300 px-4 py-2">{doctor.licenseNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      doctor.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doctor.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {doctor.status === 'pending_verification' && (
                      <button
                        onClick={() => handleVerifyDoctor(doctor._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 mr-2"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderAppointments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Management</CardTitle>
        <CardDescription>Monitor all appointments in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found</p>
            <p className="text-sm text-gray-400 mt-2">Appointments will appear here once the appointment system is fully implemented</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Patient</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="border border-gray-300 px-4 py-2">{appointment.patientName}</td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.doctorName}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">System administration and management</p>
            </div>
            <button
              onClick={fetchAdminData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex space-x-4">
            {['overview', 'users', 'doctors', 'appointments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
