'use client';

import { Share2 } from 'lucide-react';

const StreamHeader = ({ 
  title = 'FIFA World Cup 2026: Group Stage', 
  location = 'Live from MetLife Stadium, East Rutherford' 
}) => {
  const handleShare = async () => {
    const shareUrl = window.location.origin;
    const shareData = {
      title: 'Ajker Khela - Live Sports',
      text: 'Watch live sports matches on Ajker Khela!',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share or error — do nothing
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch {
        // Last resort fallback
        prompt('Copy this link:', shareUrl);
      }
    }
  };

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
        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-zinc-900/60 border border-zinc-800/80 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
        >
          <Share2 size={14} className="sm:w-4 sm:h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default StreamHeader;
