import { Share2 } from 'lucide-react';

const StreamHeader = ({ 
  title = 'FIFA World Cup 2026: Group Stage', 
  location = 'Live from MetLife Stadium, East Rutherford' 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          {location}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          <Share2 size={16} />
          Share
        </button>
        <button className="flex items-center gap-2 rounded-full bg-[#E61944] px-6 py-2 text-sm font-semibold text-white hover:scale-105 transition-transform">
          Follow Channel
        </button>
      </div>
    </div>
  );
};

export default StreamHeader;
