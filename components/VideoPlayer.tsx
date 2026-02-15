
import React, { useEffect, useState } from 'react';
import { Movie } from '../services/types';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  onUpdateXP?: (amount: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose, onUpdateXP }) => {
  const providers = [
    { 
      id: 'vidsrc',
      name: 'Alpha', 
      url: `https://vidsrc.me/embed/movie?tmdb=${movie.id}&lang=pt` 
    },
    { 
      id: 'embedsu',
      name: 'Beta', 
      url: `https://embed.su/embed/movie/${movie.id}` 
    }
  ];

  const [activeProviderIndex, setActiveProviderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (onUpdateXP) onUpdateXP(50);
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [onUpdateXP]);

  const handleFallback = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setActiveProviderIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center overflow-hidden animate-in fade-in duration-500">
      
      {/* CONTAINER DO PLAYER - OCUPA TUDO */}
      <div id="player-container" className="relative w-full h-full bg-black">
        
        {isLoading && (
          <div className="absolute inset-0 z-[610] bg-[#050505] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-[#00D1FF]/10 border-t-[#00D1FF] rounded-full animate-spin" />
            <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">Montflix Cinema</p>
          </div>
        )}

        <iframe 
          id="player-montflix"
          src={providers[activeProviderIndex].url}
          className="w-full h-full border-0"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          title={movie.title}
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      </div>

      {/* BOTÃO FECHAR MINIMALISTA (TOPO DIREITO) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[650] w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-white/20 text-white/40 hover:text-white border border-white/5 transition-all backdrop-blur-md group"
        title="Sair do Cinema"
      >
        <span className="text-2xl font-light group-hover:scale-110 transition-transform">✕</span>
      </button>

      {/* CONTROLES DISCRETOS (RODAPÉ DIREITO) */}
      <div className="absolute bottom-6 right-6 z-[650] flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-full px-4 py-2 flex items-center gap-3">
          <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">
            Servidor: <span className="text-[#00D1FF]">{providers[activeProviderIndex].name}</span>
          </p>
          <div className="w-px h-3 bg-white/10" />
          <button 
            onClick={handleFallback}
            className="text-[8px] text-white/60 hover:text-[#00D1FF] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Alternar
          </button>
        </div>
      </div>

      {/* Marca d'água quase invisível */}
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-[0.03] select-none">
        <h3 className="text-white font-black text-2xl tracking-tighter italic">MONTFLIX</h3>
      </div>
    </div>
  );
};

export default VideoPlayer;
