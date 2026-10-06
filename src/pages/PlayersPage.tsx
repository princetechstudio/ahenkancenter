import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { playersDB } from '../store';
import { Player } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const PlayersPage: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(playersDB.getAll());
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const perPage = 10;

  const filtered = players
    .filter(p => !search || p.fullName.toLowerCase().includes(search.toLowerCase()) || p.position.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !ageFilter || p.ageGroup === ageFilter)
    .filter(p => !posFilter || p.position === posFilter)
    .filter(p => !statusFilter || p.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'rating') return b.overallRating - a.overallRating;
      if (sortBy === 'attendance') return b.attendanceRate - a.attendanceRate;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = (id: string) => {
    playersDB.delete(id);
    setPlayers(playersDB.getAll());
    setDeleteModal(null);
  };

  const exportCSV = () => {
    const headers = 'Name,Age Group,Position,Status,Rating,Attendance,Goals,Assists\n';
    const rows = filtered.map(p => `${p.fullName},${p.ageGroup},${p.position},${p.status},${p.overallRating},${p.attendanceRate}%,${p.goals},${p.assists}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ahenkan_players.csv';
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      case 'Injured': return 'bg-red-100 text-red-700';
      case 'Trial': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Players</h1>
          <p className="text-sm text-gray-500">{filtered.length} players registered</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button onClick={() => navigate('/players/register')} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
            <Plus size={16} /> Add Player
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search players..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
          </div>
          <select value={ageFilter} onChange={e => { setAgeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
            <option value="">All Age Groups</option>
            <option>U-8</option><option>U-10</option><option>U-12</option><option>U-14</option><option>U-15</option><option>U-17</option>
          </select>
          <select value={posFilter} onChange={e => { setPosFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
            <option value="">All Positions</option>
            <option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
            <option value="">All Status</option>
            <option>Active</option><option>Inactive</option><option>Injured</option><option>Trial</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="attendance">Sort by Attendance</option>
          </select>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Player</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Age Group</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Attendance</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(player => (
                <tr key={player.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {player.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{player.fullName}</p>
                        <p className="text-[11px] text-gray-500">#{player.jerseyNumber} • {player.preferredFoot} foot</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-600">{player.ageGroup}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-600">{player.position}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(player.status)}`}>{player.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${player.overallRating * 10}%` }} />
                      </div>
                      <span className="text-sm font-medium">{player.overallRating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-600">{player.attendanceRate}%</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/players/${player.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View"><Eye size={14} /></button>
                      <button onClick={() => navigate(`/players/${player.id}/digital-id`)} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600" title="Digital ID"><span className="text-xs font-bold">ID</span></button>
                      <button onClick={() => navigate(`/players/register?edit=${player.id}`)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteModal(player.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {paginated.map(player => (
          <div key={player.id} className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {player.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-sm">{player.fullName}</p>
                  <p className="text-xs text-gray-500">{player.ageGroup} • {player.position} • #{player.jerseyNumber}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(player.status)}`}>{player.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{player.overallRating}</p>
                <p className="text-[10px] text-gray-500">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-accent-dark">{player.attendanceRate}%</p>
                <p className="text-[10px] text-gray-500">Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600">{player.goals}/{player.assists}</p>
                <p className="text-[10px] text-gray-500">G/A</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Link to={`/players/${player.id}`} className="flex-1 text-center py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-medium">View</Link>
              <Link to={`/players/${player.id}/digital-id`} className="flex-1 text-center py-1.5 text-xs bg-purple-50 text-purple-600 rounded-lg font-medium">ID Card</Link>
              <button onClick={() => navigate(`/players/register?edit=${player.id}`)} className="flex-1 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg font-medium">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Showing {(page-1)*perPage+1}-{Math.min(page*perPage, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Player</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this player? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteModal)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
