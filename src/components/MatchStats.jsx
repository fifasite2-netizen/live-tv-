import { Calendar, Zap, BarChart3 } from 'lucide-react';

const MatchStats = ({ schedule = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-center gap-3 rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/60 h-[72px]" />
        ))}
      </div>
    );
  }

  // 1. Next Match (First scheduled match in future)
  const next = schedule.find(m => m.state === 'pre');
  const nextMatchText = next 
    ? `${next.teamA} vs ${next.teamB} • ${next.time}`
    : 'No upcoming matches';

  // 2. Live Score (First live match)
  const live = schedule.find(m => m.state === 'in');
  const liveScoreText = live
    ? `${live.teamA} ${live.scoreA} - ${live.scoreB} ${live.teamB} (${live.statusText})`
    : 'No active live matches';

  // 3. Recent Result (Last completed match)
  const completed = [...schedule].reverse().find(m => m.state === 'post');
  const recentResultText = completed
    ? `${completed.teamA} ${completed.scoreA} - ${completed.scoreB} ${completed.teamB} (FT)`
    : 'No recent results';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Next Match */}
      <div className="flex items-center gap-3 rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/60">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E61944]/10 text-[#E61944]">
          <Calendar size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">
            Next Match
          </p>
          <p className="text-sm font-bold text-white truncate">{nextMatchText}</p>
        </div>
      </div>

      {/* Live Score */}
      <div className="flex items-center gap-3 rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/60">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <Zap size={20} className={live ? 'animate-pulse' : ''} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">
            Live Score
          </p>
          <p className="text-sm font-bold text-white truncate">{liveScoreText}</p>
        </div>
      </div>

      {/* Recent Result */}
      <div className="flex items-center gap-3 rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/60">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <BarChart3 size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">
            Recent Result
          </p>
          <p className="text-sm font-bold text-white truncate">{recentResultText}</p>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
