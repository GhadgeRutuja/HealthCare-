import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrescriptionManagement from '@/components/doctor/PrescriptionManagement';
import AppointmentManagement from '@/components/doctor/AppointmentManagement';
import PatientManagement from '@/components/doctor/PatientManagement';
import AnalyticsReports from '@/components/doctor/AnalyticsReports';
import DoctorSettings from '@/components/doctor/DoctorSettings';
import NotificationCenter from '@/components/doctor/NotificationCenter';
import ChatInterface from '../chat/ChatInterface';
import TelemedicineSystem from '@/components/doctor/TelemedicineSystem';
import { 
  Calendar, 
  Users, 
  Clock, 
  FileText, 
  Star,
  Activity,
  Eye,
  Phone,
  Mail,
  MapPin,
  Pill,
  Loader2,
  Settings,
  Bell,
  Edit,
  MessageSquare,
  Video,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  LayoutDashboard,
  LogOut,
  UserCheck
} from 'lucide-react';
import { User as UserType, appointmentsApi, usersApi } from '@/services/api';

interface DoctorDashboardProps {
  user: UserType;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const [appointmentsRes, patientsRes] = await Promise.all([
          appointmentsApi.getAll(),
          usersApi.getPatients() // Getting all patients for now
        ]);
        
        if (appointmentsRes.success) {
          setAppointments(appointmentsRes.data);
        }
        if (patientsRes.success) {
          setPatients(patientsRes.data);
        }
        
        // Prescriptions API might not be fully implemented, leaving empty for now
        setPrescriptions([]);
      } catch (error) {
        console.error('Failed to fetch doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user._id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    // Integrate with real logout logic later
    window.location.href = '/';
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'telemedicine', label: 'Telemedicine', icon: Video },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 flex flex-col transition-all duration-300">
        {/* Logo Area */}
        <div className="h-[72px] flex items-center px-6 border-b border-sidebar-border/50">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-sidebar-active flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">HealthCare+</h1>
              <p className="text-[10px] text-sidebar-foreground/70 uppercase tracking-widest">Clinical ERP v1.0</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-sidebar-active text-sidebar-active-foreground shadow-md font-medium' 
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-border hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Log-out button */}
        <div className="p-4 mt-auto border-t border-sidebar-border/50">
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-400/80 hover:text-red-400 hover:bg-red-400/10 w-full px-4 py-3 rounded-xl transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" /> 
            <span className="font-medium">Log-out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center text-slate-800">
            <Building className="mr-3 h-6 w-6 text-stroke-blue opacity-80" />
            <h2 className="font-semibold text-xl tracking-tight">HealthCare+ Diagnostic Center</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <Badge className="bg-stroke-blue hover:bg-stroke-blue/90 text-white flex items-center rounded-full px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse mr-2"></span>
              Doctor: {user.lastName}
            </Badge>
            <div className="h-10 w-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
              <Avatar className="h-full w-full">
                <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="space-y-8 mt-0 focus-visible:outline-none">
              
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Today's Appointments</p>
                      <p className="text-4xl font-bold text-stroke-blue tracking-tight">{appointments.length}</p>
                    </div>
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-stroke-blue text-white shadow-sm shadow-stroke-blue/30">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Total Patients</p>
                      <p className="text-4xl font-bold text-stroke-yellow tracking-tight">{patients.length}</p>
                    </div>
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-stroke-yellow text-white shadow-sm shadow-stroke-yellow/30">
                      <Users className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Prescriptions</p>
                      <p className="text-4xl font-bold text-stroke-green tracking-tight">{prescriptions.length}</p>
                    </div>
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-stroke-green text-white shadow-sm shadow-stroke-green/30">
                      <Pill className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Critical Cases</p>
                      <p className="text-4xl font-bold text-stroke-red tracking-tight">4</p>
                    </div>
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-stroke-red text-white shadow-sm shadow-stroke-red/30">
                      <Activity className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white sm:col-span-2 lg:col-span-4 xl:col-span-1">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Follow-ups</p>
                      <p className="text-4xl font-bold text-stroke-cyan tracking-tight">3</p>
                    </div>
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-stroke-cyan text-white shadow-sm shadow-stroke-cyan/30">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column (2/3) - Today's Appointments Table */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-white px-8 py-5">
                      <CardTitle className="flex items-center text-slate-800 text-lg">
                        <Clock className="h-5 w-5 mr-3 text-slate-400" />
                        Today's Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {loading ? (
                        <div className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-stroke-blue mx-auto mb-4" />
                          <p className="text-slate-500 text-sm">Loading appointments...</p>
                        </div>
                      ) : appointments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase font-semibold border-b border-slate-100">
                              <tr>
                                <th className="px-8 py-4">Patient ID</th>
                                <th className="px-8 py-4">Patient Name</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Time</th>
                                <th className="px-8 py-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {/* Sample Data to match reference aesthetic, real data should map here */}
                              <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 font-medium text-slate-700">PAT-2026-4889</td>
                                <td className="px-8 py-4 text-slate-700">Yashraj Thube</td>
                                <td className="px-8 py-4">
                                  <Badge className="bg-stroke-green hover:bg-stroke-green/90 text-white rounded-[4px] px-2.5 py-0.5 font-medium border-0">Normal</Badge>
                                </td>
                                <td className="px-8 py-4 text-slate-600">09:00 AM</td>
                                <td className="px-8 py-4 text-right">
                                  <Button variant="outline" size="sm" className="h-8 border-stroke-blue/40 text-stroke-blue hover:bg-stroke-blue hover:text-white rounded-[6px] transition-colors">
                                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                  </Button>
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 font-medium text-slate-700">PAT-2026-4890</td>
                                <td className="px-8 py-4 text-slate-700">Emma Davis</td>
                                <td className="px-8 py-4">
                                  <Badge className="bg-stroke-red hover:bg-stroke-red/90 text-white rounded-[4px] px-2.5 py-0.5 font-medium border-0">Critical</Badge>
                                </td>
                                <td className="px-8 py-4 text-slate-600">10:30 AM</td>
                                <td className="px-8 py-4 text-right">
                                  <Button variant="outline" size="sm" className="h-8 border-stroke-blue/40 text-stroke-blue hover:bg-stroke-blue hover:text-white rounded-[6px] transition-colors">
                                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                  </Button>
                                </td>
                              </tr>
                              {appointments.map((appointment: any) => (
                                <tr key={appointment._id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-4 font-medium text-slate-700">PAT-{appointment.patient?._id?.substring(0, 6).toUpperCase()}</td>
                                  <td className="px-8 py-4 text-slate-700">{appointment.patient?.firstName} {appointment.patient?.lastName}</td>
                                  <td className="px-8 py-4">
                                    <Badge className={`${getStatusColor(appointment.status)} rounded-[4px] px-2.5 py-0.5 font-medium border-0`}>{appointment.status}</Badge>
                                  </td>
                                  <td className="px-8 py-4 text-slate-600">{appointment.appointmentTime}</td>
                                  <td className="px-8 py-4 text-right space-x-2">
                                    <Button variant="outline" size="sm" className="h-8 border-stroke-blue/40 text-stroke-blue hover:bg-stroke-blue hover:text-white rounded-[6px] transition-colors">
                                      <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      className="h-8 bg-sky-600 hover:bg-sky-700 text-white rounded-[6px] transition-colors"
                                      onClick={() => window.location.href = `/telemedicine/${appointment._id}`}
                                    >
                                      <Video className="h-3.5 w-3.5 mr-1.5" /> Join
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                          <h3 className="text-base font-medium text-slate-700 mb-1">No appointments today</h3>
                          <p className="text-sm text-slate-500">Your schedule is clear for today</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column (1/3) - Clinical Actions */}
                <div className="space-y-8">
                  <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
                    <CardHeader className="border-b border-slate-100 bg-white px-6 py-5">
                      <CardTitle className="flex items-center text-slate-800 text-lg">
                        <Activity className="h-5 w-5 mr-3 text-slate-800" />
                        Clinical Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      
                      <Button 
                        className="w-full h-14 bg-stroke-blue hover:bg-stroke-blue/90 text-white rounded-xl flex justify-between items-center px-5 shadow-sm transition-transform hover:-translate-y-0.5"
                        onClick={() => setActiveTab('appointments')}
                      >
                        <div className="flex items-center font-medium">
                          <Calendar className="h-5 w-5 mr-3 opacity-90" />
                          View Schedule
                        </div>
                        <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold">{appointments.length}</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-14 border-stroke-cyan text-stroke-cyan hover:bg-stroke-cyan/5 rounded-xl flex justify-start items-center px-5 transition-transform hover:-translate-y-0.5"
                        onClick={() => setActiveTab('patients')}
                      >
                        <Users className="h-5 w-5 mr-3" />
                        <span className="font-medium">Patient Records</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-14 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl flex justify-start items-center px-5 transition-transform hover:-translate-y-0.5"
                        onClick={() => setActiveTab('prescriptions')}
                      >
                        <Pill className="h-5 w-5 mr-3 text-slate-400" />
                        <span className="font-medium">Write Prescription</span>
                      </Button>
                      
                    </CardContent>
                  </Card>
                  
                  {/* Doctor Profile Summary Card */}
                  <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                    <div className="bg-slate-50 px-6 py-6 border-b border-slate-100 flex items-center">
                       <Avatar className="h-16 w-16 border-2 border-white shadow-sm mr-4">
                          <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                          <AvatarFallback className="bg-stroke-blue text-white font-medium text-xl">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">Dr. {user.firstName} {user.lastName}</h3>
                          <p className="text-sm text-slate-500 mt-0.5 flex items-center">
                            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-stroke-green" />
                            Verified Provider
                          </p>
                        </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
                          <span className="text-slate-600 truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
                          <span className="text-slate-600">{user.phone}</span>
                        </div>
                        {user.address && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
                            <span className="text-slate-600 truncate">{user.address.city}, {user.address.state}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" className="mt-6 w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-medium" onClick={() => setActiveTab('settings')}>
                        <Edit className="h-4 w-4 mr-2 text-slate-400" />
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="mt-0 focus-visible:outline-none">
              <AppointmentManagement user={user} />
            </TabsContent>

            <TabsContent value="patients" className="mt-0 focus-visible:outline-none">
              <PatientManagement user={user} />
            </TabsContent>

            <TabsContent value="prescriptions" className="mt-0 focus-visible:outline-none">
              <PrescriptionManagement doctor={user} />
            </TabsContent>

            <TabsContent value="telemedicine" className="mt-0 focus-visible:outline-none">
              <TelemedicineSystem user={user} />
            </TabsContent>

            <TabsContent value="messages" className="mt-0 focus-visible:outline-none">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Messages</h2>
                <ChatInterface />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
              <NotificationCenter user={user} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 focus-visible:outline-none">
              <AnalyticsReports user={user} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
              <DoctorSettings user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
