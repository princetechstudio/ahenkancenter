import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout';
import { playersDB } from '../store';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, ArrowLeft } from 'lucide-react';

export const DigitalIDPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const player = playersDB.getById(id || '');

  if (!player) return (
    <DashboardLayout>
      <div className="text-center py-20">
        <p className="text-gray-500">Player not found</p>
        <Link to="/players" className="text-primary text-sm mt-2 inline-block">← Back to Players</Link>
      </div>
    </DashboardLayout>
  );

  const age = new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to={`/players/${player.id}`} className="text-sm text-primary flex items-center gap-1 hover:underline mb-4">
          <ArrowLeft size={14} /> Back to Profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Digital Player ID</h1>
        <p className="text-sm text-gray-500">Official Ahenkan Football Academy player identification card</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Player Card */}
        <div className="mx-auto">
          <div className="w-[380px] h-[240px] rounded-2xl overflow-hidden relative card-shadow-lg">
            {/* Background */}
            <div className="absolute inset-0 gradient-primary">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/30 blur-3xl -translate-y-1/4 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent/40 blur-2xl translate-y-1/4 -translate-x-1/4" />
              </div>
            </div>

            {/* Content */}
            <div className="relative h-full p-5 flex flex-col justify-between text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-accent" />
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-green-200">AHENKAN FOOTBALL ACADEMY</p>
                    <p className="text-[8px] text-green-300">Developing Ghana's Future Stars</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{player.ageGroup}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                  {player.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-lg font-bold">{player.fullName}</p>
                  <p className="text-xs text-green-200">{player.position} • #{player.jerseyNumber}</p>
                  <p className="text-[10px] text-green-300 mt-1">ID: AFA-{player.id.toUpperCase().slice(0, 6)}</p>
                  <p className="text-[10px] text-green-300">Status: {player.status}</p>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="text-[9px] text-green-200">
                  <p>Est. 2025 • Adeiso, Ghana</p>
                </div>
                <div className="bg-white p-1.5 rounded-lg">
                  <QRCodeSVG value={`${window.location.origin}/verify/player/${player.id}`} size={48} level="M" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="w-[380px] mt-4 rounded-2xl overflow-hidden card-shadow-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-primary" />
              <p className="text-xs font-bold text-primary">AHENKAN FC — PLAYER CARD</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-gray-500">Full Name</p><p className="font-medium">{player.fullName}</p></div>
              <div><p className="text-gray-500">Date of Birth</p><p className="font-medium">{player.dateOfBirth}</p></div>
              <div><p className="text-gray-500">Age Group</p><p className="font-medium">{player.ageGroup}</p></div>
              <div><p className="text-gray-500">Position</p><p className="font-medium">{player.position}</p></div>
              <div><p className="text-gray-500">Jersey Number</p><p className="font-medium">#{player.jerseyNumber}</p></div>
              <div><p className="text-gray-500">Preferred Foot</p><p className="font-medium">{player.preferredFoot}</p></div>
              <div><p className="text-gray-500">Blood Group</p><p className="font-medium">{player.bloodGroup}</p></div>
              <div><p className="text-gray-500">Emergency Contact</p><p className="font-medium">{player.emergencyPhone}</p></div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-center">
              <p className="text-[9px] text-gray-400">This card is property of Ahenkan Football Academy. If found, please return to Adeiso, Upper West Akyem, Ghana.</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Digital ID Information</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm font-medium text-green-800">✓ Verified Player</p>
              <p className="text-xs text-green-600 mt-1">This player is officially registered with Ahenkan Football Academy</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">QR Code Verification</p>
              <p className="text-xs text-gray-500">Scan the QR code on the player card to verify their identity and view their public profile.</p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 font-mono break-all">Verification URL: {window.location.origin}/verify/player/{player.id}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Player Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Overall Rating', value: player.overallRating },
                  { label: 'Attendance', value: `${player.attendanceRate}%` },
                  { label: 'Goals', value: player.goals },
                  { label: 'Assists', value: player.assists },
                ].map(s => (
                  <div key={s.label} className="p-2 bg-gray-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-primary">{s.value}</p>
                    <p className="text-[10px] text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => window.print()} className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
              Print Player Card
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const VerifyPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const player = playersDB.getById(id || '');

  if (!player) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl p-8 card-shadow max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl">✗</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Player Not Found</h2>
        <p className="text-sm text-gray-500">The player ID could not be verified. Please check the ID and try again.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl p-8 card-shadow max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Shield size={28} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Player Verified ✓</h2>
          <p className="text-sm text-gray-500 mt-1">Ahenkan Football Academy</p>
        </div>

        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between"><span className="text-sm text-gray-500">Name</span><span className="text-sm font-medium">{player.fullName}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">Player ID</span><span className="text-sm font-medium">AFA-{player.id.toUpperCase().slice(0, 6)}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">Age Group</span><span className="text-sm font-medium">{player.ageGroup}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">Position</span><span className="text-sm font-medium">{player.position}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">Status</span><span className="text-sm font-medium text-green-600">{player.status}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">Verified</span><span className="text-sm font-medium">{new Date().toLocaleDateString()}</span></div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Adeiso, Upper West Akyem, Ghana</p>
          <p className="text-xs text-gray-400">Developing Ghana's Future Stars</p>
        </div>
      </div>
    </div>
  );
};
