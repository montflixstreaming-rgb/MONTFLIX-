
import React, { useState, useEffect } from 'react';
import { Movie } from '../services/types';

const Hero: React.FC<{ movies: Movie[], onWatchNow: (m: Movie) => void, currentLang: string }> = ({ movies, onWatchNow }) => {
  const [index, setIndex] = useState(0);
  const movie = movies[index];

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies]);

  // Se não houver filme ainda, renderiza um fundo escuro elegante em vez de spinner
  if (!movie) return <div className="h-[90vh] w-full bg-black" />;

  return (
    <div className="relative h-[90vh] md:h-screen w-full flex items-center px-6 md:px-14 lg:px-24 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          key={movie.id}
          src={movie.backdropUrl} 
          className="w-full h-full object-cover transition-opacity duration-1000 animate-ken-burns" 
          alt="" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-20" />
      </div>

      <div className="relative z-30 max-w-5xl space-y-6 md:space-y-8 animate-in fade-in duration-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#00D1FF] text-black px-4 py-1.5 rounded-xl shadow-[0_0_30px_rgba(0,209,255,0.4)]">
            <span className="text-[10px] font-black uppercase tracking-widest">Estreia Exclusiva</span>
          </div>
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Cinematics™</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.75] drop-shadow-[0_15px_45px_rgba(0,0,0,0.8)]">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm md:text-lg font-bold text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-[#00D1FF] text-2xl font-black">★</span>
            <span className="tracking-tighter">{movie.rating.toFixed(1)}</span>
          </div>
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <span className="tracking-widest">{movie.year}</span>
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <span className="border border-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">4K ULTRA HD</span>
        </div>

        <p className="text-white/50 text-base md:text-2xl max-w-3xl line-clamp-3 leading-relaxed font-medium">
          {movie.description}
        </p>

        <div className="flex flex-wrap gap-6 pt-10">
          <button 
            onClick={() => onWatchNow(movie)} 
            className="group relative bg-white text-black font-black px-12 md:px-20 py-6 md:py-8 rounded-[2rem] hover:bg-[#00D1FF] transition-all transform active:scale-95 text-xs md:text-2xl uppercase tracking-[0.2em] flex items-center gap-6 overflow-hidden shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-12 md:w-12 fill-black" viewBox="0 0 24 24">
               <path d="M8 5v14l11-7z" />
             </svg>
             Dar o Play
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.05) translate(0,0); }
          100% { transform: scale(1.15) translate(-1%, -1%); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};
export default Hero;
