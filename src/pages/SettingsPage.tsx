import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { activityLogsDB } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { Save, Shield, Bell, Users, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [section, setSection] = useState('academy');
  const logs = activityLogsDB.getRecent(30);
  const [academyForm, setAcademyForm] = useState({
    name: 'Ahenkan Football Academy', address: 'Adeiso, Upper West Akyem, Ghana',
    phone: '+233 24 000 0000', email: 'info@ahenkanfc.com', website: 'www.ahenkanfc.com',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const sections = [
    { id: 'academy', label: 'Academy', icon: Building },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'activity', label: 'Activity Log', icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Manage academy configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100 h-fit">
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm text-left transition-colors ${section === s.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <s.icon size={16} /> {s.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {section === 'academy' && (
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Academy Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Academy Name</label>
                  <input value={academyForm.name} onChange={e => setAcademyForm({...academyForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                  <input value={academyForm.address} onChange={e => setAcademyForm({...academyForm, address: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <input value={academyForm.phone} onChange={e => setAcademyForm({...academyForm, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input value={academyForm.email} onChange={e => setAcademyForm({...academyForm, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
                  <input value={academyForm.website} onChange={e => setAcademyForm({...academyForm, website: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                </div>
                <button onClick={handleSave} className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium flex items-center gap-2"><Save size={16} /> Save Changes</button>
              </div>
            </div>
          )}

          {section === 'users' && (
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Users & Roles</h3>
              <div className="space-y-3">
                {[
                  { name: 'Admin User', email: 'admin@ahenkan.com', role: 'Admin', status: 'Active' },
                  { name: 'Coach Kwesi', email: 'coach@ahenkan.com', role: 'Coach', status: 'Active' },
                  { name: 'Kwame Mensah', email: 'player@ahenkan.com', role: 'Player', status: 'Active' },
                  { name: 'Mr. Mensah', email: 'parent@ahenkan.com', role: 'Parent', status: 'Active' },
                  { name: 'Scout Asante', email: 'scout@ahenkan.com', role: 'Scout', status: 'Active' },
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">{u.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{u.role}</span>
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{u.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                {['Email Notifications', 'Push Notifications', 'Announcement Alerts', 'Payment Reminders', 'Attendance Alerts'].map((item, i) => (
                  <div key={item} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <span className="text-sm">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                ))}
                <button onClick={handleSave} className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium flex items-center gap-2"><Save size={16} /> Save</button>
              </div>
            </div>
          )}

          {section === 'security' && (
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                </div>
                <button onClick={handleSave} className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Update Password</button>
              </div>
            </div>
          )}

          {section === 'activity' && (
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Activity Log</h3>
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.details}</p>
                      <p className="text-xs text-gray-500">{log.userName} • {log.action} {log.entityType} • {new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
