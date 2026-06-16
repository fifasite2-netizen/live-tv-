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
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to seek to the live edge of stream
const seekToLiveEdge = (video, hls) => {
  try {
    if (hls && hls.liveSyncPosition !== null && !isNaN(hls.liveSyncPosition)) {
      if (hls.liveSyncPosition - video.currentTime > 0.5) {
        video.currentTime = hls.liveSyncPosition;
      }
      return;
    }
    if (video.seekable && video.seekable.length > 0) {
      const end = video.seekable.end(video.seekable.length - 1);
      const start = video.seekable.start(0);
      const target = Math.max(start, end - 2);
      if (target - video.currentTime > 0.5) {
        video.currentTime = target;
      }
    }
  } catch (err) {
    console.warn('[VideoPlayer] Live-edge seek failed:', err);
  }
};

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
  const [qualityOptions, setQualityOptions] = useState([{ index: -1, label: 'Auto' }]);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isIOSFullscreen, setIsIOSFullscreen] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const hlsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const retryCountRef = useRef(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Handle User Activity (shows controls and auto-hides after 3 seconds)
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  // Reset controls visibility when channel changes
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

  // Fullscreen state listeners
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullScreen(isFS);

      if (!isFS && screen?.orientation?.unlock) {
        try { screen.orientation.unlock(); } catch (_) {}
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

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

  // Synchronize play/pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || error) return;

    const hasSource = video.src || hlsRef.current;
    if (!hasSource) return;

    if (isPlaying) {
      if (hlsRef.current) {
        hlsRef.current.startLoad();
      }
      seekToLiveEdge(video, hlsRef.current);
      video.play().catch(err => {
        console.warn('[VideoPlayer] Play failed:', err);
        // Do not crash/toggle play state on native decoder block
        if (err.name !== 'NotSupportedError') {
          setIsPlaying(false);
        }
      });
    } else {
      video.pause();
    }
  }, [isPlaying, error]);

  // Synchronize volume and mute states
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.volume = volume / 100;
    }
  }, [isMuted, volume]);

  // Monitor video events (buffering, error handling)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const showSpinner = () => setIsWaiting(true);
    const hideSpinner = () => setIsWaiting(false);

    const handleNativeError = () => {
      const err = video.error;
      console.warn('[VideoPlayer] Native video error:', err);
      if (err) {
        let msg = 'The stream could not be loaded. It may be offline or blocked by CORS.';
        if (err.code === 4) {
          msg = 'Format not supported or stream offline. Access blocked.';
        }
        setError(msg);
        setIsWaiting(false);
      }
    };

    video.addEventListener('waiting', showSpinner);
    video.addEventListener('seeking', showSpinner);
    video.addEventListener('loadstart', showSpinner);

    video.addEventListener('playing', hideSpinner);
    video.addEventListener('seeked', hideSpinner);
    video.addEventListener('loadeddata', hideSpinner);
    video.addEventListener('canplay', hideSpinner);
    video.addEventListener('pause', hideSpinner);
    video.addEventListener('error', handleNativeError);

    return () => {
      video.removeEventListener('waiting', showSpinner);
      video.removeEventListener('seeking', showSpinner);
      video.removeEventListener('loadstart', showSpinner);
      
      video.removeEventListener('playing', hideSpinner);
      video.removeEventListener('seeked', hideSpinner);
      video.removeEventListener('loadeddata', hideSpinner);
      video.removeEventListener('canplay', hideSpinner);
      video.removeEventListener('pause', hideSpinner);
      video.removeEventListener('error', handleNativeError);
    };
  }, [videoUrl]);

  // Load and play live stream (HLS or direct sources)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsWaiting(true);
    setError(null);
    retryCountRef.current = 0;

    let hls;
    const isHls = videoUrl && (videoUrl.includes('.m3u8') || videoUrl.includes('m3u8'));

    if (isHls) {
      // Support native Safari HLS playback if available
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        video.play().catch(() => setIsPlaying(false));
        setQualityOptions([{ index: -1, label: 'Auto' }]);
        setQuality('Auto');
      } else {
        // Fallback to hls.js
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
              video.play().catch(() => setIsPlaying(false));
            }
            if (hls.levels && hls.levels.length > 0) {
              const options = hls.levels.map((level, index) => ({
                index,
                label: level.height ? `${level.height}p` : `Level ${index + 1}`
              }));
              setQualityOptions([{ index: -1, label: 'Auto' }, ...options]);
              setQuality('Auto');
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case 'networkError':
                  if (retryCountRef.current < 3) {
                    retryCountRef.current++;
                    console.warn(`[VideoPlayer] HLS network error, retrying... (${retryCountRef.current}/3)`);
                    hls.startLoad();
                  } else {
                    setError('Stream offline or blocked by CORS. Access denied.');
                    setIsWaiting(false);
                    hls.destroy();
                    hlsRef.current = null;
                  }
                  break;
                case 'mediaError':
                  console.warn('[VideoPlayer] HLS media error, recovering...');
                  hls.recoverMediaError();
                  break;
                default:
                  setError('Fatal stream loading error. Check source compatibility.');
                  setIsWaiting(false);
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
      video.play().catch(() => setIsPlaying(false));
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
    if (error) return;
    setIsPlaying(!isPlaying);
    handleUserActivity();
  };

  const toggleMute = e => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = e => {
    if (e) e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const isCurrentlyFS = !!(document.fullscreenElement || document.webkitFullscreenElement || isIOSFullscreen);

    if (!isCurrentlyFS) {
      const enterFS = () => {
        if (container.requestFullscreen) return container.requestFullscreen();
        if (container.webkitRequestFullscreen) { container.webkitRequestFullscreen(); return Promise.resolve(); }
        if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); return Promise.resolve(); }
        return Promise.reject(new Error('Fullscreen not supported'));
      };

      enterFS()
        .then(() => {
          if (screen?.orientation?.lock) {
            screen.orientation.lock('landscape').catch(() => {});
          }
        })
        .catch(err => console.error('[VideoPlayer] Enter fullscreen error:', err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (video.webkitExitFullscreen) video.webkitExitFullscreen();

      if (screen?.orientation?.unlock) {
        try { screen.orientation.unlock(); } catch (_) {}
      }
    }
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setError(null);
    setIsWaiting(true);
    // Trigger videoUrl reload by re-assigning video source
    const video = videoRef.current;
    if (video) {
      const currentUrl = videoUrl;
      // Temporarily clear src to re-trigger load sequence
      video.src = '';
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setTimeout(() => {
        // Trigger useEffect reload by forcing load sequence re-execution
        setError(null);
        setIsPlaying(true);
      }, 50);
    }
  };

  return (
    <div className="flex flex-col w-full scrollbar-none" onMouseMove={handleUserActivity}>
      {/* Live Badge and Channel Title */}
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
            <h2 className="text-sm font-bold text-white tracking-wide">{channelName}</h2>
            {channelCount && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 uppercase tracking-wider shrink-0">
                {channelCount}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Player Area */}
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
        onDoubleClick={toggleFullScreen}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            alt="Live Stream"
            className="h-full w-full object-contain opacity-100"
            playsInline
          />
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-6 text-center select-none">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-3 animate-bounce" />
            <span className="text-red-500 font-extrabold text-xs uppercase tracking-wider mb-1">STREAM OFFLINE / CORS BLOCKED</span>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-[#E61944] hover:bg-[#E61944]/80 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-[#E61944]/20"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Buffering Overlay */}
        {isWaiting && isPlaying && !error && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#E61944] border-t-transparent" />
            <span className="mt-3 text-xs font-semibold text-white/80 tracking-wider">Buffering...</span>
          </div>
        )}

        {/* Center Pause/Play Button */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <AnimatePresence>
            {!isWaiting && (!isPlaying || showControls) && !error && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={togglePlay}
                className="z-20 flex h-20 w-20 items-center justify-center rounded-full bg-black/5 backdrop-blur-[1px] border border-white/10 text-white hover:bg-black/20 hover:scale-105 transition-all shadow-2xl cursor-pointer"
              >
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Bar */}
        <AnimatePresence>
          {showControls && !error && (
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
                    <button onClick={togglePlay} className="text-white hover:text-[#E61944] hover:scale-105 transition-all cursor-pointer">
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>

                    <div className="flex items-center gap-2 group/volume">
                      <button onClick={toggleMute} className="text-white hover:text-[#E61944] hover:scale-105 transition-all cursor-pointer">
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
                        onClick={e => { e.stopPropagation(); setIsQualityOpen(!isQualityOpen); }}
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
                              onClick={e => { e.stopPropagation(); changeQuality(opt); }}
                              className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                                quality === opt.label ? 'bg-[#E61944] text-white' : 'text-white/60 hover:bg-white/10'
                              }`}
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
