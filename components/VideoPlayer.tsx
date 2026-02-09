
import React, { useEffect, useState, useRef } from 'react';
import { Movie } from '../services/types';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const [showSplash, setShowSplash] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (videoRef.current) {
        setupHighFidelityAudio();
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
        startControlsTimer();
      }
    }, 3500);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const setupHighFidelityAudio = () => {
    if (!videoRef.current || audioContextRef.current) return;
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      const source = ctx.createMediaElementAudioSource(videoRef.current);
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(1.4, ctx.currentTime);
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
    } catch (e) { console.warn("Audio engine fail"); }
  };

  const startControlsTimer = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 4000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const pad = (num: number) => (num < 10 ? '0' + num : num);
    
    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center overflow-hidden cursor-none" onClick={() => { setShowControls(true); startControlsTimer(); }}>
      {showSplash && (
        <div className="absolute inset-0 z-[700] bg-black flex flex-col items-center justify-center animate-out fade-out duration-1000 delay-[2500ms]">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_50px_rgba(0,209,255,0.4)]">MONTFLIX</h1>
        </div>
      )}

      <video 
        ref={videoRef} src={movie.videoUrl} 
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate} onEnded={onClose}
      />

      <div className={`absolute inset-0 z-10 transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute top-0 left-0 w-full p-10 bg-gradient-to-b from-black/80 to-transparent flex justify-between">
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-10 2xl:p-20 space-y-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col gap-2">
              <span className="text-[#00D1FF] text-[10px] font-black uppercase tracking-[0.4em]">Cinema Mastered 4K</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{movie.title}</h2>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                  <div className="text-white font-black text-sm tabular-nums tracking-widest opacity-80">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
               </div>

               <button 
                 onClick={(e) => { e.stopPropagation(); setPlaybackSpeed(playbackSpeed === 2 ? 1 : playbackSpeed + 0.5); if (videoRef.current) videoRef.current.playbackRate = playbackSpeed === 2 ? 1 : playbackSpeed + 0.5; }}
                 className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black text-white hover:bg-white/10 transition-all cursor-pointer"
               >
                 {playbackSpeed}x
               </button>
            </div>
          </div>

          <div ref={progressRef} onClick={(e) => { e.stopPropagation(); handleSeek(e); }} className="relative h-2 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-white to-[#00D1FF] shadow-[0_0_20px_#00D1FF]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
