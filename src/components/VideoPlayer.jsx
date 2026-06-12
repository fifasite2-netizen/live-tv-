'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({
  channelName,
  channelCount,
  videoUrl,
  isMobileSticky = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const [qualityOptions, setQualityOptions] = useState([
    { index: -1, label: 'Auto' },
  ]);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isIOSFullscreen, setIsIOSFullscreen] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const hlsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const lastTapRef = useRef(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullScreen(isFS);

      // Unlock orientation when exiting fullscreen
      if (!isFS && screen?.orientation?.unlock) {
        try { screen.orientation.unlock(); } catch (_) {}
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

    // iOS Safari: listen for native video fullscreen events
    const video = videoRef.current;
    const handleIOSBegin = () => { setIsFullScreen(true); setIsIOSFullscreen(true); };
    const handleIOSEnd = () => { setIsFullScreen(false); setIsIOSFullscreen(false); };
    if (video) {
      video.addEventListener('webkitbeginfullscreen', handleIOSBegin);
      video.addEventListener('webkitendfullscreen', handleIOSEnd);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', handleIOSBegin);
        video.removeEventListener('webkitendfullscreen', handleIOSEnd);
      }
    };
  }, []);

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

    // Do not play/pause if no source is loaded yet
    const hasSource = video.src || hlsRef.current;
    if (!hasSource) return;

    if (isPlaying) {
      // Seek to live edge for live streams on play/resume
      if (hlsRef.current) {
        hlsRef.current.startLoad();
      }

      try {
        if (hlsRef.current) {
          const livePos = hlsRef.current.liveSyncPosition;
          if (livePos !== null && livePos !== undefined && !isNaN(livePos)) {
            if (livePos - video.currentTime > 0.5) {
              video.currentTime = livePos;
            }
          } else if (video.seekable && video.seekable.length > 0) {
            const seekableStart = video.seekable.start(0);
            const seekableEnd = video.seekable.end(video.seekable.length - 1);
            const targetTime = Math.max(seekableStart, seekableEnd - 2);
            if (targetTime - video.currentTime > 0.5) {
              video.currentTime = targetTime;
            }
          }
        } else if (video.seekable && video.seekable.length > 0) {
          const seekableStart = video.seekable.start(0);
          const seekableEnd = video.seekable.end(video.seekable.length - 1);
          const targetTime = Math.max(seekableStart, seekableEnd - 2);
          if (targetTime - video.currentTime > 0.5) {
            video.currentTime = targetTime;
          }
        }
      } catch (seekError) {
        console.warn('[VideoPlayer] Seeking to live edge failed:', seekError);
      }

      video
        .play()
        .then(() => {})
        .catch(err => {
          console.warn('[VideoPlayer] video.play() failed:', err);
          setIsPlaying(false);
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

  // Track buffering/loading state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsWaiting(true);
    const handlePlaying = () => setIsWaiting(false);
    const handleSeeked = () => setIsWaiting(false);
    const handleSeeking = () => setIsWaiting(true);
    const handleLoadStart = () => setIsWaiting(true);
    const handleLoadedData = () => setIsWaiting(false);
    const handleCanPlay = () => setIsWaiting(false);
    const handlePause = () => setIsWaiting(false);

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

  // Load and play HLS (.m3u8) streams
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset playing state to true for autoplay when channel changes
    setIsPlaying(true);
    isPlayingRef.current = true;

    let hls;
    const isHls =
      videoUrl &&
      (videoUrl.endsWith('.m3u8') ||
        videoUrl.includes('.m3u8') ||
        videoUrl.includes('m3u8'));

    setIsWaiting(true);

    if (isHls) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        if (isPlayingRef.current) {
          video.play().catch(() => {
            setIsPlaying(false);
          });
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
              video.play().catch(() => {
                setIsPlaying(false);
              });
            }

            if (hls.levels && hls.levels.length > 0) {
              const options = hls.levels.map((level, index) => {
                const label = level.height
                  ? `${level.height}p`
                  : `Level ${index + 1}`;
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
        video.play().catch(() => {
          setIsPlaying(false);
        });
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

  const changeQuality = option => {
    setQuality(option.label);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = option.index;
    }
    setIsQualityOpen(false);
  };

  const togglePlay = e => {
    if (e) e.stopPropagation();
    setIsPlaying(!isPlaying);
    handleUserActivity();
  };

  const toggleMute = e => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = e => {
    if (e) e.stopPropagation();
    if (!containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    // Check if currently in any fullscreen mode
    const isCurrentlyFS = !!(document.fullscreenElement || document.webkitFullscreenElement || isIOSFullscreen);

    if (!isCurrentlyFS) {
      // --- ENTER FULLSCREEN ---
      const enterFS = () => {
        // Try standard Fullscreen API on container first
        if (container.requestFullscreen) {
          return container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
          return Promise.resolve();
        } else if (video.webkitEnterFullscreen) {
          // iOS Safari fallback: fullscreen on video element
          video.webkitEnterFullscreen();
          return Promise.resolve();
        }
        return Promise.reject(new Error('Fullscreen API not supported'));
      };

      enterFS()
        .then(() => {
          // Lock landscape orientation on mobile for best viewing
          if (screen?.orientation?.lock) {
            screen.orientation.lock('landscape').catch(() => {
              // Orientation lock not supported or not allowed, that's fine
            });
          }
        })
        .catch(err => {
          console.error('Fullscreen error:', err);
        });
    } else {
      // --- EXIT FULLSCREEN ---
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (video.webkitExitFullscreen) {
        video.webkitExitFullscreen();
      }
      // Unlock orientation on exit
      if (screen?.orientation?.unlock) {
        try { screen.orientation.unlock(); } catch (_) {}
      }
    }
  };

  // Double-tap / double-click to toggle fullscreen (YouTube-like)
  const handleDoubleToggle = e => {
    if (e) e.stopPropagation();
    toggleFullScreen(e);
  };

  return (
    <div
      className="flex flex-col w-full scrollbar-none"
      onMouseMove={handleUserActivity}
    >
      {/* Live Badge and Channel Name on top (outside the main video player) */}
      <AnimatePresence initial={false}>
        {!isMobileSticky && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: '0.875rem' }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex items-center gap-2.5 px-4 lg:px-0 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 rounded-md bg-[#E61944] px-1.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </div>
            <h2 className="text-sm sm:text-sm font-bold text-white tracking-wide">
              {channelName}
            </h2>
            {channelCount && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 uppercase tracking-wider shrink-0">
                {channelCount}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        ref={containerRef}
        data-fullscreen={isFullScreen ? "true" : undefined}
        className={`group relative bg-black shadow-2xl scrollbar-none transition-all duration-300 ${
          isFullScreen
            ? 'fixed inset-0 w-screen h-screen rounded-none ring-0 z-[9999]'
            : `aspect-video w-full ring-1 ring-white/10 lg:rounded-2xl ${
                isMobileSticky ? 'rounded-xl shadow-xl' : 'rounded-none'
              }`
        }`}
        onMouseMove={handleUserActivity}
        onClick={handleUserActivity}
        onDoubleClick={handleDoubleToggle}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            alt="Live Stream"
            className="h-full w-full object-contain transition-opacity duration-700 opacity-100"
            playsInline
          />
        </div>

        {/* Buffering/Loading Spinner Overlay */}
        {isWaiting && isPlaying && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#E61944] border-t-transparent" />
            <span className="mt-3 text-xs font-semibold text-white/80 tracking-wider">
              Buffering...
            </span>
          </div>
        )}

        {/* Center Play/Pause Button Overlay */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <AnimatePresence>
            {!isWaiting && (!isPlaying || showControls) && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => {
                  e.stopPropagation();
                  togglePlay(e);
                }}
                className="z-20 flex h-20 w-20 items-center justify-center rounded-full bg-black/5 backdrop-blur-[1px] border border-white/10 text-white hover:bg-black/20 hover:scale-105 transition-all shadow-2xl"
              >
                {isPlaying ? (
                  <Pause size={36} fill="currentColor" />
                ) : (
                  <Play size={36} fill="currentColor" className="ml-1" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showControls && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none"
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
                      {isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} fill="currentColor" />
                      )}
                    </button>

                    <div className="flex items-center gap-2 group/volume">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-[#E61944] hover:scale-105 transition-all cursor-pointer"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
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
                      title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoPlayer;
