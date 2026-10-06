import React, { useState, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, UserCog, Calendar, ClipboardCheck,
  Trophy, BarChart3, Eye, CreditCard, Megaphone, Bot, FileText,
  Settings, LogOut, Bell, Search, Menu, X, ChevronDown
} from 'lucide-react';
import { globalSearch, notificationsDB } from '../store';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/players', label: 'Players', icon: Users },
  { path: '/coaches', label: 'Coaches', icon: UserCog },
  { path: '/training', label: 'Training', icon: Calendar },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/matches', label: 'Matches', icon: Trophy },
  { path: '/performance', label: 'Performance', icon: BarChart3 },
  { path: '/scouting', label: 'Scouting', icon: Eye },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/ai-coach', label: 'AI Coach', icon: Bot },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200 sidebar-shadow transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} fixed h-full z-30`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shrink-0">A</div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-primary text-sm">Ahenkan FC</h1>
                <p className="text-[10px] text-gray-500">Academy Management</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-red-600 hover:bg-red-50 w-full text-sm transition-colors">
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
          <ChevronDown size={12} className={`transform transition-transform ${collapsed ? 'rotate-90' : '-rotate-90'}`} />
        </button>
      </aside>
    </>
  );
};

export const Topbar: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = user ? notificationsDB.getAll(user.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setSearchResults(globalSearch(q));
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search players, coaches, matches..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              className="bg-transparent border-none outline-none ml-2 text-sm w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-h-80 overflow-y-auto">
                <h3 className="font-semibold text-sm mb-3">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2 rounded-lg mb-2 ${n.read ? 'bg-gray-50' : 'bg-green-50 border border-green-100'}`}>
                      <p className="text-xs font-medium">{n.title}</p>
                      <p className="text-[11px] text-gray-500">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium">{user?.name}</p>
              <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchOpen && searchResults.length > 0 && (
        <div className="absolute left-4 md:left-20 top-16 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
          {searchResults.map(group => (
            <div key={group.category} className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 mb-1">{group.category}</h4>
              {group.items.slice(0, 3).map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    if (group.category === 'Players') navigate(`/players/${item.id}`);
                  }}
                  className="block w-full text-left p-2 rounded hover:bg-gray-50 text-sm"
                >
                  {item.fullName || item.title || item.opponent}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export const MobileNav: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white animate-slideIn overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h1 className="font-bold text-primary text-sm">Ahenkan FC</h1>
              <p className="text-[10px] text-gray-500">Academy Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
        </div>

        <nav className="py-4 px-3">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm ${
                  isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-medium">{user?.name}</p>
              <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64">
        <Topbar onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
      <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
};
