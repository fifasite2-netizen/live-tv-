import { Share2 } from 'lucide-react';

const StreamHeader = ({ 
  title = 'FIFA World Cup 2026: Group Stage', 
  location = 'Live from MetLife Stadium, East Rutherford' 
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight md:text-3xl text-white truncate">
          {title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 truncate">
          {location}
        </p>
      </div>
      <div className="shrink-0">
        <button className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-zinc-900/60 border border-zinc-800/80 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer">
          <Share2 size={14} className="sm:w-4 sm:h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default StreamHeader;
