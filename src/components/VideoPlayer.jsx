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
  const [quality, setQuality] = useState('Auto');
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const [qualityOptions, setQualityOptions] = useState([{ index: -1, label: 'Auto' }]);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const hlsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(true);
    }, 0);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    return () => {
      clearTimeout(timer);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [channelName]);

  // Synchronize playing state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(err => {
        console.warn('Autoplay/play failed:', err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Synchronize volume and mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume / 100;
  }, [isMuted, volume]);

  // Load and play HLS (.m3u8) streams
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;
    const isHls = videoUrl && (videoUrl.endsWith('.m3u8') || videoUrl.includes('.m3u8') || videoUrl.includes('m3u8'));

    if (isHls) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        if (isPlayingRef.current) {
          video.play().catch(() => {});
        }
        setTimeout(() => {
          setQualityOptions([{ index: -1, label: 'Auto' }]);
          setQuality('Auto');
        }, 0);
      } else {
        import('hls.js').then(({ default: Hls }) => {
          if (!Hls.isSupported()) {
            video.src = videoUrl;
            return;
          }

          hls = new Hls({
            maxMaxBufferLength: 10,
            liveSyncDuration: 3,
            liveMaxLatencyDuration: 10,
          });

          hlsRef.current = hls;

          hls.loadSource(videoUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (isPlayingRef.current) {
              video.play().catch(() => {});
            }

            if (hls.levels && hls.levels.length > 0) {
              const options = hls.levels.map((level, index) => {
                const label = level.height ? `${level.height}p` : `Level ${index + 1}`;
                return { index, label };
              });
              setQualityOptions([{ index: -1, label: 'Auto' }, ...options]);
              setQuality('Auto');
            } else {
              setQualityOptions([{ index: -1, label: 'Auto' }]);
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.Type?.NETWORK_ERROR || 'networkError':
                  hls.startLoad();
                  break;
                case Hls.Type?.MEDIA_ERROR || 'mediaError':
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  hlsRef.current = null;
                  break;
              }
            }
          });
        });
      }
    } else {
      video.src = videoUrl;
      if (isPlayingRef.current) {
        video.play().catch(() => {});
      }
      setTimeout(() => {
        setQualityOptions([{ index: -1, label: 'Auto' }]);
        setQuality('Auto');
      }, 0);
    }

    return () => {
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);

  const changeQuality = (option) => {
    setQuality(option.label);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = option.index;
    }
    setIsQualityOpen(false);
  };

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
        <video
          ref={videoRef}
          alt="Live Stream"
          className={`h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-40 grayscale'}`}
          playsInline
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 left-4 right-4 z-20 flex items-center justify-between gap-4 p-2 md:p-3"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 md:gap-6">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-[#E61944] hover:scale-105 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>

                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-[#E61944] hover:scale-105 transition-all cursor-pointer"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
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

                  <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-white/80">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E61944]" />
                      Live Stream
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setIsQualityOpen(!isQualityOpen);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#E61944] transition-colors cursor-pointer bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/5"
                    >
                      <Settings size={15} />
                      <span>{quality}</span>
                    </button>

                    {isQualityOpen && qualityOptions.length > 0 && (
                      <div className="absolute bottom-full right-0 mb-3 w-32 rounded-xl bg-zinc-950/90 p-2 backdrop-blur-xl border border-white/10 shadow-2xl">
                        {qualityOptions.map(opt => (
                          <button
                            key={opt.index}
                            onClick={e => {
                              e.stopPropagation();
                              changeQuality(opt);
                            }}
                            className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-bold transition-colors cursor-pointer ${quality === opt.label ? 'bg-[#E61944] text-white' : 'text-white/60 hover:bg-white/10'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={toggleFullScreen}
                    className="text-white hover:text-[#E61944] hover:scale-105 transition-all cursor-pointer bg-white/10 hover:bg-white/20 p-1.5 rounded-lg border border-white/5"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
