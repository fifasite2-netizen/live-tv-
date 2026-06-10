import { Calendar, Zap, BarChart3 } from 'lucide-react';

const MatchStats = ({ 
  nextMatch = 'ARG vs FRA • 20:00', 
  liveScore = "ARG 2 - 1 FRA (72')", 
  possession = '54% - 46%' 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E61944]/10 text-[#E61944]">
          <Calendar size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Next Match
          </p>
          <p className="text-sm font-bold">{nextMatch}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <Zap size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Live Score
          </p>
          <p className="text-sm font-bold">{liveScore}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <BarChart3 size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Possession
          </p>
          <p className="text-sm font-bold">{possession}</p>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
