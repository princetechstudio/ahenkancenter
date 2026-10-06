import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { scoutingDB } from '../store';
import { Plus, Search, X, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const ScoutingPage: React.FC = () => {
  const [prospects, setProspects] = useState(scoutingDB.getAll());
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState('');
  const statuses = ['New Prospect', 'Under Review', 'Trial', 'Accepted', 'Rejected'];

  const [form, setForm] = useState({ fullName: '', age: 14, position: 'Midfielder', currentClub: '', status: 'New Prospect' as any, technical: 7, tactical: 7, physical: 7, mental: 7, potential: 7, overall: 7, scoutNotes: '' });

  const filtered = prospects.filter(p => !search || p.fullName.toLowerCase().includes(search.toLowerCase())).filter(p => !pipelineFilter || p.status === pipelineFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const overall = ((form.technical + form.tactical + form.physical + form.mental + form.potential) / 5).toFixed(1);
    scoutingDB.create({ ...form, overall: Number(overall) });
    setProspects(scoutingDB.getAll());
    setShowForm(false);
    toast.success('Prospect added!');
  };

  const updateStatus = (id: string, status: any) => {
    scoutingDB.update(id, { status });
    setProspects(scoutingDB.getAll());
  };

  const handleDelete = (id: string) => {
    scoutingDB.delete(id);
    setProspects(scoutingDB.getAll());
    toast.success('Prospect removed');
  };

  const getStatusColor = (status: string) => {
    switch (status) { case 'New Prospect': return 'bg-blue-100 text-blue-700'; case 'Under Review': return 'bg-amber-100 text-amber-700'; case 'Trial': return 'bg-purple-100 text-purple-700'; case 'Accepted': return 'bg-green-100 text-green-700'; case 'Rejected': return 'bg-red-100 text-red-700'; default: return 'bg-gray-100 text-gray-700'; }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scouting</h1>
          <p className="text-sm text-gray-500">Player scouting and talent pipeline</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
          <Plus size={16} /> Add Prospect
        </button>
      </div>

      {/* Pipeline Overview */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statuses.map(s => (
          <button key={s} onClick={() => setPipelineFilter(pipelineFilter === s ? '' : s)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 ${pipelineFilter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s} <span className="bg-black/10 px-1.5 py-0.5 rounded-full">{prospects.filter(p => p.status === s).length}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search prospects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(prospect => (
          <div key={prospect.id} className="bg-white rounded-xl p-5 card-shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">{prospect.fullName}</p>
                <p className="text-xs text-gray-500">{prospect.age} yrs • {prospect.position} • {prospect.currentClub}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(prospect.status)}`}>{prospect.status}</span>
            </div>

            <div className="grid grid-cols-5 gap-1 mb-3">
              {[
                { label: 'TEC', value: prospect.technical },
                { label: 'TAC', value: prospect.tactical },
                { label: 'PHY', value: prospect.physical },
                { label: 'MEN', value: prospect.mental },
                { label: 'POT', value: prospect.potential },
              ].map(s => (
                <div key={s.label} className="text-center p-1.5 bg-gray-50 rounded">
                  <p className="text-sm font-bold">{s.value}</p>
                  <p className="text-[8px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">Overall</span>
              <span className="text-lg font-bold text-primary">{prospect.overall}</span>
            </div>

            {prospect.scoutNotes && <p className="text-xs text-gray-600 p-2 bg-gray-50 rounded-lg mb-3">{prospect.scoutNotes}</p>}

            {/* Pipeline Actions */}
            <div className="flex gap-1 flex-wrap mb-3">
              {statuses.filter(s => s !== prospect.status).map(s => (
                <button key={s} onClick={() => updateStatus(prospect.id, s)} className="text-[10px] px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-1">
                  <ArrowRight size={8} /> {s}
                </button>
              ))}
            </div>

            <button onClick={() => handleDelete(prospect.id)} className="w-full py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-1">
              <Trash2 size={12} /> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add Scouting Prospect</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: Number(e.target.value)})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option><option>Winger</option>
                </select>
                <input placeholder="Current Club" value={form.currentClub} onChange={e => setForm({...form, currentClub: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['technical', 'tactical', 'physical', 'mental', 'potential'] as const).map(attr => (
                  <div key={attr}>
                    <label className="text-xs text-gray-600 capitalize">{attr}</label>
                    <input type="range" min="1" max="10" value={(form as any)[attr]} onChange={e => setForm({...form, [attr]: Number(e.target.value)})} className="w-full accent-primary" />
                    <span className="text-xs font-bold">{(form as any)[attr]}</span>
                  </div>
                ))}
              </div>
              <textarea placeholder="Scout notes..." value={form.scoutNotes} onChange={e => setForm({...form, scoutNotes: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={3} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Add Prospect</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
