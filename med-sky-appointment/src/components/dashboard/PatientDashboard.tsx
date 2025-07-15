import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Heart,
  Activity,
  MapPin,
  Phone,
  Mail,
  Plus,
  Eye,
  Edit,
  AlertCircle,
  TrendingUp,
  Pill,
  Shield,
  Star,
  Bell,
  ChevronRight,
  Zap,
  Target,
  Thermometer,
  Weight,
  Droplets
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface PatientDashboardProps {
  user: UserType;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced mock data - in real app, this would come from API
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2025-07-20',
      time: '10:00 AM',
      status: 'confirmed',
      type: 'Follow-up',
      avatar: '/placeholder.svg',
      rating: 4.9,
      consultationFee: 150
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Neurology',
      date: '2025-07-25',
      time: '2:00 PM',
      status: 'pending',
      type: 'Consultation',
      avatar: '/placeholder.svg',
      rating: 4.7,
      consultationFee: 200
    }
  ];

  const recentRecords = [
    {
      id: 1,
      date: '2025-07-10',
      doctor: 'Dr. Emily Rodriguez',
      type: 'Blood Test',
      status: 'completed',
      priority: 'normal',
      results: 'Normal values'
    },
    {
      id: 2,
      date: '2025-07-05',
      doctor: 'Dr. Sarah Johnson',
      type: 'Cardiac Checkup',
      status: 'completed',
      priority: 'high',
      results: 'Follow-up needed'
    },
    {
      id: 3,
      date: '2025-06-28',
      doctor: 'Dr. Mark Thompson',
      type: 'General Checkup',
      status: 'completed',
      priority: 'normal',
      results: 'Excellent health'
    }
  ];

  const medications = [
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      remaining: 15,
      total: 30,
      nextRefill: '2025-07-30'
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      remaining: 8,
      total: 30,
      nextRefill: '2025-07-25'
    }
  ];

  const vitals = [
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: Heart, color: 'text-green-600' },
    { name: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: Activity, color: 'text-blue-600' },
    { name: 'Temperature', value: '98.6', unit: '°F', status: 'normal', icon: Thermometer, color: 'text-orange-600' },
    { name: 'Weight', value: '165', unit: 'lbs', status: 'normal', icon: Weight, color: 'text-purple-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Enhanced Header with Notifications */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              Here's your health overview for today
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Records</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{recentRecords.length}</p>
                <p className="text-xs text-gray-500">Recent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">85%</p>
                <p className="text-xs text-green-600">+5% from last month</p>
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
                <p className="text-xs sm:text-sm font-medium text-gray-600">Medications</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{medications.length}</p>
                <p className="text-xs text-orange-600">1 needs refill</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Enhanced Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-sky-600" />
                Upcoming Appointments
              </CardTitle>
              <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700">
                <Link to="/find-doctors">
                  <Plus className="h-4 w-4 mr-2" />
                  Book New
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.avatar} />
                            <AvatarFallback>
                              {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                            <p className="text-sm text-sky-600 font-medium">{appointment.specialty}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                {appointment.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{appointment.type}</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">${appointment.consultationFee}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-600 mb-4">Book your first appointment with a doctor</p>
                  <Button asChild className="bg-sky-600 hover:bg-sky-700">
                    <Link to="/find-doctors">Find Doctors</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Recent Medical Records
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{record.type}</h3>
                            <Badge className={getPriorityColor(record.priority)}>
                              {record.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">by {record.doctor}</p>
                          <p className="text-sm text-gray-500">{record.date}</p>
                          <p className="text-sm text-gray-700 mt-1 font-medium">{record.results}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
                  <p className="text-gray-600">Your medical records will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8">{/* Enhanced Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                  <AvatarFallback className="text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
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

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-purple-600" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{med.name}</h4>
                      <Badge variant={med.remaining <= 10 ? "destructive" : "secondary"}>
                        {med.remaining} left
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Remaining</span>
                        <span>{med.remaining}/{med.total}</span>
                      </div>
                      <Progress value={(med.remaining / med.total) * 100} className="h-2" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Next refill: {med.nextRefill}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start h-12">
                  <Link to="/find-doctors">
                    <Calendar className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Book Appointment</div>
                      <div className="text-xs text-gray-500">Find and schedule with doctors</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-12">
                  <Link to="/medical-records">
                    <FileText className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">View Records</div>
                      <div className="text-xs text-gray-500">Access your medical history</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-12">
                  <Link to="/prescriptions">
                    <Pill className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Prescriptions</div>
                      <div className="text-xs text-gray-500">Manage your medications</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="destructive" className="w-full justify-start h-12">
                  <Link to="/emergency">
                    <AlertCircle className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Emergency</div>
                      <div className="text-xs text-red-100">Get immediate help</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
                  <h4 className="font-medium text-blue-900">💧 Stay Hydrated</h4>
                  <p className="text-sm text-blue-700">Drink at least 8 glasses of water daily for optimal health.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                  <h4 className="font-medium text-green-900">🏃‍♂️ Regular Exercise</h4>
                  <p className="text-sm text-green-700">Aim for 30 minutes of moderate exercise 5 days a week.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                  <h4 className="font-medium text-purple-900">🩺 Annual Checkup</h4>
                  <p className="text-sm text-purple-700">Schedule your annual health checkup to stay on top of your health.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
