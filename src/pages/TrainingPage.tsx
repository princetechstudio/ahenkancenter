import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { trainingDB, coachesDB } from '../store';
import { Plus, Calendar, Clock, MapPin, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const TrainingPage: React.FC = () => {
  const [sessions, setSessions] = useState(trainingDB.getAll());
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const coaches = coachesDB.getAll();
  const [form, setForm] = useState({ title: '', date: '', startTime: '', endTime: '', location: '', coachId: '', ageGroup: 'U-14', trainingType: 'Technical' as any, notes: '', status: 'Scheduled' as any });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trainingDB.create(form);
    setSessions(trainingDB.getAll());
    setShowForm(false);
    toast.success('Training session created!');
  };

  const handleDelete = (id: string) => {
    trainingDB.delete(id);
    setSessions(trainingDB.getAll());
    toast.success('Session deleted');
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = { Technical: 'bg-blue-100 text-blue-700', Tactical: 'bg-purple-100 text-purple-700', Physical: 'bg-red-100 text-red-700', Fitness: 'bg-orange-100 text-orange-700', Recovery: 'bg-green-100 text-green-700', Goalkeeping: 'bg-amber-100 text-amber-700', 'Match Preparation': 'bg-indigo-100 text-indigo-700' };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Training</h1>
          <p className="text-sm text-gray-500">{sessions.filter(s => s.status === 'Scheduled').length} upcoming sessions</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-xs font-medium ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}>List</button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 text-xs font-medium ${viewMode === 'calendar' ? 'bg-primary text-white' : 'text-gray-600'}`}>Calendar</button>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
            <Plus size={16} /> Create Session
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.sort((a, b) => a.date.localeCompare(b.date)).map(session => {
            const coach = coaches.find(c => c.id === session.coachId);
            return (
              <div key={session.id} className="bg-white rounded-xl p-5 card-shadow border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(session.trainingType)}`}>{session.trainingType}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${session.status === 'Scheduled' ? 'bg-green-100 text-green-700' : session.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{session.status}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{session.title}</h3>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><Calendar size={12} /> {session.date}</div>
                  <div className="flex items-center gap-2"><Clock size={12} /> {session.startTime} - {session.endTime}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} /> {session.location}</div>
                  {coach && <div className="flex items-center gap-2"><span className="font-medium">Coach:</span> {coach.fullName}</div>}
                  <div className="flex items-center gap-2"><span className="font-medium">Age Group:</span> {session.ageGroup}</div>
                </div>
                {session.notes && <p className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded-lg">{session.notes}</p>}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => handleDelete(session.id)} className="flex-1 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-1"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i + 1;
              const dateStr = `2025-06-${String(day).padStart(2, '0')}`;
              const daySessions = sessions.filter(s => s.date === dateStr);
              return (
                <div key={i} className={`min-h-[80px] p-1.5 rounded-lg border ${daySessions.length ? 'border-primary/30 bg-green-50' : 'border-gray-100'}`}>
                  {day <= 30 && <p className="text-xs font-medium text-gray-600 mb-1">{day}</p>}
                  {daySessions.map(s => <p key={s.id} className="text-[9px] bg-primary text-white px-1 rounded truncate mb-0.5">{s.title}</p>)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Create Training Session</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Session Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <select value={form.ageGroup} onChange={e => setForm({...form, ageGroup: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>U-8</option><option>U-10</option><option>U-12</option><option>U-14</option><option>U-15</option><option>U-17</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <input required type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              </div>
              <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <select value={form.coachId} onChange={e => setForm({...form, coachId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="">Select Coach</option>
                {coaches.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
              </select>
              <select value={form.trainingType} onChange={e => setForm({...form, trainingType: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option>Technical</option><option>Tactical</option><option>Physical</option><option>Fitness</option><option>Recovery</option><option>Goalkeeping</option><option>Match Preparation</option>
              </select>
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={3} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Create Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
