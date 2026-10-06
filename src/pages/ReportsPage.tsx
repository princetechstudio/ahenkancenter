import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { playersDB, paymentsDB, matchesDB, attendanceDB } from '../store';
import { FileText, Download, Printer, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('player');
  const players = playersDB.getAll();
  const payments = paymentsDB.getAll();
  const matches = matchesDB.getAll();

  const playerData = players.map(p => ({ name: p.fullName.split(' ')[0], rating: p.overallRating, attendance: p.attendanceRate, goals: p.goals }));
  const paymentData = [
    { month: 'Jan', amount: 2000 }, { month: 'Feb', amount: 3500 }, { month: 'Mar', amount: 4000 },
    { month: 'Apr', amount: 4500 }, { month: 'May', amount: 5000 }, { month: 'Jun', amount: payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0) },
  ];
  const matchResults = [
    { name: 'Wins', value: matches.filter(m => m.result === 'Win').length },
    { name: 'Draws', value: matches.filter(m => m.result === 'Draw').length },
    { name: 'Losses', value: matches.filter(m => m.result === 'Loss').length },
  ];
  const COLORS = ['#1a5632', '#84cc16', '#ef4444'];

  const exportReport = () => {
    const headers = 'Name,Rating,Attendance,Goals\n';
    const rows = players.map(p => `${p.fullName},${p.overallRating},${p.attendanceRate}%,${p.goals}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ahenkan_${reportType}_report.csv`; a.click();
  };

  const reports = [
    { id: 'player', label: 'Player Report', icon: '👤' },
    { id: 'attendance', label: 'Attendance Report', icon: '📋' },
    { id: 'financial', label: 'Financial Report', icon: '💰' },
    { id: 'match', label: 'Match Report', icon: '⚽' },
    { id: 'performance', label: 'Performance Report', icon: '📈' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Academy performance insights</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportReport} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"><Download size={16} /> Export CSV</button>
          <button onClick={() => window.print()} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"><Printer size={16} /> Print</button>
        </div>
      </div>

      {/* Report Types */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {reports.map(r => (
          <button key={r.id} onClick={() => setReportType(r.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${reportType === r.id ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <span>{r.icon}</span> {r.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Player Ratings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={playerData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="rating" fill="#1a5632" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#84cc16" strokeWidth={2} dot={{ fill: '#84cc16', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Match Results</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={matchResults} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {matchResults.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Academy Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Players', value: players.length },
              { label: 'Average Rating', value: (players.reduce((s, p) => s + p.overallRating, 0) / players.length).toFixed(1) },
              { label: 'Average Attendance', value: `${Math.round(players.reduce((s, p) => s + p.attendanceRate, 0) / players.length)}%` },
              { label: 'Total Goals Scored', value: players.reduce((s, p) => s + p.goals, 0) },
              { label: 'Total Assists', value: players.reduce((s, p) => s + p.assists, 0) },
              { label: 'Total Revenue', value: `GHS ${payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}` },
              { label: 'Matches Played', value: matches.filter(m => m.result !== 'Upcoming').length },
              { label: 'Win Rate', value: `${Math.round(matches.filter(m => m.result === 'Win').length / Math.max(1, matches.filter(m => m.result !== 'Upcoming').length) * 100)}%` },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
