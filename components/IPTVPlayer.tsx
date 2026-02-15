
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'https://esm.sh/hls.js@^1.5.0';
import { IPTVChannel } from '../services/types';

interface IPTVPlayerProps {
  channel: IPTVChannel;
  onClose: () => void;
}

const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ channel, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => console.log("Auto-play blocked"));
        setIsLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError("O sinal deste canal está instável no momento.");
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Suporte nativo para Safari/iOS
      video.src = channel.url;
      video.addEventListener('loadedmetadata', () => {
        video.play();
        setIsLoading(false);
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [channel]);

  return (
    <div className="fixed inset-0 z-[700] bg-black flex items-center justify-center animate-in fade-in duration-500">
      
      <div className="relative w-full h-full flex flex-col">
        {/* Top Bar do Player */}
        <div className="absolute top-0 left-0 right-0 p-8 z-[750] flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <img src={channel.logo} className="w-12 h-12 object-contain bg-white/10 rounded-lg p-1" alt="" />
            <div>
              <h2 className="text-white font-black text-xl uppercase tracking-tighter">{channel.name}</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">Ao Vivo • {channel.group}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-md">✕</button>
        </div>

        {/* Video Surface */}
        <video 
          ref={videoRef} 
          className="w-full h-full object-contain" 
          controls={!isLoading && !error}
          autoPlay
          playsInline
        />

        {/* Loading / Error Overlays */}
        {(isLoading || error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]">
            {error ? (
              <div className="text-center space-y-4 max-w-sm px-6">
                <span className="text-4xl">⚠️</span>
                <p className="text-white font-black uppercase text-xs tracking-widest">{error}</p>
                <button onClick={onClose} className="text-[#00D1FF] text-[10px] font-black uppercase border border-[#00D1FF]/20 px-6 py-2 rounded-full">Tentar Outro Canal</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#00D1FF]/20 border-t-[#00D1FF] rounded-full animate-spin" />
                <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">Conectando ao Satélite</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Marca D'água */}
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none select-none">
        <span className="text-white font-black italic text-2xl">MONTFLIX LIVE</span>
      </div>
    </div>
  );
};

export default IPTVPlayer;
