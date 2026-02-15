
import React from 'react';
import { IPTVChannel } from '../services/types';

interface ChannelCardProps {
  channel: IPTVChannel;
  onSelect: (channel: IPTVChannel) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onSelect }) => (
  <div 
    onClick={() => onSelect(channel)}
    className="group relative cursor-pointer min-w-[120px] sm:min-w-[150px] md:min-w-[180px]"
  >
    <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 group-hover:border-[#00D1FF]/50 transition-all duration-500 group-hover:scale-105 flex items-center justify-center p-4 overflow-hidden shadow-2xl">
      <img 
        src={channel.logo} 
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
        alt={channel.name} 
      />
      
      {/* Overlay de Brilho */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Selo Ao Vivo */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
        <span className="text-[7px] font-black uppercase tracking-widest text-white">Live</span>
      </div>
    </div>
    
    <div className="mt-3 text-center">
      <h3 className="text-[10px] font-black uppercase tracking-tighter line-clamp-1 group-hover:text-[#00D1FF] transition-colors">
        {channel.name}
      </h3>
      <p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest mt-1">
        {channel.group}
      </p>
    </div>
  </div>
);

export default ChannelCard;
