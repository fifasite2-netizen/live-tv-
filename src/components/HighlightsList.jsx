'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Eye, Calendar, Trophy, X, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';
import highlights from '@/data/highlights.json';
import Link from 'next/link';

/* ── Load YouTube IFrame API once ── */
let apiReady = false;
let apiCallbacks = [];

function loadYouTubeAPI() {
  if (apiReady) return Promise.resolve();
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) {
    apiReady = true;
    return Promise.resolve();
  }

  return new Promise(resolve => {
    apiCallbacks.push(resolve);
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      apiReady = true;
      apiCallbacks.forEach(cb => cb());
      apiCallbacks = [];
    };
  });
}

/* ── Single highlight card with embedded player ── */
const HighlightCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const hideTimerRef = useRef(null);

  /* Format seconds → mm:ss */
  const fmt = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /* Start progress polling */
  const startPolling = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p || typeof p.getCurrentTime !== 'function') return;
      const cur = p.getCurrentTime();
      const dur = p.getDuration();
      if (dur > 0) {
        setCurrentTime(cur);
        setDuration(dur);
        setProgress((cur / dur) * 100);
      }
    }, 250);
  }, []);

  /* Create YT player */
  const openPlayer = useCallback(async () => {
    setIsPlaying(true);
    setPaused(false);
    setProgress(0);

    await loadYouTubeAPI();

    // Small delay so container renders
    setTimeout(() => {
      const el = document.getElementById(`yt-player-${video.id}`);
      if (!el) return;

      playerRef.current = new window.YT.Player(el, {
        videoId: video.embedId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          showinfo: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          fs: 0,
        },
        events: {
          onReady: () => {
            startPolling();
          },
          onStateChange: e => {
            // YT.PlayerState: 1=PLAYING, 2=PAUSED, 0=ENDED
            setPaused(e.data === 2);
            if (e.data === 0) {
              // Video ended — reset
              setIsPlaying(false);
              clearInterval(intervalRef.current);
            }
          },
        },
      });
    }, 100);
  }, [video.id, video.embedId, startPolling]);

  /* Close player */
  const closePlayer = useCallback(() => {
    clearInterval(intervalRef.current);
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy();
    }
    playerRef.current = null;
    setIsPlaying(false);
    setPaused(false);
    setProgress(0);
  }, []);

  /* Toggle play/pause */
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (paused) {
      p.playVideo();
      setPaused(false);
    } else {
      p.pauseVideo();
      setPaused(true);
    }
  }, [paused]);

  /* Seek on progress bar click */
  const handleSeek = useCallback(
    e => {
      const p = playerRef.current;
      if (!p || !duration) return;
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      p.seekTo(ratio * duration, true);
      setProgress(ratio * 100);
    },
    [duration]
  );

  /* Toggle fullscreen on container (not iframe — keeps overlay blocking YT links) */
  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  /* Track fullscreen state */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /* Auto-hide controls after 3s */
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!paused) setShowControls(false);
    }, 3000);
  }, [paused]);

  /* Cleanup */
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className="group space-y-3">
      <div
        ref={containerRef}
        className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10 bg-black"
        onMouseMove={isPlaying ? resetHideTimer : undefined}
        onMouseLeave={() => isPlaying && !paused && setShowControls(false)}
      >
        {isPlaying ? (
          <>
            {/* YouTube player renders here */}
            <div id={`yt-player-${video.id}`} className="absolute inset-0 w-full h-full" />

            {/* Full overlay — blocks all YouTube clicks */}
            <div className="absolute inset-0 z-[1]" onClick={togglePlay} />

            {/* Custom controls overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 z-[2] transition-opacity duration-300 ${
                showControls || paused ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Gradient backdrop for controls */}
              <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-3 px-3 space-y-2">
                {/* Progress bar */}
                <div
                  className="group/bar relative h-1 bg-white/20 rounded-full cursor-pointer hover:h-1.5 transition-all"
                  onClick={handleSeek}
                >
                  {/* Buffered / played */}
                  <div
                    className="absolute inset-y-0 left-0 bg-[#E61944] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Scrub handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-[#E61944] rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
                  />
                </div>

                {/* Bottom row: play/pause + time + close */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      {paused ? <Play size={16} fill="white" /> : <Pause size={16} fill="white" />}
                    </button>
                    {/* Time */}
                    <span className="text-[11px] font-mono text-white/80 tabular-nums">
                      {fmt(currentTime)} / {fmt(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    {/* Close */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (document.fullscreenElement) document.exitFullscreen();
                        closePlayer();
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-[#E61944] text-white transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>



            {/* Center play/pause indicator on click */}
            {paused && (
              <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                  <Play size={28} fill="white" />
                </div>
              </div>
            )}
          </>
        ) : (
          /* Thumbnail state */
          <div className="cursor-pointer" onClick={openPlayer}>
            <img
              src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E61944]/90 text-white shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play size={24} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
            {video.competition && (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                <Trophy size={10} className="text-amber-400" />
                {video.competition}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="space-y-1">
        <h3 className="font-bold text-sm line-clamp-2 group-hover:text-[#E61944] transition-colors leading-snug">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
          {video.teams && <span className="text-zinc-400">{video.teams}</span>}
          <span className="flex items-center gap-1">
            <Eye size={10} />
            {video.views}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {video.uploadedAgo}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Main highlights grid ── */
const HighlightsList = ({ showAll = false }) => {
  const videos = showAll ? highlights : highlights.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Film size={20} className="text-[#E61944]" />
          Match Highlights
        </h2>
        {showAll ? (
          <Link href="/" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider hover:text-[#E61944] transition-colors">
            ← Back to home
          </Link>
        ) : (
          <Link href="/highlights" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider hover:text-[#E61944] transition-colors">
            See all highlights {">>"}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map(video => (
          <HighlightCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default HighlightsList;
