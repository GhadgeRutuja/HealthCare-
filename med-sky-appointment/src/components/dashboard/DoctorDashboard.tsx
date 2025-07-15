import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrescriptionManagement from '@/components/doctor/PrescriptionManagement';
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
  Edit
} from 'lucide-react';
import { User as UserType } from '@/services/api';

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
        // TODO: Replace with actual API calls
        // const appointmentsData = await api.getDoctorAppointments(user._id);
        // const patientsData = await api.getDoctorPatients(user._id);
        // const prescriptionsData = await api.getDoctorPrescriptions(user._id);
        
        // For now, set empty arrays - will be populated with real data
        setAppointments([]);
        setPatients([]);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Enhanced Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, Dr. {user.lastName}! 👨‍⚕️
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              Here's your practice overview for today
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Today's</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{appointments.length}</p>
                <p className="text-xs text-gray-500">Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-xs text-gray-500">Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Pill className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Prescriptions</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Rating</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-xs text-green-600">⭐⭐⭐⭐⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Appointments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Today's Appointments
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('appointments')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading appointments...</p>
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          {/* Appointment content will be populated with real data */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                      <p className="text-gray-600">Your schedule is clear for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Patient Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Recent Patient Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                    <p className="text-gray-600">Patient activities will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Doctor Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                      <AvatarFallback className="text-lg">
                        Dr. {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">Dr. {user.firstName} {user.lastName}</h3>
                    <Badge className="bg-sky-100 text-sky-800 mt-2">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                    {user.address && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="truncate">{user.address.city}, {user.address.state}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveTab('appointments')}>
                      <Calendar className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">View Schedule</div>
                        <div className="text-xs text-gray-500">Check today's appointments</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveTab('patients')}>
                      <Users className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Patient Records</div>
                        <div className="text-xs text-gray-500">Access patient information</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveTab('prescriptions')}>
                      <Pill className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Write Prescription</div>
                        <div className="text-xs text-gray-500">Create new prescriptions</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-12">
                      <FileText className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Medical Records</div>
                        <div className="text-xs text-gray-500">Review patient records</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Management</h3>
                <p className="text-gray-600">Appointment management features will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Management</h3>
                <p className="text-gray-600">Patient management features will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <PrescriptionManagement doctor={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
