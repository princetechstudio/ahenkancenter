import React from 'react';
import { DashboardLayout } from '../components/Layout';
import { playersDB, coachesDB, matchesDB, paymentsDB, trainingDB, attendanceDB } from '../store';
import { Users, UserCog, TrendingUp, Trophy, Calendar, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string; trendUp?: boolean; color: string }> = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const players = playersDB.getAll();
  const coaches = coachesDB.getAll();
  const matches = matchesDB.getAll();
  const payments = paymentsDB.getAll();
  const training = trainingDB.getAll();
  const attendance = attendanceDB.getAll();

  const totalPlayers = players.length;
  const totalCoaches = coaches.length;
  const avgAttendance = Math.round(players.reduce((sum, p) => sum + p.attendanceRate, 0) / players.length);
  const upcomingMatches = matches.filter(m => m.result === 'Upcoming').length;
  const activeTraining = training.filter(t => t.status === 'Scheduled').length;
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingFees = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  const attendanceData = [
    { month: 'Jan', rate: 82 }, { month: 'Feb', rate: 85 }, { month: 'Mar', rate: 88 },
    { month: 'Apr', rate: 86 }, { month: 'May', rate: 90 }, { month: 'Jun', rate: avgAttendance },
  ];

  const playerGrowthData = [
    { month: 'Jan', players: 12 }, { month: 'Feb', players: 20 }, { month: 'Mar', players: 28 },
    { month: 'Apr', players: 33 }, { month: 'May', players: 39 }, { month: 'Jun', players: totalPlayers },
  ];

  const ageGroupData = [
    { name: 'U-8', value: players.filter(p => p.ageGroup === 'U-8').length },
    { name: 'U-10', value: players.filter(p => p.ageGroup === 'U-10').length },
    { name: 'U-12', value: players.filter(p => p.ageGroup === 'U-12').length },
    { name: 'U-14', value: players.filter(p => p.ageGroup === 'U-14').length },
    { name: 'U-15', value: players.filter(p => p.ageGroup === 'U-15').length },
    { name: 'U-17', value: players.filter(p => p.ageGroup === 'U-17').length },
  ].filter(g => g.value > 0);

  const COLORS = ['#1a5632', '#2d7a4a', '#84cc16', '#65a30d', '#a3e635', '#4ade80'];

  const recentActivity = [
    { action: 'Player registered', detail: 'Kwabena Oduro joined U-10', time: '2 hours ago' },
    { action: 'Payment received', detail: 'GHS 500 from Kwame Mensah', time: '5 hours ago' },
    { action: 'Attendance recorded', detail: 'Recovery session - 6 players', time: '1 day ago' },
    { action: 'Match completed', detail: 'Ahenkan 3-1 Suhum Youth', time: '2 days ago' },
    { action: 'Announcement published', detail: 'Pre-season training begins', time: '3 days ago' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ahenkan Football Academy</h1>
        <p className="text-gray-500 text-sm">Command Center — Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Players" value={totalPlayers} icon={<Users size={20} className="text-white" />} color="bg-primary" trend="+5 this month" trendUp={true} />
        <StatCard title="Total Coaches" value={totalCoaches} icon={<UserCog size={20} className="text-white" />} color="bg-blue-600" trend="All active" trendUp={true} />
        <StatCard title="Attendance Rate" value={`${avgAttendance}%`} icon={<TrendingUp size={20} className="text-white" />} color="bg-accent-dark" trend="+3% vs last month" trendUp={true} />
        <StatCard title="Upcoming Matches" value={upcomingMatches} icon={<Trophy size={20} className="text-white" />} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Training" value={activeTraining} icon={<Calendar size={20} className="text-white" />} color="bg-purple-600" />
        <StatCard title="Academy Revenue" value={`GHS ${totalRevenue.toLocaleString()}`} icon={<CreditCard size={20} className="text-white" />} color="bg-green-600" trend="+12% growth" trendUp={true} />
        <StatCard title="Outstanding Fees" value={`GHS ${outstandingFees.toLocaleString()}`} icon={<Activity size={20} className="text-white" />} color="bg-red-500" />
        <StatCard title="Avg Player Rating" value={(players.reduce((s, p) => s + p.overallRating, 0) / players.length).toFixed(1)} icon={<TrendingUp size={20} className="text-white" />} color="bg-indigo-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#1a5632" strokeWidth={2} dot={{ fill: '#1a5632', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Player Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={playerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="players" fill="#84cc16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Age Groups */}
        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Players by Age Group</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ageGroupData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {ageGroupData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Upcoming Matches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.filter(m => m.result === 'Upcoming').map(match => (
            <div key={match.id} className="border border-gray-100 rounded-lg p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{match.ageGroup}</span>
                <span className="text-xs text-gray-400">{match.homeAway}</span>
              </div>
              <p className="font-semibold text-sm text-gray-800">vs {match.opponent}</p>
              <p className="text-xs text-gray-500 mt-1">{match.competition}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Calendar size={12} />
                <span>{match.date} at {match.time}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{match.location}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
