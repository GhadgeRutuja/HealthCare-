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
        <Card className="glass-card overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="bg-white/40 border-b border-slate-200/50 pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-800 tracking-tight">Revenue Growth</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Monthly consultation fees</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white shadow-md shadow-blue-500/10 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative z-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Bar Chart */}
        <Card className="glass-card overflow-hidden group stagger-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="bg-white/40 border-b border-slate-200/50 pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-800 tracking-tight">Appointment Trends</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Daily bookings over last 7 days</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white shadow-md shadow-emerald-500/10 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                <CalendarIcon className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative z-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.appointmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                  <Tooltip
                    cursor={{fill: 'rgba(241,245,249,0.5)'}}
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="appointments" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <Card className="lg:col-span-1 glass-card overflow-hidden group stagger-2">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="bg-white/40 border-b border-slate-200/50 pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-800 tracking-tight">Specializations</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Doctor distribution</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white shadow-md shadow-violet-500/10 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative z-10">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.departmentBreakdown?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.departmentBreakdown?.map((entry: any, index: number) => (
                <div key={index} className="flex items-center text-sm">
                  <span 
                    className="h-3 w-3 rounded-full mr-2.5 shadow-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-700 font-medium truncate">{entry.name} <span className="text-slate-400">({entry.value})</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6 stagger-3">
          <Card className="glass-card bg-gradient-to-br from-blue-50/50 to-white/50 border-blue-100 flex flex-col justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
            <CardContent className="p-8 relative z-10">
              <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2">Total System Users</p>
              <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">{stats.totalUsers}</h3>
              <p className="text-sm text-slate-500 font-medium mt-3 flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-emerald-500"/> +12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card bg-gradient-to-br from-emerald-50/50 to-white/50 border-emerald-100 flex flex-col justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
            <CardContent className="p-8 relative z-10">
              <p className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2">Total Verified Doctors</p>
              <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">{stats.verifiedDoctors}</h3>
              <p className="text-sm text-slate-500 font-medium mt-3">Active practitioners</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card bg-gradient-to-br from-violet-50/50 to-white/50 border-violet-100 flex flex-col justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-violet-500/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
            <CardContent className="p-8 relative z-10">
              <p className="text-violet-600 font-bold tracking-widest text-xs uppercase mb-2">Total Appointments</p>
              <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">{stats.totalAppointments}</h3>
              <p className="text-sm text-slate-500 font-medium mt-3">All time bookings</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card bg-gradient-to-br from-amber-50/50 to-white/50 border-amber-100 flex flex-col justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
            <CardContent className="p-8 relative z-10">
              <p className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2">Monthly Revenue</p>
              <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">${stats.totalRevenue ?? 0}</h3>
              <p className="text-sm text-slate-500 font-medium mt-3 flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-emerald-500"/> From consultation fees</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
