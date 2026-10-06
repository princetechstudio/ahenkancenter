import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { playersDB, performanceDB, coachesDB } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import toast from 'react-hot-toast';

export const PerformancePage: React.FC = () => {
  const players = playersDB.getAll();
  const coaches = coachesDB.getAll();
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id || '');
  const [showEval, setShowEval] = useState(false);
  const player = players.find(p => p.id === selectedPlayer);
  const records = performanceDB.getByPlayer(selectedPlayer);

  const [evalForm, setEvalForm] = useState({
    date: new Date().toISOString().split('T')[0], coachId: coaches[0]?.id || '',
    technical: { passing: 7, dribbling: 7, shooting: 7, ballControl: 7, crossing: 7 },
    tactical: { positioning: 7, decisionMaking: 7, gameAwareness: 7, defensiveUnderstanding: 7 },
    physical: { speed: 7, strength: 7, stamina: 7, agility: 7 },
    mental: { discipline: 7, confidence: 7, teamwork: 7, leadership: 7, focus: 7 },
    comments: '',
  });

  const handleSaveEval = (e: React.FormEvent) => {
    e.preventDefault();
    performanceDB.create({ playerId: selectedPlayer, ...evalForm });
    toast.success('Performance evaluation saved!');
    setShowEval(false);
  };

  const radarData = player ? [
    { subject: 'Technical', A: player.technical },
    { subject: 'Physical', A: player.physical },
    { subject: 'Tactical', A: player.tactical },
    { subject: 'Mental', A: player.mental },
  ] : [];

  const comparisonData = players.slice(0, 5).map(p => ({
    name: p.fullName.split(' ')[0],
    rating: p.overallRating,
    technical: p.technical,
    physical: p.physical,
  }));

  const RatingSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-28 shrink-0">{label}</span>
      <input type="range" min="1" max="10" value={value} onChange={e => onChange(Number(e.target.value))} className="flex-1 h-1.5 accent-primary" />
      <span className="text-xs font-bold w-6 text-center">{value}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Performance</h1>
          <p className="text-sm text-gray-500">Player development evaluation</p>
        </div>
        <button onClick={() => setShowEval(true)} className="px-4 py-2 gradient-primary text-white rounded-lg text-sm hover:opacity-90">
          New Evaluation
        </button>
      </div>

      {/* Player Selector */}
      <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100 mb-6">
        <label className="text-xs font-medium text-gray-600 mb-1 block">Select Player</label>
        <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)} className="w-full sm:w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
          {players.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.ageGroup})</option>)}
        </select>
      </div>

      {player && (
        <>
          {/* Player Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Development Radar - {player.fullName}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="A" stroke="#1a5632" fill="#1a5632" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Player Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="technical" fill="#1a5632" name="Technical" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="physical" fill="#84cc16" name="Physical" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scores */}
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Current Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Technical', value: player.technical, color: 'bg-blue-500' },
                { label: 'Physical', value: player.physical, color: 'bg-green-500' },
                { label: 'Tactical', value: player.tactical, color: 'bg-purple-500' },
                { label: 'Mental', value: player.mental, color: 'bg-amber-500' },
              ].map(s => (
                <div key={s.label} className="text-center p-4 rounded-lg bg-gray-50">
                  <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.value * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Evaluation History</h3>
            {records.length > 0 ? (
              <div className="space-y-3">
                {records.map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{r.date}</span>
                      <span className="text-xs text-gray-500">Overall: {((r.technical.passing + r.technical.dribbling + r.technical.shooting + r.physical.speed + r.tactical.positioning + r.mental.confidence) / 6).toFixed(1)}</span>
                    </div>
                    {r.comments && <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{r.comments}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">No evaluations recorded yet</p>
            )}
          </div>
        </>
      )}

      {/* Evaluation Form */}
      {showEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Performance Evaluation - {player?.fullName}</h3>
            <form onSubmit={handleSaveEval} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={evalForm.date} onChange={e => setEvalForm({...evalForm, date: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <select value={evalForm.coachId} onChange={e => setEvalForm({...evalForm, coachId: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  {coaches.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-2">Technical</h4>
                <div className="space-y-2">
                  <RatingSlider label="Passing" value={evalForm.technical.passing} onChange={v => setEvalForm({...evalForm, technical: {...evalForm.technical, passing: v}})} />
                  <RatingSlider label="Dribbling" value={evalForm.technical.dribbling} onChange={v => setEvalForm({...evalForm, technical: {...evalForm.technical, dribbling: v}})} />
                  <RatingSlider label="Shooting" value={evalForm.technical.shooting} onChange={v => setEvalForm({...evalForm, technical: {...evalForm.technical, shooting: v}})} />
                  <RatingSlider label="Ball Control" value={evalForm.technical.ballControl} onChange={v => setEvalForm({...evalForm, technical: {...evalForm.technical, ballControl: v}})} />
                  <RatingSlider label="Crossing" value={evalForm.technical.crossing} onChange={v => setEvalForm({...evalForm, technical: {...evalForm.technical, crossing: v}})} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-purple-700 mb-2">Tactical</h4>
                <div className="space-y-2">
                  <RatingSlider label="Positioning" value={evalForm.tactical.positioning} onChange={v => setEvalForm({...evalForm, tactical: {...evalForm.tactical, positioning: v}})} />
                  <RatingSlider label="Decision Making" value={evalForm.tactical.decisionMaking} onChange={v => setEvalForm({...evalForm, tactical: {...evalForm.tactical, decisionMaking: v}})} />
                  <RatingSlider label="Game Awareness" value={evalForm.tactical.gameAwareness} onChange={v => setEvalForm({...evalForm, tactical: {...evalForm.tactical, gameAwareness: v}})} />
                  <RatingSlider label="Defensive" value={evalForm.tactical.defensiveUnderstanding} onChange={v => setEvalForm({...evalForm, tactical: {...evalForm.tactical, defensiveUnderstanding: v}})} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2">Physical</h4>
                <div className="space-y-2">
                  <RatingSlider label="Speed" value={evalForm.physical.speed} onChange={v => setEvalForm({...evalForm, physical: {...evalForm.physical, speed: v}})} />
                  <RatingSlider label="Strength" value={evalForm.physical.strength} onChange={v => setEvalForm({...evalForm, physical: {...evalForm.physical, strength: v}})} />
                  <RatingSlider label="Stamina" value={evalForm.physical.stamina} onChange={v => setEvalForm({...evalForm, physical: {...evalForm.physical, stamina: v}})} />
                  <RatingSlider label="Agility" value={evalForm.physical.agility} onChange={v => setEvalForm({...evalForm, physical: {...evalForm.physical, agility: v}})} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-amber-700 mb-2">Mental</h4>
                <div className="space-y-2">
                  <RatingSlider label="Discipline" value={evalForm.mental.discipline} onChange={v => setEvalForm({...evalForm, mental: {...evalForm.mental, discipline: v}})} />
                  <RatingSlider label="Confidence" value={evalForm.mental.confidence} onChange={v => setEvalForm({...evalForm, mental: {...evalForm.mental, confidence: v}})} />
                  <RatingSlider label="Teamwork" value={evalForm.mental.teamwork} onChange={v => setEvalForm({...evalForm, mental: {...evalForm.mental, teamwork: v}})} />
                  <RatingSlider label="Leadership" value={evalForm.mental.leadership} onChange={v => setEvalForm({...evalForm, mental: {...evalForm.mental, leadership: v}})} />
                  <RatingSlider label="Focus" value={evalForm.mental.focus} onChange={v => setEvalForm({...evalForm, mental: {...evalForm.mental, focus: v}})} />
                </div>
              </div>

              <textarea placeholder="Coach comments..." value={evalForm.comments} onChange={e => setEvalForm({...evalForm, comments: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={3} />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEval(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Save Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
