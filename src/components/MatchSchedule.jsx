import { Calendar, Clock } from 'lucide-react';

const SCHEDULE = [
  {
    id: 1,
    teamA: 'Argentina',
    teamB: 'France',
    time: '20:00',
    date: 'Today',
    group: 'Group A',
  },
  {
    id: 2,
    teamA: 'Brazil',
    teamB: 'Germany',
    time: '23:30',
    date: 'Today',
    group: 'Group B',
  },
  {
    id: 3,
    teamA: 'England',
    teamB: 'Spain',
    time: '18:00',
    date: 'Tomorrow',
    group: 'Group C',
  },
  {
    id: 4,
    teamA: 'Portugal',
    teamB: 'Italy',
    time: '21:00',
    date: 'Tomorrow',
    group: 'Group D',
  },
];

const MatchSchedule = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Calendar size={20} className="text-[#E61944]" />
          Match Schedule
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {SCHEDULE.map(match => (
          <div
            key={match.id}
            className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {match.group}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{match.teamA}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  vs
                </span>
                <span className="font-bold text-sm">{match.teamB}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-[#E61944]">
                <Clock size={12} />
                <span className="text-xs font-bold">{match.time}</span>
              </div>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                {match.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSchedule;
