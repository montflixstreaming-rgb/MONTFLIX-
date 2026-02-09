
import React from 'react';
import { Movie } from '../services/types';

const MovieCard: React.FC<{ movie: Movie, onSelect: (m: Movie) => void, onToggleFavorite: () => void, isFavorite: boolean }> = ({ movie, onSelect, onToggleFavorite, isFavorite }) => (
  <div className="group relative cursor-pointer" onClick={() => onSelect(movie)}>
    <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-[#00D1FF]/50 transition-all duration-500 group-hover:scale-105 shadow-2xl">
      <img src={movie.posterUrl || movie.backdropUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={movie.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
        <h3 className="text-sm font-black uppercase tracking-tighter line-clamp-1">{movie.title}</h3>
        <p className="text-[10px] text-[#00D1FF] font-bold mt-1">4K ULTRA HD</p>
      </div>
    </div>
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
      className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isFavorite ? 'bg-[#00D1FF] border-[#00D1FF] text-black shadow-lg scale-110' : 'bg-black/40 border-white/10 text-white opacity-0 group-hover:opacity-100'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" className={isFavorite ? 'hidden' : 'block'} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" className={isFavorite ? 'block' : 'hidden'} />
      </svg>
    </button>
  </div>
);
export default MovieCard;
