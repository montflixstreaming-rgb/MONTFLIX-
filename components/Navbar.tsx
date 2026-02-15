
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
    <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-2xl border-b border-white/5 px-6 md:px-16 py-6 flex items-center justify-between">
      {/* LOGO GIGANTE NEON - BRANCO E AZUL */}
      <div 
        onClick={() => onViewChange('home')}
        className="cursor-pointer select-none group flex items-center gap-3"
      >
        <div className="w-2 h-12 bg-[#00D1FF] rounded-full shadow-[0_0_20px_#00D1FF] group-hover:shadow-[0_0_30px_#00D1FF] transition-all duration-500" />
        <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all">
          MONT<span className="text-[#00D1FF] drop-shadow-[0_0_25px_rgba(0,209,255,0.9)]">FLIX</span>
        </span>
      </div>

      {/* NAVEGAÇÃO SLIM PROFISSIONAL - BOTÕES PEQUENOS */}
      <div className="flex items-center gap-8 md:gap-14">
        <button 
          onClick={() => onViewChange('home')}
          className="relative px-1 py-1 group outline-none"
        >
          <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-500 ${
            currentView === 'home' || currentView === 'movies'
              ? 'text-white' 
              : 'text-white/20 hover:text-white/50'
          }`}>
            Filmes
          </span>
          {(currentView === 'home' || currentView === 'movies') && (
            <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-[#00D1FF] shadow-[0_0_15px_#00D1FF] animate-in slide-in-from-left-2" />
          )}
        </button>

        <button 
          onClick={() => onViewChange('iptv')}
          className="relative px-1 py-1 group outline-none"
        >
          <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-500 ${
            currentView === 'iptv' 
              ? 'text-white' 
              : 'text-white/20 hover:text-white/50'
          }`}>
            Ao Vivo
          </span>
          {currentView === 'iptv' && (
            <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_15px_red] animate-in slide-in-from-right-2" />
          )}
        </button>
      </div>

      {/* PERFIL DESIGNER */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex flex-col items-end leading-none">
            <span className="text-[9px] font-black text-[#00D1FF] uppercase tracking-[0.2em] mb-1">Status Pro</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Servidor Online</span>
            </div>
        </div>
        <button 
          onClick={onOpenSettings}
          className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 hover:border-[#00D1FF]/50 transition-all active:scale-95 bg-zinc-900 group shadow-2xl"
        >
          {userAvatar ? (
            <img src={userAvatar} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt="User" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
