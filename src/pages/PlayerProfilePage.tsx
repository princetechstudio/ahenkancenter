import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout';
import { playersDB, performanceDB, attendanceDB, paymentsDB } from '../store';
import { MapPin, Phone, Mail, Calendar, Award, Target, TrendingUp, Heart, Shield, Brain, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const PlayerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const player = playersDB.getById(id || '');
  if (!player) return <DashboardLayout><div className="text-center py-20"><p className="text-gray-500">Player not found</p><Link to="/players" className="text-primary text-sm mt-2 inline-block">← Back to Players</Link></div></DashboardLayout>;

  const performanceRecords = performanceDB.getByPlayer(player.id);
  const attendanceRecords = attendanceDB.getByPlayer(player.id);
  const paymentRecords = paymentsDB.getByPlayer(player.id);

  const radarData = [
    { subject: 'Technical', value: player.technical },
    { subject: 'Physical', value: player.physical },
    { subject: 'Tactical', value: player.tactical },
    { subject: 'Mental', value: player.mental },
  ];

  const tabs = ['overview', 'performance', 'attendance', 'training', 'matches', 'payments', 'documents', 'feedback'];

  const age = new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden mb-6">
        <div className="gradient-primary h-24 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/4" />
          </div>
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center gradient-primary text-white text-2xl font-bold">
              {player.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{player.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm text-gray-500">{player.ageGroup} • {player.position} • #{player.jerseyNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${player.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{player.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/players/${player.id}/digital-id`} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200">Digital ID</Link>
              <button onClick={() => navigate(`/players/register?edit=${player.id}`)} className="px-3 py-1.5 gradient-primary text-white rounded-lg text-xs font-medium">Edit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Overall', value: player.overallRating, icon: Award, color: 'text-primary' },
          { label: 'Attendance', value: `${player.attendanceRate}%`, icon: Target, color: 'text-blue-600' },
          { label: 'Goals', value: player.goals, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Assists', value: player.assists, icon: Zap, color: 'text-amber-600' },
          { label: 'Age', value: age, icon: Calendar, color: 'text-purple-600' },
          { label: 'Foot', value: player.preferredFoot, icon: Shield, color: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 card-shadow border border-gray-100 text-center">
            <stat.icon size={18} className={`mx-auto mb-1 ${stat.color}`} />
            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            <p className="text-[10px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 bg-white rounded-xl p-1 card-shadow border border-gray-100">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Development Profile</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="value" stroke="#1a5632" fill="#1a5632" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Player Information</h3>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: 'Date of Birth', value: player.dateOfBirth },
                  { icon: MapPin, label: 'Address', value: `${player.address}, ${player.city}` },
                  { icon: Phone, label: 'Parent Phone', value: player.parentPhone },
                  { icon: Mail, label: 'Parent Email', value: player.parentEmail },
                  { icon: Heart, label: 'Blood Group', value: player.bloodGroup },
                  { icon: Brain, label: 'School', value: `${player.school} - ${player.className}` },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <item.icon size={16} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-500">{item.label}</p>
                      <p className="text-sm text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl p-5 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Development Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Technical', value: player.technical, color: 'bg-blue-500' },
                  { label: 'Physical', value: player.physical, color: 'bg-green-500' },
                  { label: 'Tactical', value: player.tactical, color: 'bg-purple-500' },
                  { label: 'Mental', value: player.mental, color: 'bg-amber-500' },
                ].map(score => (
                  <div key={score.label} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score.value * 10}, 100`} className={score.color.replace('bg-', 'text-')} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{score.value}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-600">{score.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Performance History</h3>
            {performanceRecords.length > 0 ? (
              <div className="space-y-4">
                {performanceRecords.map(record => (
                  <div key={record.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">{record.date}</p>
                      <p className="text-xs text-gray-500">Evaluated by coach</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div><p className="text-[10px] text-gray-500">Passing</p><p className="text-sm font-medium">{record.technical.passing}</p></div>
                      <div><p className="text-[10px] text-gray-500">Dribbling</p><p className="text-sm font-medium">{record.technical.dribbling}</p></div>
                      <div><p className="text-[10px] text-gray-500">Shooting</p><p className="text-sm font-medium">{record.technical.shooting}</p></div>
                      <div><p className="text-[10px] text-gray-500">Speed</p><p className="text-sm font-medium">{record.physical.speed}</p></div>
                    </div>
                    {record.comments && <p className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded-lg">{record.comments}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No performance records yet</p>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Attendance Record</h3>
            {attendanceRecords.length > 0 ? (
              <div className="space-y-2">
                {attendanceRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <span className="text-sm">{record.date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      record.status === 'Present' ? 'bg-green-100 text-green-700' :
                      record.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{record.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No attendance records yet</p>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Payment History</h3>
            {paymentRecords.length > 0 ? (
              <div className="space-y-2">
                {paymentRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">GHS {record.amount}</p>
                      <p className="text-xs text-gray-500">{record.paymentType} • {record.paymentMethod}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      record.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      record.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      record.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{record.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No payment records yet</p>
            )}
          </div>
        )}

        {(activeTab === 'training' || activeTab === 'matches' || activeTab === 'documents' || activeTab === 'feedback') && (
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No {activeTab} records available yet</p>
              <p className="text-xs text-gray-400 mt-1">Data will appear here once recorded</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
