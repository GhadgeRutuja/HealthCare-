import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Eye,
  Plus,
  Edit,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface AdminDashboardProps {
  user: UserType;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  // Mock data - in real app, this would come from API
  const systemStats = {
    totalUsers: 2850,
    totalDoctors: 145,
    totalPatients: 2680,
    totalAppointments: 1250,
    monthlyRevenue: 125000,
    pendingApprovals: 8
  };

  const recentRegistrations = [
    {
      id: 1,
      name: 'Dr. Michael Foster',
      type: 'doctor',
      specialty: 'Orthopedics',
      status: 'pending',
      registeredAt: '2025-07-14'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      type: 'patient',
      status: 'approved',
      registeredAt: '2025-07-14'
    },
    {
      id: 3,
      name: 'Dr. Lisa Chang',
      type: 'doctor',
      specialty: 'Dermatology',
      status: 'pending',
      registeredAt: '2025-07-13'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: '8 doctors pending approval',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'System backup completed successfully',
      time: '6 hours ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Monthly report generated',
      time: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(180deg,_#f8fcff_0%,_#eef7fb_42%,_#f9fbfd_100%)] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-0 top-36 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 sm:space-y-8">
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
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-white shadow-lg shadow-slate-900/10">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  Secure admin access
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                  Live platform analytics
                </div>
              </div>
            </div>

            <Button className="rounded-full border-0 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 text-white shadow-lg shadow-sky-600/25 transition-transform hover:scale-[1.02] hover:from-sky-500 hover:via-cyan-500 hover:to-emerald-400">
              <Building2 className="h-4 w-4 mr-2" />
              Platform Overview
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="overflow-hidden border-sky-100 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(14,165,233,0.16)]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/25">
                  <Users className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Total Users</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{systemStats.totalUsers.toLocaleString()}</p>
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
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{systemStats.totalDoctors}</p>
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
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{systemStats.totalAppointments.toLocaleString()}</p>
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
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Monthly Revenue</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">${(systemStats.monthlyRevenue / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Approvals */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 bg-gradient-to-r from-sky-50 via-white to-emerald-50/70">
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <Clock className="h-5 w-5 text-sky-600" />
                Pending Approvals
                {systemStats.pendingApprovals > 0 && (
                  <Badge variant="destructive">{systemStats.pendingApprovals}</Badge>
                )}
              </CardTitle>
              <Button size="sm" variant="outline" className="rounded-full border-sky-200 bg-white/90 text-slate-700 hover:bg-sky-50">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.filter(reg => reg.status === 'pending').map((registration) => (
                  <div key={registration.id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_32px_rgba(14,165,233,0.1)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {registration.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{registration.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{registration.type}</p>
                          {registration.specialty && (
                            <p className="text-sm text-gray-500">{registration.specialty}</p>
                          )}
                          <p className="text-xs text-gray-400">{registration.registeredAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-full border-slate-200">
                          Reject
                        </Button>
                        <Button size="sm" className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400">
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Registrations */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 bg-gradient-to-r from-slate-50 via-white to-sky-50/70">
              <CardTitle className="text-slate-950">Recent Registrations</CardTitle>
              <Button variant="outline" size="sm" className="rounded-full border-sky-200 bg-white/90 text-slate-700 hover:bg-sky-50">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div key={registration.id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_32px_rgba(14,165,233,0.1)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {registration.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{registration.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{registration.type}</p>
                          {registration.specialty && (
                            <p className="text-sm text-gray-500">{registration.specialty}</p>
                          )}
                          <p className="text-xs text-gray-400">{registration.registeredAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(registration.status)}>
                          {registration.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="mt-2 rounded-full border-sky-200 bg-white/90 hover:bg-sky-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Analytics */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-white to-cyan-50/80">
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                System Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.8</div>
                  <div className="text-sm text-gray-600">Avg. Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">1.2s</div>
                  <div className="text-sm text-gray-600">Avg. Response</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Admin Profile */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-slate-50 via-white to-sky-50/70">
              <CardTitle className="text-slate-950">Admin Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-sky-100 shadow-lg shadow-sky-500/10">
                  <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-600">System Administrator</p>
                <div className="flex items-center justify-center mt-2">
                  <Shield className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-600">Super Admin</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <UserCheck className="h-4 w-4 text-gray-400 mr-3" />
                  <span>Full Access</span>
                </div>
                <div className="flex items-center text-sm">
                  <Settings className="h-4 w-4 text-gray-400 mr-3" />
                  <span>System Management</span>
                </div>
                <div className="flex items-center text-sm">
                  <Activity className="h-4 w-4 text-gray-400 mr-3" />
                  <span>Analytics & Reports</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6 rounded-full border-sky-200 bg-white/90 hover:bg-sky-50">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-amber-50/80 via-white to-sky-50/70">
              <CardTitle className="text-slate-950">System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full rounded-full border-sky-200 bg-white/90 hover:bg-sky-50">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-cyan-50/80 via-white to-emerald-50/70">
              <CardTitle className="text-slate-950">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-2xl border-slate-200/80 bg-white/90 shadow-sm hover:border-sky-200 hover:bg-sky-50">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-slate-200/80 bg-white/90 shadow-sm hover:border-emerald-200 hover:bg-emerald-50">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Doctor Approvals
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-slate-200/80 bg-white/90 shadow-sm hover:border-violet-200 hover:bg-violet-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-slate-200/80 bg-white/90 shadow-sm hover:border-sky-200 hover:bg-sky-50">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-slate-200/80 bg-white/90 shadow-sm hover:border-amber-200 hover:bg-amber-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-slate-200/80 bg-white/90 shadow-sm hover:border-rose-200 hover:bg-rose-50">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-slate-50 via-white to-cyan-50/70">
              <CardTitle className="text-slate-950">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Gateway</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-yellow-600">Warning</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
