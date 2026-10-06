import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { coachesDB, playersDB } from '../store';
import { Coach } from '../types';
import { Plus, Edit2, Trash2, Phone, Mail, Award, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export const CoachesPage: React.FC = () => {
  const [coaches, setCoaches] = useState(coachesDB.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', license: '', specialization: '', experience: '', status: 'Active' as 'Active' | 'Inactive' });
  const players = playersDB.getAll();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      coachesDB.update(editId, form);
      toast.success('Coach updated!');
    } else {
      coachesDB.create({ ...form, assignedPlayers: [] });
      toast.success('Coach added!');
    }
    setCoaches(coachesDB.getAll());
    setShowForm(false);
    setEditId(null);
    setForm({ fullName: '', phone: '', email: '', license: '', specialization: '', experience: '', status: 'Active' });
  };

  const handleEdit = (coach: Coach) => {
    setForm({ fullName: coach.fullName, phone: coach.phone, email: coach.email, license: coach.license, specialization: coach.specialization, experience: coach.experience, status: coach.status });
    setEditId(coach.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    coachesDB.delete(id);
    setCoaches(coachesDB.getAll());
    toast.success('Coach deleted');
  };

  const activeCoaches = coaches.filter(c => c.status === 'Active').length;
  const totalAssigned = new Set(coaches.flatMap(c => c.assignedPlayers)).size;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coaches</h1>
          <p className="text-sm text-gray-500">Manage coaching staff</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ fullName: '', phone: '', email: '', license: '', specialization: '', experience: '', status: 'Active' }); }} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
          <Plus size={16} /> Add Coach
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Coaches', value: coaches.length, color: 'bg-primary' },
          { label: 'Active Coaches', value: activeCoaches, color: 'bg-green-600' },
          { label: 'Training Sessions', value: 6, color: 'bg-blue-600' },
          { label: 'Assigned Players', value: totalAssigned, color: 'bg-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white rounded-xl p-5 card-shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {coach.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{coach.fullName}</p>
                  <p className="text-xs text-gray-500">{coach.specialization}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${coach.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{coach.status}</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2"><Phone size={12} /> {coach.phone}</div>
              <div className="flex items-center gap-2"><Mail size={12} /> {coach.email}</div>
              <div className="flex items-center gap-2"><Award size={12} /> {coach.license}</div>
              <div className="flex items-center gap-2"><Users size={12} /> {coach.assignedPlayers.length} players assigned</div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button onClick={() => handleEdit(coach)} className="flex-1 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 flex items-center justify-center gap-1"><Edit2 size={12} /> Edit</button>
              <button onClick={() => handleDelete(coach.id)} className="flex-1 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-1"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editId ? 'Edit Coach' : 'Add New Coach'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <input required placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <input placeholder="License (e.g. CAF License B)" value={form.license} onChange={e => setForm({...form, license: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <input placeholder="Specialization" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <input placeholder="Experience (e.g. 5 years)" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="Active">Active</option><option value="Inactive">Inactive</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">{editId ? 'Update' : 'Add Coach'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
