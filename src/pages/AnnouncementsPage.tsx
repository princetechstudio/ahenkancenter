import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { announcementsDB } from '../store';
import { Plus, X, Megaphone, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(announcementsDB.getAll());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', audience: 'Everyone', priority: 'Medium' as any, date: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    announcementsDB.create({ ...form, createdBy: user?.name || 'Admin' });
    setAnnouncements(announcementsDB.getAll());
    setShowForm(false);
    toast.success('Announcement published!');
  };

  const handleDelete = (id: string) => {
    announcementsDB.delete(id);
    setAnnouncements(announcementsDB.getAll());
    toast.success('Announcement deleted');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) { case 'Urgent': return 'bg-red-100 text-red-700 border-red-200'; case 'High': return 'bg-orange-100 text-orange-700 border-orange-200'; case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200'; case 'Low': return 'bg-gray-100 text-gray-700 border-gray-200'; default: return 'bg-gray-100 text-gray-700'; }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-sm text-gray-500">{announcements.length} announcements</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.sort((a, b) => b.date.localeCompare(a.date)).map(ann => (
          <div key={ann.id} className={`bg-white rounded-xl p-5 card-shadow border-l-4 ${getPriorityColor(ann.priority)} hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(ann.priority)}`}>{ann.priority}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{ann.audience}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{ann.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{ann.message}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {ann.date}</span>
                  <span>By {ann.createdBy}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(ann.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">New Announcement</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <textarea required placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={4} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>Everyone</option><option>Coaches</option><option>Players</option><option>Parents</option><option>U-8</option><option>U-10</option><option>U-12</option><option>U-14</option><option>U-15</option><option>U-17</option>
                </select>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                </select>
              </div>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
