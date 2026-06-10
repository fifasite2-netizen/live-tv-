'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({ channelName, videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    handleUserActivity();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [channelName]);

  const togglePlay = e => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = e => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = e => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 lg:rounded-2xl"
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={videoUrl}
          alt="Live Stream"
          className={`h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-40 grayscale'}`}
        />
        {!isPlaying && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={togglePlay}
            className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all"
          >
            <Play size={40} fill="currentColor" />
          </motion.button>
        )}
      </div>

      <div className="absolute left-6 top-6 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Live
        </div>
        <div className="rounded-md bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          {channelName}
        </div>
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 md:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 md:gap-6">
                <button
                  onClick={togglePlay}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={24} fill="currentColor" />
                  ) : (
                    <Play size={24} fill="currentColor" />
                  )}
                </button>

                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={24} />
                    ) : (
                      <Volume2 size={24} />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={e => setVolume(parseInt(e.target.value))}
                    className="hidden md:block w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div className="hidden md:flex items-center gap-4 text-xs font-medium text-white/80">
                  <span>01:42:15</span>
                  <span className="text-white/40">/</span>
                  <span className="flex items-center gap-1">
                    <Radio size={12} className="text-red-500" /> Live Stream
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setIsQualityOpen(!isQualityOpen);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#E61944] transition-colors"
                  >
                    <Settings size={18} />
                    <span className="hidden sm:inline">{quality}</span>
                  </button>

                  {isQualityOpen && (
                    <div className="absolute bottom-full right-0 mb-4 w-32 rounded-lg bg-black/90 p-2 backdrop-blur-xl border border-white/10 shadow-2xl">
                      {['1080p', '720p', '480p', 'Auto'].map(q => (
                        <button
                          key={q}
                          onClick={e => {
                            e.stopPropagation();
                            setQuality(q);
                            setIsQualityOpen(false);
                          }}
                          className={`w-full rounded px-3 py-1.5 text-left text-xs font-medium transition-colors ${quality === q ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleFullScreen}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
