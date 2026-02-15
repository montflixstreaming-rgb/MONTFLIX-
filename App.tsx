
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import SettingsModal from './components/SettingsModal';
import AuthScreen from './components/AuthScreen';
import NotificationToast from './components/NotificationToast';
import VideoPlayer from './components/VideoPlayer';
import IPTVView from './components/IPTVView';
import IPTVPlayer from './components/IPTVPlayer';
import { Security } from './services/security'; 
import { Movie, IPTVChannel } from './services/types';
import { Language } from './translations';
import { tmdbService } from './services/tmdbService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentView, setCurrentView] = useState('home');
  
  const cached = tmdbService.getCachedData();
  const [sections, setSections] = useState(cached || {
    trending: [], popular: [], nowPlaying: [], upcoming: [], topRated: []
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('pt');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [activeChannel, setActiveChannel] = useState<IPTVChannel | null>(null);
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    const savedSessionEnc = localStorage.getItem('montflix_session_secure');
    if (savedSessionEnc) {
      const user = Security.decrypt(savedSessionEnc);
      if (user) setCurrentUser(user);
    }

    const savedListEnc = localStorage.getItem('montflix_mylist_secure');
    const decryptedList = Security.decrypt(savedListEnc);
    setMyList(decryptedList || []);

    const loadContent = async () => {
      try {
        const [trend, pop, playing, up, rated] = await Promise.all([
          tmdbService.getTrending(),
          tmdbService.getPopular(),
          tmdbService.getNowPlaying(),
          tmdbService.getUpcoming(),
          tmdbService.getTopRated()
        ]);
        
        const newSections = {
          trending: trend, popular: pop, nowPlaying: playing, upcoming: up, topRated: rated
        };
        
        setSections(newSections);
        tmdbService.setCacheData(newSections);
      } catch (err) {
        console.error("Erro ao carregar conteúdo inicial", err);
      }
    };
    
    loadContent();
  }, []);

  const toggleFavorite = (movie: Movie) => {
    let newList;
    const exists = myList.find(m => m.id === movie.id);
    if (exists) {
      newList = myList.filter(m => m.id !== movie.id);
      setToastMessage("Removido da lista");
    } else {
      newList = [...myList, movie];
      setToastMessage("Adicionado à sua lista!");
    }
    setMyList(newList);
    localStorage.setItem('montflix_mylist_secure', Security.encrypt(newList));
  };

  const handleLogin = (authData: { email: string; avatar: string | null }) => {
    const user = { id: crypto.randomUUID(), email: authData.email, name: authData.email.split('@')[0], avatar: authData.avatar, xp: 150 };
    setCurrentUser(user);
    localStorage.setItem('montflix_session_secure', Security.encrypt(user));
  };

  if (!currentUser) return <AuthScreen onLogin={handleLogin} onStartPairing={() => {}} />;

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-[#00D1FF] selection:text-black font-sans transition-colors duration-1000 ${currentView === 'iptv' ? 'selection:bg-red-600' : ''}`}>
      <Navbar 
        onSearchChange={setSearchQuery} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        userAvatar={currentUser.avatar} 
        currentLang={language}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentUserEmail={currentUser.email}
      />
      
      <main className="pb-40">
        {currentView === 'iptv' ? (
          <IPTVView />
        ) : searchQuery.length > 0 ? (
          <div className="px-6 md:px-14 lg:px-24 pt-48 animate-in fade-in">
             <MovieRow title={`Resultados para: ${searchQuery}`} movies={[]} onSelect={setActiveMovie} />
          </div>
        ) : (
          <div className="animate-in fade-in">
            <Hero movies={sections.trending.slice(0,5)} onWatchNow={setActiveMovie} currentLang={language} />
            
            <div className="relative z-20 -mt-48 space-y-32">
              {myList.length > 0 && (
                <MovieRow title="⭐ Sua Lista" movies={myList} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} isFavoriteList={true} />
              )}
              
              <MovieRow title="🔥 Filmes em Alta" movies={sections.trending} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} favorites={myList} />
              <MovieRow title="🎬 Mais Populares" movies={sections.popular} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} favorites={myList} />
              <MovieRow title="🍿 Agora no Cinema" movies={sections.nowPlaying} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} favorites={myList} />
            </div>
          </div>
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={currentUser} 
        onUpdateAvatar={() => {}} 
        onLogout={() => { localStorage.removeItem('montflix_session_secure'); setCurrentUser(null); }} 
        currentLang={language} setLanguage={setLanguage} onShowToast={setToastMessage}
      />
      
      {activeMovie && <VideoPlayer movie={activeMovie} onClose={() => setActiveMovie(null)} />}
      {activeChannel && <IPTVPlayer channel={activeChannel} onClose={() => setActiveChannel(null)} />}
      
      {toastMessage && <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
