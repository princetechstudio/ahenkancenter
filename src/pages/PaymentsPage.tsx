import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { paymentsDB, playersDB } from '../store';
import { Plus, Download, X, CreditCard, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState(paymentsDB.getAll());
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const players = playersDB.getAll();

  const [form, setForm] = useState({ playerId: '', amount: 0, paymentType: 'Monthly' as any, paymentDate: '', paymentMethod: 'Cash' as any, reference: '', status: 'Paid' as any, notes: '' });

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + p.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.playerId || !form.amount) { toast.error('Please fill required fields'); return; }
    paymentsDB.create(form);
    setPayments(paymentsDB.getAll());
    setShowForm(false);
    toast.success('Payment recorded!');
  };

  const exportCSV = () => {
    const headers = 'Player,Amount,Type,Method,Status,Date,Reference\n';
    const rows = filtered.map(p => {
      const player = players.find(pl => pl.id === p.playerId);
      return `${player?.fullName || 'Unknown'},${p.amount},${p.paymentType},${p.paymentMethod},${p.status},${p.paymentDate},${p.reference}`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ahenkan_payments.csv'; a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) { case 'Paid': return 'bg-green-100 text-green-700'; case 'Pending': return 'bg-amber-100 text-amber-700'; case 'Overdue': return 'bg-red-100 text-red-700'; case 'Partial': return 'bg-blue-100 text-blue-700'; default: return 'bg-gray-100 text-gray-700'; }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
          <p className="text-sm text-gray-500">Financial management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"><Download size={16} /> Export</button>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2"><Plus size={16} /> Record Payment</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CreditCard size={18} className="text-green-600" /></div>
            <div><p className="text-xs text-gray-500">Total Revenue</p><p className="text-xl font-bold text-gray-800">GHS {totalRevenue.toLocaleString()}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle size={18} className="text-green-600" /></div>
            <div><p className="text-xs text-gray-500">Paid</p><p className="text-xl font-bold text-green-600">GHS {payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><TrendingUp size={18} className="text-amber-600" /></div>
            <div><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-bold text-amber-600">GHS {pending.toLocaleString()}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle size={18} className="text-red-600" /></div>
            <div><p className="text-xs text-gray-500">Overdue</p><p className="text-xl font-bold text-red-600">GHS {overdue.toLocaleString()}</p></div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'Paid', 'Pending', 'Overdue', 'Partial'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Player</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(payment => {
                const player = players.find(p => p.id === payment.playerId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{player?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm font-semibold">GHS {payment.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{payment.paymentType}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{payment.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{payment.paymentDate || '-'}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(payment.status)}`}>{payment.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Record Payment</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select required value={form.playerId} onChange={e => setForm({...form, playerId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="">Select Player</option>
                {players.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
              <input required type="number" placeholder="Amount (GHS)" value={form.amount || ''} onChange={e => setForm({...form, amount: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <select value={form.paymentType} onChange={e => setForm({...form, paymentType: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option>Registration</option><option>Training</option><option>Monthly</option><option>Tournament</option><option>Equipment</option><option>Other</option>
              </select>
              <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option>Mobile Money</option><option>MTN MoMo</option><option>Telecel</option><option>AirtelTigo</option><option>Bank Transfer</option><option>Cash</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.paymentDate} onChange={e => setForm({...form, paymentDate: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>Paid</option><option>Pending</option><option>Partial</option><option>Overdue</option>
                </select>
              </div>
              <input placeholder="Reference" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={2} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
