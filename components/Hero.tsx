
import React, { useState, useEffect } from 'react';
import { Movie } from '../services/types';

const Hero: React.FC<{ movies: Movie[], onWatchNow: (m: Movie) => void, currentLang: string }> = ({ movies, onWatchNow }) => {
  const [index, setIndex] = useState(0);
  const movie = movies[index];

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % movies.length), 10000);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movie) return null;

  return (
    <div className="relative h-[85vh] w-full flex items-center px-6 md:px-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={movie.backdropUrl} className="w-full h-full object-cover opacity-50 transition-all duration-1000 scale-105" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl space-y-8 animate-in slide-in-from-left duration-1000">
        <div className="inline-block bg-[#00D1FF] text-black text-[10px] font-black px-3 py-1 rounded tracking-widest uppercase shadow-lg">Original Montflix</div>
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">{movie.title}</h1>
        <p className="text-white/60 text-lg md:text-2xl max-w-2xl line-clamp-3 font-medium">{movie.description}</p>
        <div className="flex gap-4">
          <button onClick={() => onWatchNow(movie)} className="bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-[#00D1FF] transition-all transform active:scale-95 text-lg uppercase tracking-tighter flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
             Assistir
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hero;
