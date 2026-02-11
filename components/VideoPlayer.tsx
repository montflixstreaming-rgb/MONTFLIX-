
import React, { useEffect, useState, useRef } from 'react';
import { Movie } from '../services/types';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  isPartyMode?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose, isPartyMode = false }) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    startControlsTimer();

    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [movie.videoUrl]);

  const startControlsTimer = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWatchTogether = async () => {
    // Usamos origin fixo para garantir que o link seja sempre https://montflix.netlify.app/
    const baseUrl = "https://montflix.netlify.app";
    const shareUrl = `${baseUrl}/?watch=${movie.id}`;
    
    // O segredo está nas quebras de linha (\n) para o link não "grudar" no texto
    const shareText = `🎬 Assistir Comigo: ${movie.title}\n\n🍿 Vamos ver esse filme juntos agora na MONTFLIX?\n\nLink da sessão:\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `MONTFLIX: ${movie.title}`,
          text: shareText,
          // Não passamos a URL separada aqui para alguns navegadores não duplicarem, 
          // colocamos direto no texto com quebra de linha.
        });
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center overflow-hidden select-none" 
         onMouseMove={() => { setShowControls(true); startControlsTimer(); }}
         onClick={() => { setShowControls(true); startControlsTimer(); }}>
      
      {isBuffering && (
        <div className="absolute z-[650] flex flex-col items-center gap-4 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#00D1FF] rounded-full animate-spin" />
        </div>
      )}

      {showShareToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[700] bg-[#00D1FF] text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(0,209,255,0.5)] animate-in slide-in-from-top-4">
          Link copiado! Compartilhe com amigos.
        </div>
      )}

      <video 
        ref={videoRef} 
        src={movie.videoUrl} 
        className="w-full h-full object-contain bg-black"
        autoPlay
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onLoadedMetadata={handleTimeUpdate}
        onTimeUpdate={handleTimeUpdate} 
      />

      <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="absolute top-0 left-0 w-full p-6 sm:p-10 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-start">
          <button 
            onClick={onClose} 
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00D1FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Fechar</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleWatchTogether(); }}
            className="group flex items-center gap-3 bg-[#00D1FF] hover:bg-[#00D1FF]/80 px-6 py-3 rounded-2xl border border-[#00D1FF]/50 shadow-[0_0_20px_rgba(0,209,255,0.3)] transition-all active:scale-95"
          >
            <div className="relative">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" />
               </svg>
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black">Assistir Comigo</span>
          </button>
          
          <div className="text-right hidden sm:block">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">{movie.title}</h2>
            {isPartyMode ? (
              <p className="text-green-400 text-[8px] font-black uppercase tracking-widest opacity-80 animate-pulse">Sessão Compartilhada</p>
            ) : (
              <p className="text-[#00D1FF] text-[8px] font-black uppercase tracking-widest opacity-80">Qualidade 4K</p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">{movie.category}</span>
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-lg text-[11px] font-mono font-black text-[#00D1FF]">
              {formatTime(currentTime)} <span className="text-gray-600 mx-1">/</span> {formatTime(duration)}
            </div>
          </div>

          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[#00D1FF] shadow-[0_0_15px_#00D1FF]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
