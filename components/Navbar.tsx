
import React from 'react';
import { Language } from '../translations';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  userAvatar: string | null;
  currentLang: Language;
  currentView: string;
  onViewChange: (view: string) => void;
  currentUserEmail: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSettings, userAvatar, currentView, onViewChange
}) => {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-3xl border-b border-white/5 px-6 md:px-20 py-8 flex items-center justify-between">
      {/* LOGO GIGANTE MASTER NEON */}
      <div 
        onClick={() => onViewChange('home')}
        className="cursor-pointer select-none group flex items-center gap-6"
      >
        <span className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all">
          MONT<span className="text-[#00D1FF] drop-shadow-[0_0_30px_#00D1FF]">FLIX</span>
        </span>
      </div>

      {/* NAVEGAÇÃO SLIM PROFISSIONAL */}
      <div className="flex items-center gap-8 md:gap-16 bg-white/5 border border-white/10 px-8 py-3 rounded-full">
        <button 
          onClick={() => onViewChange('home')}
          className="relative group outline-none"
        >
          <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] transition-all duration-300 ${
            currentView === 'home' || currentView === 'movies'
              ? 'text-white' 
              : 'text-white/20 hover:text-white/60'
          }`}>
            Filmes
          </span>
          {(currentView === 'home' || currentView === 'movies') && (
            <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#00D1FF] shadow-[0_0_15px_#00D1FF] rounded-full" />
          )}
        </button>

        <button 
          onClick={() => onViewChange('iptv')}
          className="relative group outline-none"
        >
          <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] transition-all duration-300 ${
            currentView === 'iptv' 
              ? 'text-white' 
              : 'text-white/20 hover:text-white/60'
          }`}>
            Ao Vivo
          </span>
          {currentView === 'iptv' && (
            <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#00D1FF] shadow-[0_0_15px_#00D1FF] rounded-full" />
          )}
        </button>
      </div>

      {/* PERFIL DESIGNER */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onOpenSettings}
          className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] overflow-hidden border border-white/10 hover:border-[#00D1FF]/50 transition-all active:scale-95 bg-zinc-900 shadow-2xl group"
        >
          {userAvatar ? (
            <img src={userAvatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="User" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
