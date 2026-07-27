import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, Calendar as CalendarIcon } from 'lucide-react';

interface AnalyticsProps {
  stats: any;
}

const COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b'];

const AdminAnalytics: React.FC<AnalyticsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Revenue Growth</CardTitle>
                <CardDescription>Monthly consultation fees</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-sky-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Bar Chart */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Appointment Trends</CardTitle>
                <CardDescription>Daily bookings over last 7 days</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.appointmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="appointments" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Specializations</CardTitle>
                <CardDescription>Doctor distribution</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.departmentBreakdown?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {stats.departmentBreakdown?.map((entry: any, index: number) => (
                <div key={index} className="flex items-center text-sm">
                  <span 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-600 truncate">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="border-sky-100 bg-gradient-to-br from-sky-50 to-white shadow-sm flex flex-col justify-center">
            <CardContent className="p-8">
              <p className="text-sky-600 font-medium mb-1">Total System Users</p>
              <h3 className="text-4xl font-bold text-sky-950">{stats.totalUsers}</h3>
              <p className="text-sm text-sky-600/80 mt-2">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm flex flex-col justify-center">
            <CardContent className="p-8">
              <p className="text-emerald-600 font-medium mb-1">Total Verified Doctors</p>
              <h3 className="text-4xl font-bold text-emerald-950">{stats.verifiedDoctors}</h3>
              <p className="text-sm text-emerald-600/80 mt-2">Active practitioners</p>
            </CardContent>
          </Card>
          
          <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-white shadow-sm flex flex-col justify-center">
            <CardContent className="p-8">
              <p className="text-violet-600 font-medium mb-1">Total Appointments</p>
              <h3 className="text-4xl font-bold text-violet-950">{stats.totalAppointments}</h3>
              <p className="text-sm text-violet-600/80 mt-2">All time bookings</p>
            </CardContent>
          </Card>
          
          <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm flex flex-col justify-center">
            <CardContent className="p-8">
              <p className="text-amber-600 font-medium mb-1">Monthly Revenue</p>
              <h3 className="text-4xl font-bold text-amber-950">${stats.totalRevenue || 5000}</h3>
              <p className="text-sm text-amber-600/80 mt-2">From consultation fees</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
