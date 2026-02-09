
import React, { useRef } from 'react';
import { Movie } from '../services/types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
  isFavoriteList?: boolean;
  // Added favorites prop to track movies added to the user's list in non-favorite rows
  favorites?: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onSelect, onToggleFavorite, isFavoriteList, favorites }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (isFavoriteList && movies.length === 0) return null;
  if (!movies) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="group/row relative">
      <div className="flex items-end justify-between px-6 md:px-14 lg:px-24 mb-6">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-black text-white uppercase tracking-tighter group-hover/row:text-[#00D1FF] transition-colors">
          {title}
        </h2>
        <div className="hidden lg:flex gap-2">
           <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">‹</button>
           <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">›</button>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        className="flex gap-4 lg:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide px-6 md:px-14 lg:px-24 pb-12 scroll-smooth"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[150px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px]">
            <MovieCard 
              movie={movie} 
              onSelect={onSelect} 
              onToggleFavorite={() => onToggleFavorite?.(movie)}
              // A movie is a favorite if we are in the favorites list OR if it's found in the favorites array
              isFavorite={isFavoriteList || !!favorites?.find(f => f.id === movie.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
