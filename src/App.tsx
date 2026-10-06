import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerRegisterPage } from './pages/PlayerRegisterPage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';
import { CoachesPage } from './pages/CoachesPage';
import { TrainingPage } from './pages/TrainingPage';
import { AttendancePage } from './pages/AttendancePage';
import { MatchesPage } from './pages/MatchesPage';
import { PerformancePage } from './pages/PerformancePage';
import { ScoutingPage } from './pages/ScoutingPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AICoachPage } from './pages/AICoachPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DigitalIDPage, VerifyPlayerPage } from './pages/DigitalIDPage';
import { PublicWebsite } from './pages/PublicWebsite';

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Parent Portal
const ParentPortal: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayoutWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
        </div>
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Your Child's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Overall Rating', value: '8.7', color: 'text-primary' },
              { label: 'Attendance', value: '94%', color: 'text-green-600' },
              { label: 'Goals', value: '12', color: 'text-blue-600' },
              { label: 'Assists', value: '8', color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <h4 className="font-medium text-gray-800 mb-3">Upcoming Training</h4>
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div>
                <p className="text-sm font-medium">Technical Skills - U17</p>
                <p className="text-xs text-gray-500">June 16, 2025 • 4:00 PM</p>
              </div>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Scheduled</span>
            </div>
          </div>
          <h4 className="font-medium text-gray-800 mb-3">Recent Announcements</h4>
          <div className="space-y-2">
            <div className="p-3 border border-gray-100 rounded-lg">
              <p className="text-sm font-medium">Pre-Season Training Begins</p>
              <p className="text-xs text-gray-500">All players report on Monday, June 16th</p>
            </div>
            <div className="p-3 border border-gray-100 rounded-lg">
              <p className="text-sm font-medium">Fee Payment Reminder</p>
              <p className="text-xs text-gray-500">June training fees due by 15th</p>
            </div>
          </div>
        </div>
      </DashboardLayoutWrapper>
    </div>
  );
};

// Player Portal
const PlayerPortal: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayoutWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500">Your player dashboard</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Overall Rating', value: '8.7', icon: '⭐' },
            { label: 'Attendance', value: '94%', icon: '📋' },
            { label: 'Goals', value: '12', icon: '⚽' },
            { label: 'Assists', value: '8', icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 card-shadow border border-gray-100 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Next Training</h3>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm font-medium">Technical Skills - U17</p>
              <p className="text-xs text-gray-500">June 16, 2025 • 4:00 PM - 5:30 PM</p>
              <p className="text-xs text-gray-500">Adeiso Community Field</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Next Match</h3>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium">vs Koforidua Stars FC</p>
              <p className="text-xs text-gray-500">June 20, 2025 • 3:00 PM</p>
              <p className="text-xs text-gray-500">Eastern Regional Youth League</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Development Progress</h3>
            <div className="space-y-2">
              {[
                { label: 'Technical', value: 8.8, color: 'bg-blue-500' },
                { label: 'Physical', value: 8.1, color: 'bg-green-500' },
                { label: 'Tactical', value: 7.9, color: 'bg-purple-500' },
                { label: 'Mental', value: 8.5, color: 'bg-amber-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-16">{s.label}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.value * 10}%` }} />
                  </div>
                  <span className="text-xs font-bold w-6">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Coach Feedback</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">"Excellent progress in shooting accuracy this month. Keep up the hard work and focus on defensive positioning."</p>
              <p className="text-xs text-gray-400 mt-2">— Coach Kwesi, June 2025</p>
            </div>
          </div>
        </div>
      </DashboardLayoutWrapper>
    </div>
  );
};

// Wrapper for portals
import { DashboardLayout } from './components/Layout';
const DashboardLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify/player/:id" element={<VerifyPlayerPage />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/players" element={<ProtectedRoute><PlayersPage /></ProtectedRoute>} />
      <Route path="/players/register" element={<ProtectedRoute><PlayerRegisterPage /></ProtectedRoute>} />
      <Route path="/players/:id" element={<ProtectedRoute><PlayerProfilePage /></ProtectedRoute>} />
      <Route path="/players/:id/digital-id" element={<ProtectedRoute><DigitalIDPage /></ProtectedRoute>} />
      <Route path="/coaches" element={<ProtectedRoute><CoachesPage /></ProtectedRoute>} />
      <Route path="/training" element={<ProtectedRoute><TrainingPage /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
      <Route path="/scouting" element={<ProtectedRoute><ScoutingPage /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="/ai-coach" element={<ProtectedRoute><AICoachPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute><ParentPortal /></ProtectedRoute>} />
      <Route path="/player" element={<ProtectedRoute><PlayerPortal /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
