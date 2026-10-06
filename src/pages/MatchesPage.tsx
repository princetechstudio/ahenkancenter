import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { matchesDB } from '../store';
import { Plus, Trophy, Calendar, MapPin, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState(matchesDB.getAll());
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ opponent: '', date: '', time: '', location: '', competition: '', homeAway: 'Home' as 'Home' | 'Away', result: 'Upcoming' as any, score: '', notes: '', ageGroup: 'U-17' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    matchesDB.create(form);
    setMatches(matchesDB.getAll());
    setShowForm(false);
    toast.success('Match created!');
  };

  const handleDelete = (id: string) => {
    matchesDB.delete(id);
    setMatches(matchesDB.getAll());
    toast.success('Match deleted');
  };

  const filtered = filter === 'all' ? matches : filter === 'upcoming' ? matches.filter(m => m.result === 'Upcoming') : matches.filter(m => m.result !== 'Upcoming');

  const getResultColor = (result: string) => {
    switch (result) { case 'Win': return 'bg-green-100 text-green-700'; case 'Loss': return 'bg-red-100 text-red-700'; case 'Draw': return 'bg-amber-100 text-amber-700'; default: return 'bg-blue-100 text-blue-700'; }
  };

  const wins = matches.filter(m => m.result === 'Win').length;
  const losses = matches.filter(m => m.result === 'Loss').length;
  const draws = matches.filter(m => m.result === 'Draw').length;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
          <p className="text-sm text-gray-500">Fixtures and results</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
          <Plus size={16} /> Add Match
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Matches', value: matches.length, color: 'text-primary' },
          { label: 'Wins', value: wins, color: 'text-green-600' },
          { label: 'Draws', value: draws, color: 'text-amber-600' },
          { label: 'Losses', value: losses, color: 'text-red-600' },
          { label: 'Upcoming', value: matches.filter(m => m.result === 'Upcoming').length, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 card-shadow border border-gray-100 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'upcoming', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(match => (
          <div key={match.id} className="bg-white rounded-xl p-5 card-shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getResultColor(match.result)}`}>{match.result}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{match.ageGroup}</span>
            </div>
            <div className="text-center mb-3">
              <p className="text-sm text-gray-500">Ahenkan FC</p>
              {match.score ? (
                <p className="text-2xl font-bold text-gray-800 my-1">{match.score}</p>
              ) : (
                <p className="text-lg font-bold text-gray-400 my-1">vs</p>
              )}
              <p className="text-sm font-semibold text-gray-800">{match.opponent}</p>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2"><Calendar size={12} /> {match.date} at {match.time}</div>
              <div className="flex items-center gap-2"><MapPin size={12} /> {match.location}</div>
              <div className="flex items-center gap-2"><Trophy size={12} /> {match.competition}</div>
              <div className="flex items-center gap-2"><span className="font-medium">{match.homeAway}</span></div>
            </div>
            {match.notes && <p className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-lg">{match.notes}</p>}
            <button onClick={() => handleDelete(match.id)} className="w-full mt-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-1">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add Match</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Opponent" value={form.opponent} onChange={e => setForm({...form, opponent: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <input required type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              </div>
              <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <input placeholder="Competition" value={form.competition} onChange={e => setForm({...form, competition: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.homeAway} onChange={e => setForm({...form, homeAway: e.target.value as any})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option value="Home">Home</option><option value="Away">Away</option>
                </select>
                <select value={form.ageGroup} onChange={e => setForm({...form, ageGroup: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>U-8</option><option>U-10</option><option>U-12</option><option>U-14</option><option>U-15</option><option>U-17</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option value="Upcoming">Upcoming</option><option value="Win">Win</option><option value="Loss">Loss</option><option value="Draw">Draw</option>
                </select>
                <input placeholder="Score (e.g. 3-1)" value={form.score} onChange={e => setForm({...form, score: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              </div>
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={2} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Add Match</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
