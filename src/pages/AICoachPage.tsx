import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { playersDB, performanceDB, attendanceDB } from '../store';
import { Bot, Send, User, Sparkles } from 'lucide-react';

interface Message { role: 'user' | 'ai'; content: string; }

export const AICoachPage: React.FC = () => {
  const players = playersDB.getAll();
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const player = players.find(p => p.id === selectedPlayer);
  const attendRecords = player ? attendanceDB.getByPlayer(player.id) : [];

  const generateAnalysis = (): string => {
    if (!player) return 'No player selected';
    const avgAttendance = attendRecords.length > 0 ? Math.round(attendRecords.filter(a => a.status === 'Present').length / attendRecords.length * 100) : player.attendanceRate;
    const p = player;
    const lines: string[] = [];
    lines.push(`## Player Analysis: ${p.fullName}`);
    lines.push('');
    lines.push(`**Overview:**`);
    lines.push(`${p.fullName} is a ${p.ageGroup} ${p.position} with an overall rating of ${p.overallRating}/10.`);
    lines.push('');
    lines.push('**Strengths:**');
    if (p.technical >= 8) lines.push('• Strong technical ability with excellent ball control and passing');
    if (p.physical >= 8) lines.push('• Outstanding physical attributes - speed and agility');
    if (p.mental >= 8) lines.push('• Great mental strength - confidence and leadership qualities');
    if (p.tactical >= 8) lines.push('• Good tactical understanding of the game');
    lines.push(`• Consistent attendance record (${avgAttendance}%)`);
    lines.push(`• ${p.goals} goals and ${p.assists} assists recorded`);
    lines.push('');
    lines.push('**Areas for Development:**');
    if (p.technical < 7.5) lines.push('• Technical skills need improvement');
    if (p.physical < 7.5) lines.push('• Physical conditioning should be a priority');
    if (p.tactical < 7.5) lines.push('• Tactical awareness needs development');
    if (p.mental < 7.5) lines.push('• Mental resilience and focus');
    lines.push('');
    lines.push('**Recommended Training Focus:**');
    const posFocus = p.position === 'Forward' ? 'Finishing drills' : p.position === 'Midfielder' ? 'Passing range and vision' : p.position === 'Defender' ? 'Positioning and 1v1 defending' : 'Shot stopping';
    lines.push(`1. ${posFocus}`);
    lines.push(`2. ${p.physical < p.technical ? 'Physical conditioning program' : 'Advanced technical drills'}`);
    lines.push('3. Match simulation exercises');
    lines.push('');
    lines.push('**Progress Summary:**');
    lines.push(`- Technical: ${p.technical}/10`);
    lines.push(`- Physical: ${p.physical}/10`);
    lines.push(`- Tactical: ${p.tactical}/10`);
    lines.push(`- Mental: ${p.mental}/10`);
    lines.push('');
    lines.push('**Coach Recommendations:**');
    if (p.overallRating >= 8) lines.push('Ready for higher-level competition. Consider promoting to senior training.');
    else if (p.overallRating >= 7) lines.push('Continue current development path. Focus on consistency and match experience.');
    else lines.push('Needs focused individual attention. Recommend additional training sessions.');
    return lines.join('\n');
  };

  const handleSend = () => {
    if (!input.trim() || !player) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let response = '';
      const p = player;
      if (userMsg.toLowerCase().includes('analysis') || userMsg.toLowerCase().includes('summary') || userMsg.toLowerCase().includes('report')) {
        response = generateAnalysis();
      } else if (userMsg.toLowerCase().includes('training') || userMsg.toLowerCase().includes('recommend')) {
        response = [
          `Based on ${p.fullName}'s current profile:`,
          '',
          '**Recommended Training Plan:**',
          '',
          '1. **Technical Session** (3x/week)',
          '   - Ball mastery drills',
          '   - Passing combinations',
          `   - ${p.position === 'Forward' ? 'Finishing practice' : 'Position-specific drills'}`,
          '',
          '2. **Physical Session** (2x/week)',
          '   - Speed and agility work',
          '   - Strength training (age-appropriate)',
          '   - Endurance building',
          '',
          '3. **Tactical Session** (2x/week)',
          '   - Game scenarios',
          '   - Position-specific tactics',
          '   - Team shape understanding',
        ].join('\n');
      } else if (userMsg.toLowerCase().includes('strength') || userMsg.toLowerCase().includes('weakness')) {
        const lines: string[] = [];
        lines.push(`**${p.fullName}'s Analysis:**`);
        lines.push('');
        lines.push('**Strengths:**');
        lines.push(`• ${p.technical >= 8 ? 'Excellent technical ability' : 'Developing technical skills'}`);
        lines.push(`• ${p.attendanceRate >= 90 ? 'Outstanding commitment and attendance' : 'Good dedication to training'}`);
        lines.push(`• ${p.mental >= 8 ? 'Strong mental attributes' : 'Building mental resilience'}`);
        lines.push('');
        lines.push('**Areas to Improve:**');
        lines.push(`• ${p.physical < 8 ? 'Physical conditioning and stamina' : 'Continue maintaining physical standards'}`);
        lines.push(`• ${p.tactical < 8 ? 'Tactical awareness and decision-making' : 'Advanced tactical understanding'}`);
        response = lines.join('\n');
      } else {
        response = generateAnalysis();
      }
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickAnalysis = () => {
    setMessages([{ role: 'ai', content: generateAnalysis() }]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Coach</h1>
          <p className="text-sm text-gray-500">Intelligent player development assistant</p>
        </div>
        <select value={selectedPlayer} onChange={e => { setSelectedPlayer(e.target.value); setMessages([]); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
          {players.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
          {player && (
            <>
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center text-white text-xl font-bold mb-2">
                  {player.fullName.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <h3 className="font-semibold">{player.fullName}</h3>
                <p className="text-xs text-gray-500">{player.ageGroup} • {player.position}</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Overall', value: player.overallRating },
                  { label: 'Technical', value: player.technical },
                  { label: 'Physical', value: player.physical },
                  { label: 'Tactical', value: player.tactical },
                  { label: 'Mental', value: player.mental },
                  { label: 'Attendance', value: `${player.attendanceRate}%` },
                  { label: 'Goals/Assists', value: `${player.goals}/${player.assists}` },
                ].map(s => (
                  <div key={s.label} className="flex justify-between text-sm"><span className="text-gray-500">{s.label}</span><span className="font-bold">{s.value}</span></div>
                ))}
              </div>
              <button onClick={handleQuickAnalysis} className="w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 flex items-center justify-center gap-2">
                <Sparkles size={14} /> Generate Full Analysis
              </button>
            </>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl card-shadow border border-gray-100 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Bot size={20} className="text-primary" />
            <h3 className="font-semibold text-sm">AI Development Coach</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={28} className="text-primary" />
                </div>
                <h4 className="font-medium text-gray-800 mb-2">AI Coach Ready</h4>
                <p className="text-sm text-gray-500 mb-4">Ask about player analysis, training recommendations, or development insights.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Generate analysis', 'Training recommendations', 'Strengths & weaknesses'].map(q => (
                    <button key={q} onClick={() => setInput(q)} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs hover:bg-gray-200">{q}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Bot size={16} className="text-primary" /></div>}
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0"><User size={16} className="text-white" /></div>}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot size={16} className="text-primary" /></div>
                <div className="bg-gray-100 rounded-xl p-3"><div className="flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div></div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask about player development..." className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
              <button onClick={handleSend} disabled={loading} className="px-4 py-2 gradient-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
