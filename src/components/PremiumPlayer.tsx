'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumPlayerProps {
  src: string;
  poster?: string;
}

export default function PremiumPlayer({ src, poster }: PremiumPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Toggle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying(!playing);
    }
  };

  // Update Progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  // Speed
  const handleSpeed = (s: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = s;
      setSpeed(s);
      setShowSpeedMenu(false);
    }
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (playing && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [playing, showControls]);

  return (
    <div 
      className="premium-player-root"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="main-video-element"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        playsInline
      />

      {/* OVERLAY CONTROLS */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="player-ui-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* CENTER PLAY BUTTON (LARGE) */}
            {!playing && (
              <motion.button 
                className="big-play-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </motion.button>
            )}

            {/* BOTTOM BAR */}
            <div className="bottom-controls-bar">
              {/* PROGRESS SLIDER */}
              <div className="seek-container">
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={progress} 
                  onChange={handleSeek}
                  className="custom-seek-bar"
                />
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="controls-row">
                <div className="left-group">
                  <button className="mini-btn" onClick={togglePlay}>
                    {playing ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </div>

                <div className="right-group">
                  {/* SPEED SELECTOR */}
                  <div className="speed-selector-wrap">
                    <button className="speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                      {speed}x
                    </button>
                    <AnimatePresence>
                      {showSpeedMenu && (
                        <motion.div 
                          className="speed-menu"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          {[0.5, 1, 1.5, 2].map(s => (
                            <button key={s} onClick={() => handleSpeed(s)} className={speed === s ? 'active' : ''}>
                              {s}x
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
