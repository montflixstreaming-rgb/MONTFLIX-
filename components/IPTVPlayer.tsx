
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'https://esm.sh/hls.js@^1.5.0';
import { IPTVChannel } from '../services/types';

interface IPTVPlayerProps {
  channel: IPTVChannel;
  onClose: () => void;
}

const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ channel, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    const loadVideo = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          manifestLoadingMaxRetry: 10,
          levelLoadingMaxRetry: 10,
          fragLoadingMaxRetry: 10
        });
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => console.log("Auto-play blocked"));
          setIsLoading(false);
          setError(null);
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            hls.recoverMediaError();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = channel.url;
        video.addEventListener('loadedmetadata', () => {
          video.play();
          setIsLoading(false);
        });
      }
    };

    loadVideo();

    return () => {
      if (hls) hls.destroy();
    };
  }, [channel]);

  const toggleZoom = () => setIsZoomed(!isZoomed);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen();
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[700] bg-black flex items-center justify-center animate-in fade-in overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* VIDEO SURFACE COM ZOOM */}
        <video 
          ref={videoRef} 
          className={`w-full h-full transition-all duration-700 ease-in-out ${isZoomed ? 'object-cover scale-110' : 'object-contain'}`}
          autoPlay
          playsInline
        />

        {/* CONTROLES OVERLAY */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-b from-black/80 via-transparent to-black/80">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={channel.logo} className="w-12 h-12 bg-white/10 rounded-xl p-2" alt="" />
              <div>
                <h2 className="text-white font-black text-xl tracking-tighter uppercase">{channel.name}</h2>
                <span className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> SINAL AO VIVO
                </span>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">✕</button>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={toggleZoom}
              className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isZoomed ? 'bg-[#00D1FF] text-black border-[#00D1FF]' : 'bg-black/60 text-white border-white/20'}`}
            >
              {isZoomed ? 'Modo Ajustado' : 'Preencher Tela (Zoom)'}
            </button>
            <button 
              onClick={toggleFullscreen}
              className="px-10 py-4 rounded-2xl bg-black/60 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest"
            >
              Tela Cheia
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4 z-20">
            <div className="w-12 h-12 border-2 border-[#00D1FF]/10 border-t-[#00D1FF] rounded-full animate-spin" />
            <p className="text-[#00D1FF] text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sintonizando Satélite...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPTVPlayer;
