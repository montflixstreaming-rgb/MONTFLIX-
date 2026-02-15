
import React, { useRef } from 'react';
import { Movie } from '../services/types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
  isFavoriteList?: boolean;
  favorites?: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onSelect, onToggleFavorite, isFavoriteList, favorites }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (isFavoriteList && movies.length === 0) return null;
  if (!movies || movies.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="group/row relative">
      <div className="flex items-center justify-between px-6 md:px-14 lg:px-24 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#00D1FF] rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-500" />
          <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter group-hover/row:text-[#00D1FF] transition-all duration-500">
            {title}
          </h2>
        </div>
        <div className="hidden lg:flex gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500">
           <button onClick={() => scroll('left')} className="w-12 h-12 rounded-2xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-white hover:bg-[#00D1FF] hover:text-black transition-all active:scale-90">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <button onClick={() => scroll('right')} className="w-12 h-12 rounded-2xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-white hover:bg-[#00D1FF] hover:text-black transition-all active:scale-90">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        className="flex gap-4 md:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide px-6 md:px-14 lg:px-24 pb-12 scroll-smooth"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[260px] transform-gpu">
            <MovieCard 
              movie={movie} 
              onSelect={onSelect} 
              onToggleFavorite={() => onToggleFavorite?.(movie)}
              isFavorite={isFavoriteList || !!favorites?.find(f => f.id === movie.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
