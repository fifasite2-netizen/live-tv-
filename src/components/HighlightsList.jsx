import { Play, Film } from 'lucide-react';

const HIGHLIGHTS = [
  {
    id: 1,
    title: 'Argentina vs France - All Goals',
    duration: '12:45',
    thumbnail:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400',
    views: '2.4M views',
  },
  {
    id: 2,
    title: 'Top 10 Saves of the Week',
    duration: '08:20',
    thumbnail:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=400',
    views: '1.1M views',
  },
  {
    id: 3,
    title: 'Brazil Training Session Highlights',
    duration: '05:15',
    thumbnail:
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=400',
    views: '850K views',
  },
];

const HighlightsList = () => {
  return (
    <div className="space-y-4 ">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Film size={20} className="text-[#E61944]" />
          Match Highlights
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HIGHLIGHTS.map(video => (
          <div key={video.id} className="group cursor-pointer space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E61944] text-white shadow-xl">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {video.duration}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm line-clamp-1 group-hover:text-[#E61944] transition-colors">
                {video.title}
              </h3>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                {video.views} &bull; 2 hours ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightsList;
