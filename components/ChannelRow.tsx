
import React, { useRef } from 'react';
import { IPTVChannel } from '../services/types';
import ChannelCard from './ChannelCard';

interface ChannelRowProps {
  title: string;
  channels: IPTVChannel[];
  onSelect: (channel: IPTVChannel) => void;
}

const ChannelRow: React.FC<ChannelRowProps> = ({ title, channels, onSelect }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!channels || channels.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="group/row relative">
      <div className="flex items-center justify-between px-6 md:px-14 lg:px-24 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter group-hover/row:text-red-500 transition-all duration-500">
            {title}
          </h2>
        </div>
        <div className="hidden lg:flex gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500">
           <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-white/5 bg-zinc-900/50 flex items-center justify-center text-white hover:bg-red-600 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-white/5 bg-zinc-900/50 flex items-center justify-center text-white hover:bg-red-600 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide px-6 md:px-14 lg:px-24 pb-8 scroll-smooth"
      >
        {channels.map((channel) => (
          <ChannelCard 
            key={channel.id} 
            channel={channel} 
            onSelect={onSelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelRow;
