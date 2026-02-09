import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import SettingsModal from './components/SettingsModal';
import AuthScreen from './components/AuthScreen';
import NotificationToast from './components/NotificationToast';
import VideoPlayer from './components/VideoPlayer';
import MovieCard from './components/MovieCard';
import { Movie } from './services/types';
import { Language } from './translations';
import { MOCK_MOVIES } from './constants';

interface User {
  email: string;
  avatar: string | null;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('pt');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('montflix_user');
    const savedList = localStorage.getItem('montflix_mylist');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('montflix_user'); }
    }
    if (savedList) {
      try { setMyList(JSON.parse(savedList)); } catch (e) { setMyList([]); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('montflix_mylist', JSON.stringify(myList));
  }, [myList]);

  const toggleFavorite = (movie: Movie) => {
    setMyList(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) {
        setToastMessage(`${movie.title} removido da lista`);
        return prev.filter(m => m.id !== movie.id);
      }
      setToastMessage(`${movie.title} salvo na sua lista`);
      return [movie, ...prev];
    });
  };

  const handleLogin = (userData: { email: string; avatar: string | null }) => {
    setUser(userData);
    localStorage.setItem('montflix_user', JSON.stringify(userData));
    setToastMessage(`Bem-vindo à MONTFLIX!`);
  };

  const filteredMovies = useMemo(() => {
    if (!searchQuery) return MOCK_MOVIES;
    return MOCK_MOVIES.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (!user) return <AuthScreen onLogin={handleLogin} onStartPairing={() => {}} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00D1FF] selection:text-black">
      <Navbar 
        onSearchChange={setSearchQuery} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        userAvatar={user.avatar} 
        currentLang={language}
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      
      <main className="pb-24">
        {currentView === 'home' && !searchQuery ? (
          <div className="animate-in">
            <Hero movies={MOCK_MOVIES.slice(0, 5)} onWatchNow={setActiveMovie} currentLang={language} />
            <div className="relative z-20 -mt-24 space-y-16">
              {myList.length > 0 && <MovieRow title="Minha Lista" movies={myList} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} isFavoriteList />}
              <MovieRow title="Destaques Gratuitos" movies={MOCK_MOVIES} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} favorites={myList} />
              <MovieRow title="Exclusivos MONTFLIX" movies={[...MOCK_MOVIES].reverse()} onSelect={setActiveMovie} onToggleFavorite={toggleFavorite} favorites={myList} />
            </div>
          </div>
        ) : (
          <div className="px-6 md:px-14 lg:px-24 pt-32 animate-in">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-l-4 border-[#00D1FF] pl-6">
              {searchQuery ? `Resultados` : currentView === 'tv' ? 'Séries' : 'Filmes'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredMovies.map(m => (
                <MovieCard key={m.id} movie={m} onSelect={setActiveMovie} onToggleFavorite={() => toggleFavorite(m)} isFavorite={!!myList.find(f => f.id === m.id)} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center opacity-40 text-[10px] uppercase font-bold tracking-[0.3em]">
        © 2026 MONTFLIX PRODUCTION • CINEMA GRATUITO
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user} 
        onUpdateAvatar={(img) => setUser({...user, avatar: img})} 
        onLogout={() => { localStorage.removeItem('montflix_user'); setUser(null); }} 
        onShowToast={setToastMessage} 
        currentLang={language} 
        setLanguage={setLanguage} 
        devices={[]} 
        onAddDevice={() => {}} 
        onRemoveDevice={() => {}} 
        activePairingCode={null} 
        onGeneratePairingCode={() => ""}
      />
      
      {activeMovie && <VideoPlayer movie={activeMovie} onClose={() => setActiveMovie(null)} />}
      {toastMessage && <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;