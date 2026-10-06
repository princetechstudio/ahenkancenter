import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { attendanceDB, playersDB, trainingDB } from '../store';
import { Check, X as XIcon, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AttendancePage: React.FC = () => {
  const players = playersDB.getAll();
  const sessions = trainingDB.getAll();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState('');
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>({});

  const filteredPlayers = players.filter(p => p.status === 'Active');

  const setStatus = (playerId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendance(prev => ({ ...prev, [playerId]: status }));
  };

  const markAllPresent = () => {
    const all: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = {};
    filteredPlayers.forEach(p => { all[p.id] = 'Present'; });
    setAttendance(all);
  };

  const saveAttendance = () => {
    const records = Object.entries(attendance).map(([playerId, status]) => ({
      playerId, sessionId: selectedSession || 'general', date: selectedDate, status,
    }));
    if (records.length === 0) {
      toast.error('No attendance to save');
      return;
    }
    attendanceDB.record(records);
    toast.success(`Attendance saved for ${records.length} players!`);
    setAttendance({});
  };

  const stats = {
    present: Object.values(attendance).filter(s => s === 'Present').length,
    absent: Object.values(attendance).filter(s => s === 'Absent').length,
    late: Object.values(attendance).filter(s => s === 'Late').length,
    excused: Object.values(attendance).filter(s => s === 'Excused').length,
  };

  const getStatusButton = (playerId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused', icon: React.ReactNode, color: string) => (
    <button onClick={() => setStatus(playerId, status)}
      className={`p-1.5 rounded-lg transition-colors ${attendance[playerId] === status ? color : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
      {icon}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
          <p className="text-sm text-gray-500">Record and track player attendance</p>
        </div>
        <button onClick={saveAttendance} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90">
          Save Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Training Session</label>
            <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
              <option value="">General</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.title} ({s.date})</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={markAllPresent} className="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">
              Mark All Present
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
          <p className="text-xl font-bold text-green-700">{stats.present}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-center">
          <p className="text-xl font-bold text-red-700">{stats.absent}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
          <p className="text-xl font-bold text-amber-700">{stats.late}</p>
          <p className="text-xs text-amber-600">Late</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
          <p className="text-xl font-bold text-blue-700">{stats.excused}</p>
          <p className="text-xs text-blue-600">Excused</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Player</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Age Group</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPlayers.map(player => (
                <tr key={player.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                        {player.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{player.fullName}</p>
                        <p className="text-[11px] text-gray-500">#{player.jerseyNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{player.ageGroup}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {getStatusButton(player.id, 'Present', <Check size={14} />, 'bg-green-500 text-white')}
                      {getStatusButton(player.id, 'Absent', <XIcon size={14} />, 'bg-red-500 text-white')}
                      {getStatusButton(player.id, 'Late', <Clock size={14} />, 'bg-amber-500 text-white')}
                      {getStatusButton(player.id, 'Excused', <AlertCircle size={14} />, 'bg-blue-500 text-white')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
