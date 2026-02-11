
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

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  lastLogin: string;
  xp: number;
}

const USER_DB_KEY = 'MONTFLIX_CORE_DATABASE';
const MOVIE_DB_KEY = 'MONTFLIX_MOVIE_DATABASE';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('pt');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [myList, setMyList] = useState<Movie[]>([]);
  const [isPartyMode, setIsPartyMode] = useState(false);
  
  // Captura e sanitiza o ID da URL imediatamente
  const [pendingWatchId, setPendingWatchId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get('watch');
    // Limpa espaços ou quebras de linha que possam ter vindo no link
    return rawId ? rawId.trim().split(/\s+/)[0] : null;
  });

  useEffect(() => {
    const savedSession = localStorage.getItem('montflix_current_session');
    const savedList = localStorage.getItem('montflix_mylist');
    const savedMovies = localStorage.getItem(MOVIE_DB_KEY);
    
    let loadedMovies = MOCK_MOVIES;
    if (savedMovies) {
      try { 
        const parsed = JSON.parse(savedMovies);
        loadedMovies = Array.isArray(parsed) ? parsed : MOCK_MOVIES;
      } catch (e) { loadedMovies = MOCK_MOVIES; }
    }
    setMovies(loadedMovies);

    if (savedSession) {
      try { setCurrentUser(JSON.parse(savedSession)); } catch (e) { localStorage.removeItem('montflix_current_session'); }
    }
    if (savedList) {
      try { setMyList(JSON.parse(savedList)); } catch (e) { setMyList([]); }
    }
  }, []);

  // Lógica de "Deep Linking" para abrir o filme
  useEffect(() => {
    if (movies.length > 0 && currentUser && pendingWatchId) {
      // Tenta encontrar o filme exato ou o que começa com aquele ID (caso o link esteja sujo)
      const targetMovie = movies.find(m => m.id === pendingWatchId || pendingWatchId.startsWith(m.id));
      
      if (targetMovie) {
        const timer = setTimeout(() => {
          setActiveMovie(targetMovie);
          setIsPartyMode(true);
          setToastMessage(`🍿 Iniciando sessão de: ${targetMovie.title}`);
          setPendingWatchId(null);
          
          // Limpa a URL para ficar bonita: https://montflix.netlify.app/
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }, 600);
        return () => clearTimeout(timer);
      } else {
        setPendingWatchId(null);
      }
    }
  }, [movies, currentUser, pendingWatchId]);

  const handleLogin = (authData: { email: string; avatar: string | null }) => {
    const name = authData.email.split('@')[0].charAt(0).toUpperCase() + authData.email.split('@')[0].slice(1);
    const now = new Date().toLocaleString('pt-BR');
    const savedUsers = localStorage.getItem(USER_DB_KEY);
    let users: UserRecord[] = savedUsers ? JSON.parse(savedUsers) : [];
    const existingUser = users.find(u => u.email === authData.email);
    let updatedUser: UserRecord;

    if (existingUser) {
      updatedUser = { ...existingUser, lastLogin: now, xp: (existingUser.xp || 150) + 5 }; 
      users = users.map(u => u.email === authData.email ? updatedUser : u);
    } else {
      updatedUser = {
        id: crypto.randomUUID(),
        email: authData.email,
        name: name,
        avatar: authData.avatar,
        createdAt: now,
        lastLogin: now,
        xp: 150 
      };
      users = [updatedUser, ...users];
    }

    setCurrentUser(updatedUser);
    localStorage.setItem('montflix_current_session', JSON.stringify(updatedUser));
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
  };

  const filteredMovies = useMemo(() => {
    if (!searchQuery) return movies;
    const query = searchQuery.toLowerCase();
    return movies.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.category.toLowerCase().includes(query)
    );
  }, [searchQuery, movies]);

  if (!currentUser) return <AuthScreen onLogin={handleLogin} onStartPairing={() => {}} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00D1FF] selection:text-black">
      <Navbar 
        onSearchChange={setSearchQuery} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        userAvatar={currentUser.avatar} 
        currentLang={language}
        currentView={currentView} 
        onViewChange={setCurrentView}
        currentUserEmail={currentUser.email}
      />
      
      <main className="pb-24">
        {currentView === 'home' && !searchQuery ? (
          <div className="animate-in">
            <Hero movies={movies.slice(0, 5)} onWatchNow={(m) => {
              setActiveMovie(m);
              setIsPartyMode(false);
            }} currentLang={language} />
            <div className="relative z-20 -mt-24 space-y-16">
              {myList.length > 0 && (
                <MovieRow 
                  title="Minha Lista" 
                  movies={myList} 
                  onSelect={(m) => { setActiveMovie(m); setIsPartyMode(false); }} 
                  onToggleFavorite={(m) => setMyList(prev => prev.filter(x => x.id !== m.id))} 
                  isFavoriteList 
                />
              )}
              <MovieRow title="Destaques Recomendados" movies={movies} onSelect={(m) => { setActiveMovie(m); setIsPartyMode(false); }} favorites={myList} />
              <MovieRow title="Mais Vistos da Semana" movies={[...movies].reverse()} onSelect={(m) => { setActiveMovie(m); setIsPartyMode(false); }} favorites={myList} />
            </div>
          </div>
        ) : (
          <div className="px-6 md:px-14 lg:px-24 pt-32 animate-in">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-l-4 border-[#00D1FF] pl-6">Catálogo</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredMovies.map(m => (
                <MovieCard key={m.id} movie={m} onSelect={(mov) => { setActiveMovie(mov); setIsPartyMode(false); }} onToggleFavorite={() => {}} isFavorite={false} />
              ))}
            </div>
          </div>
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={currentUser} 
        onLogout={() => { localStorage.removeItem('montflix_current_session'); setCurrentUser(null); }} 
        onUpdateAvatar={(img) => {
          const updated = {...currentUser, avatar: img};
          setCurrentUser(updated);
          localStorage.setItem('montflix_current_session', JSON.stringify(updated));
        }}
        currentLang={language} 
        setLanguage={setLanguage} 
        onShowToast={setToastMessage}
      />
      
      {activeMovie && (
        <VideoPlayer 
          movie={activeMovie} 
          onClose={() => { setActiveMovie(null); setIsPartyMode(false); }} 
          isPartyMode={isPartyMode}
        />
      )}
      {toastMessage && <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
