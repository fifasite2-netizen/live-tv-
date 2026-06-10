'use client';

import { Calendar, Clock, Trophy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const MatchSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const datesContainerRef = useRef(null);

  useEffect(() => {
    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSchedule(data);
          
          // Determine the default selected date:
          // Find the first match that is live (state === 'in') or in the future
          const now = new Date();
          const activeMatch = data.find(match => {
            return match.state === 'in' || new Date(match.rawDate) >= now;
          });
          
          if (activeMatch) {
            setSelectedDate(activeMatch.date);
          } else if (data.length > 0) {
            // Fallback to the first match's date
            setSelectedDate(data[0].date);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  // Extract unique dates from the schedule
  const uniqueDates = Array.from(new Set(schedule.map(match => match.date)));

  // Filter matches for the selected date
  const filteredMatches = schedule.filter(match => match.date === selectedDate);

  // Auto-scroll selected date into view within the horizontal container
  useEffect(() => {
    if (selectedDate && datesContainerRef.current) {
      const activeTab = datesContainerRef.current.querySelector('[data-active="true"]');
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedDate]);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white">
          <Trophy size={20} className="text-[#E61944] animate-bounce" />
          World Cup 2026
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/10 text-red-500 px-2 py-0.5 rounded-full">
          Live Schedule
        </span>
      </div>

      {/* Date Selector Tabs */}
      {loading ? (
        <div className="h-12 flex items-center gap-2 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-16 animate-pulse rounded-xl bg-zinc-800 flex-shrink-0" />
          ))}
        </div>
      ) : uniqueDates.length > 0 ? (
        <div 
          ref={datesContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1 touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {uniqueDates.map(dateStr => {
            const isActive = dateStr === selectedDate;
            const [monthDay, weekday] = dateStr.split(', ');
            const shortWeekday = weekday ? weekday.substring(0, 3).toUpperCase() : '';
            
            return (
              <button
                key={dateStr}
                data-active={isActive}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center justify-center min-w-[75px] py-1.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#E61944] border-[#E61944] text-white shadow-md shadow-[#E61944]/25 scale-105' 
                    : 'bg-zinc-900/30 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{shortWeekday}</span>
                <span className="text-xs font-extrabold">{monthDay}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Match Cards List */}
      <div className="grid grid-cols-1 gap-3 min-h-[150px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#E61944] border-t-transparent" />
            <span className="text-xs font-semibold">Loading fixtures...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            <Calendar size={28} className="opacity-40 mb-2" />
            <span className="text-xs font-medium">No matches scheduled for this date</span>
          </div>
        ) : (
          filteredMatches.map(match => {
            const isLive = match.state === 'in';
            const isCompleted = match.state === 'post';
            
            return (
              <div
                key={match.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 transition-all ${
                  isLive 
                    ? 'border-red-500/30 bg-red-950/10 shadow-sm'
                    : 'border-zinc-800/60 bg-zinc-900/20 hover:border-zinc-700'
                }`}
              >
                {/* Meta details (group name + status indicator) */}
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <span>{match.group}</span>
                  {isLive ? (
                    <div className="flex items-center gap-1.5 text-red-500">
                      <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                      <span>{match.statusText}</span>
                    </div>
                  ) : isCompleted ? (
                    <span className="text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                      FT
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 text-[#E61944]">
                      <Clock size={11} />
                      <span>{match.time}</span>
                    </div>
                  )}
                </div>

                {/* Main competitors section */}
                <div className="grid grid-cols-7 items-center gap-2">
                  {/* Home Team */}
                  <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                    <span className="font-extrabold text-sm text-zinc-200 truncate">{match.teamA}</span>
                    {match.teamALogo ? (
                      <img 
                        src={match.teamALogo} 
                        alt="" 
                        className="h-6 w-6 object-contain rounded-sm"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                        {match.teamA.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Middle score/VS block */}
                  <div className="col-span-1 flex justify-center text-center">
                    {isLive || isCompleted ? (
                      <div className="flex items-center justify-center bg-zinc-800 px-2 py-1 rounded-lg text-sm font-extrabold text-white tabular-nums">
                        <span>{match.scoreA}</span>
                        <span className="mx-1 text-zinc-500">-</span>
                        <span>{match.scoreB}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-zinc-500">VS</span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="col-span-3 flex items-center justify-start gap-3 text-left">
                    {match.teamBLogo ? (
                      <img 
                        src={match.teamBLogo} 
                        alt="" 
                        className="h-6 w-6 object-contain rounded-sm"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                        {match.teamB.charAt(0)}
                      </div>
                    )}
                    <span className="font-extrabold text-sm text-zinc-200 truncate">{match.teamB}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MatchSchedule;
