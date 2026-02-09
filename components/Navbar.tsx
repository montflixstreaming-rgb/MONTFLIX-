
import React from 'react';
import { translations, Language } from '../translations';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  userAvatar: string | null;
  currentLang: Language;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearchChange, onOpenSettings, userAvatar, currentLang, currentView, onViewChange
}) => {
  const t = translations[currentLang];
  
  const NavLink = ({ view, label }: { view: string, label: string }) => (
    <button 
      onClick={() => onViewChange(view)}
      className={`transition-all duration-300 hover:text-white text-xs sm:text-sm 2xl:text-2xl font-black uppercase tracking-widest ${
        currentView === view ? 'text-white border-b-2 border-[#00D1FF] pb-1' : 'text-gray-500'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="fixed top-0 w-full z-[100] bg-gradient-to-b from-black via-black/80 to-transparent px-4 sm:px-10 md:px-14 2xl:px-24 py-4 sm:py-8 flex items-center justify-between transition-all duration-500 hover:bg-black">
      <div className="flex items-center gap-6 sm:gap-12 md:gap-16">
        <div 
          onClick={() => onViewChange('home')}
          className="text-2xl sm:text-3xl md:text-4xl 2xl:text-7xl font-black tracking-tighter cursor-pointer flex items-center gap-3 select-none"
        >
          <span className="bg-gradient-to-r from-white to-[#00D1FF] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,209,255,0.3)]">MONTFLIX</span>
        </div>
        
        <div className="hidden lg:flex gap-6 md:gap-10 2xl:gap-20">
          <NavLink view="home" label={t.home} />
          <NavLink view="tv" label={t.series} />
          <NavLink view="movies" label={t.movies} />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-8 2xl:gap-16">
        <div className="relative group flex items-center">
          <button className="text-white hover:scale-110 transition-transform p-2 2xl:p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 2xl:h-12 2xl:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="absolute right-0 bg-black/95 border border-white/10 text-white rounded-full px-4 sm:px-12 py-2 text-xs sm:text-sm 2xl:text-2xl focus:outline-none transition-all w-0 group-focus-within:w-48 sm:group-focus-within:w-72 2xl:group-focus-within:w-[30rem] opacity-0 group-focus-within:opacity-100 placeholder:text-gray-600 backdrop-blur-3xl"
          />
        </div>

        <button 
          onClick={onOpenSettings}
          className="relative w-8 h-8 sm:w-12 sm:h-12 2xl:w-24 2xl:h-24 rounded-lg sm:rounded-2xl overflow-hidden flex items-center justify-center transition-all ring-2 ring-white/10 hover:ring-[#00D1FF]/50 active:scale-90"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-[10px] 2xl:text-2xl font-bold">👤</div>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
