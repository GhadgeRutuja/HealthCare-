import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  Activity,
  DollarSign,
  Clock,
  Star,
  AlertCircle,
  Download,
  Filter,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Loader2,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { Appointment, Doctor, User as UserType, appointmentsApi } from '@/services/api';

interface AnalyticsReportsProps {
  user: UserType;
  doctorProfile?: Doctor | null;
}

interface MetricData {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ChartData {
  name: string;
  value: number;
  appointments?: number;
  revenue?: number;
  patients?: number;
}

const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({ user, doctorProfile }) => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [metrics, setMetrics] = useState<MetricData[]>([
    { name: 'Total Patients', value: 0, change: 0, trend: 'neutral' },
    { name: 'Appointments This Month', value: 0, change: 0, trend: 'neutral' },
    { name: 'Revenue This Month', value: 0, change: 0, trend: 'neutral' },
    { name: 'Average Rating', value: 0, change: 0, trend: 'neutral' }
  ]);

  const [appointmentData, setAppointmentData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [patientDemographics, setPatientDemographics] = useState<ChartData[]>([]);
  const [specialtyStats, setSpecialtyStats] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await appointmentsApi.getAll();
        const appointments = response.data || [];
        const now = new Date();
        const periodStart = new Date(now);
        if (selectedPeriod === 'week') periodStart.setDate(now.getDate() - 7);
        if (selectedPeriod === 'month') periodStart.setMonth(now.getMonth() - 1);
        if (selectedPeriod === 'quarter') periodStart.setMonth(now.getMonth() - 3);
        if (selectedPeriod === 'year') periodStart.setFullYear(now.getFullYear() - 1);

        const inPeriod = appointments.filter((appointment) =>
          new Date(appointment.appointmentDate) >= periodStart &&
          new Date(appointment.appointmentDate) <= now
        );
        const uniquePatients = new Set(
          appointments.map((appointment) =>
            typeof appointment.patient === 'string'
              ? appointment.patient
              : appointment.patient?._id
          ).filter(Boolean)
        ).size;
        const revenue = inPeriod.reduce((total, appointment) =>
          total + Number(appointment.consultationFee || appointment.consultation?.fee || 0), 0);
        const currentCompleted = inPeriod.filter((appointment) =>
          ['completed'].includes(appointment.status)
        ).length;
        const currentCancelled = inPeriod.filter((appointment) =>
          ['cancelled', 'no-show', 'no_show'].includes(appointment.status)
        ).length;
        const previousStart = new Date(periodStart);
        const periodLength = now.getTime() - periodStart.getTime();
        previousStart.setTime(periodStart.getTime() - periodLength);
        const previousPeriod = appointments.filter((appointment) => {
          const date = new Date(appointment.appointmentDate).getTime();
          return date >= previousStart.getTime() && date < periodStart.getTime();
        });
        const percentChange = (current: number, previous: number) =>
          previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

        setMetrics([
          { name: 'Total Patients', value: uniquePatients, change: percentChange(uniquePatients, new Set(previousPeriod.map((appointment) => typeof appointment.patient === 'string' ? appointment.patient : appointment.patient?._id)).size), trend: uniquePatients >= 0 ? 'up' : 'neutral' },
          { name: 'Appointments This Period', value: inPeriod.length, change: percentChange(inPeriod.length, previousPeriod.length), trend: inPeriod.length >= previousPeriod.length ? 'up' : 'down' },
          { name: 'Revenue This Period', value: revenue, change: percentChange(revenue, previousPeriod.reduce((total, appointment) => total + Number(appointment.consultationFee || appointment.consultation?.fee || 0), 0)), trend: revenue >= 0 ? 'up' : 'neutral' },
          { name: 'Average Rating', value: doctorProfile?.rating?.average || 0, change: 0, trend: 'neutral' }
        ]);

        const groupedAppointments = inPeriod.reduce<Record<string, number>>((groups, appointment) => {
          const key = new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'short' });
          groups[key] = (groups[key] || 0) + 1;
          return groups;
        }, {});
        setAppointmentData(Object.entries(groupedAppointments).map(([name, appointments]) => ({ name, appointments })));
        const groupedRevenue = inPeriod.reduce<Record<string, number>>((groups, appointment) => {
          const key = new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
          groups[key] = (groups[key] || 0) + Number(appointment.consultationFee || appointment.consultation?.fee || 0);
          return groups;
        }, {});
        setRevenueData(Object.entries(groupedRevenue).map(([name, revenue]) => ({ name, revenue })));
        const ageGroups: Record<string, number> = {};
        inPeriod.forEach((appointment) => {
          const patient = typeof appointment.patient === 'string' ? null : appointment.patient;
          const age = patient?.dateOfBirth
            ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 31557600000)
            : null;
          const group = age === null ? 'Unknown' : age <= 18 ? '0-18' : age <= 35 ? '19-35' : age <= 50 ? '36-50' : age <= 65 ? '51-65' : '65+';
          ageGroups[group] = (ageGroups[group] || 0) + 1;
        });
        setPatientDemographics(Object.entries(ageGroups).map(([name, value]) => ({ name, value })));
        setSpecialtyStats([
          { name: 'Completed', value: currentCompleted },
          { name: 'Upcoming', value: inPeriod.length - currentCompleted - currentCancelled },
          { name: 'Cancelled / No-show', value: currentCancelled },
        ]);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user._id, selectedPeriod]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const revenueMetric = metrics.find((metric) => metric.name.startsWith('Revenue'))?.value || 0;
  const appointmentMetric = metrics.find((metric) => metric.name.startsWith('Appointments'))?.value || 0;
  const bestDay = appointmentData.reduce(
    (best, current) => current.appointments && current.appointments > (best?.appointments || 0) ? current : best,
    appointmentData[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600">Track your practice performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={metric.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.name.includes('Revenue') ? formatCurrency(metric.value) : metric.value}
                      </p>
                      <div className={`flex items-center mt-1 ${getTrendColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm ml-1">
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-sky-100 rounded-full">
                      {index === 0 && <Users className="h-6 w-6 text-sky-600" />}
                      {index === 1 && <Calendar className="h-6 w-6 text-sky-600" />}
                      {index === 2 && <DollarSign className="h-6 w-6 text-sky-600" />}
                      {index === 3 && <Star className="h-6 w-6 text-sky-600" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Tabs */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Appointments Analytics */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Appointments Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointmentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={appointmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="appointments" 
                            stroke="#0ea5e9" 
                            fill="#0ea5e9" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-16">
                        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No appointment data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-green-600" />
                      Appointment Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointmentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={specialtyStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {specialtyStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-16">
                        <PieChartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No status data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Analytics */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Revenue Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10b981" 
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-16">
                        <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No revenue data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-purple-600" />
                      Revenue Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Quick Stats</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average per appointment</span>
                            <span className="text-sm font-medium">{formatCurrency(appointmentMetric ? revenueMetric / appointmentMetric : 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Best performing day</span>
                            <span className="text-sm font-medium">{bestDay?.name || 'No data'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Growth rate</span>
                            <span className="text-sm font-medium">{metrics.find((metric) => metric.name.startsWith('Revenue'))?.change || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Patient Analytics */}
            <TabsContent value="patients" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Patient Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patientDemographics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={patientDemographics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-16">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No patient demographics data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-600" />
                      Patient Acquisition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">0</div>
                        <p className="text-sm text-gray-600">New patients this month</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Referrals</span>
                          <span className="text-sm text-gray-600">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Online Booking</span>
                          <span className="text-sm text-gray-600">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Walk-ins</span>
                          <span className="text-sm text-gray-600">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Insurance</span>
                          <span className="text-sm text-gray-600">0</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Retention Rate</span>
                          <Badge variant="secondary">0%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Analytics */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-600" />
                      Patient Satisfaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-yellow-600">0.0</div>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Based on 0 reviews</p>
                      
                      <div className="space-y-2 mt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">5 stars</span>
                          <div className="flex-1 mx-3">
                            <Progress value={0} className="h-2" />
                          </div>
                          <span className="text-xs">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">4 stars</span>
                          <div className="flex-1 mx-3">
                            <Progress value={0} className="h-2" />
                          </div>
                          <span className="text-xs">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">3 stars</span>
                          <div className="flex-1 mx-3">
                            <Progress value={0} className="h-2" />
                          </div>
                          <span className="text-xs">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">2 stars</span>
                          <div className="flex-1 mx-3">
                            <Progress value={0} className="h-2" />
                          </div>
                          <span className="text-xs">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">1 star</span>
                          <div className="flex-1 mx-3">
                            <Progress value={0} className="h-2" />
                          </div>
                          <span className="text-xs">0</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-orange-600" />
                      Efficiency Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">On-time Rate</span>
                          <span className="text-sm text-gray-600">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Average Wait Time</span>
                          <span className="text-sm text-gray-600">0 min</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Appointment Completion</span>
                          <span className="text-sm text-gray-600">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Today's Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Appointments completed</span>
                            <span className="text-sm font-medium">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average duration</span>
                            <span className="text-sm font-medium">0 min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">No-shows</span>
                            <span className="text-sm font-medium">0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-purple-600" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                      <p className="text-gray-600 text-sm">
                        Complete appointments and gather reviews to unlock achievements
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AnalyticsReports;
