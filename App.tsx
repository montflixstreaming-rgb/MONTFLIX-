import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import SettingsModal from './components/SettingsModal';
import AuthScreen from './components/AuthScreen';
import NotificationToast from './components/NotificationToast';
import VideoPlayer from './components/VideoPlayer';
import MovieCard from './components/MovieCard';
import DatabaseView from './components/DatabaseView';
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
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [dbUsers, setDbUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('pt');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    const savedSession = localStorage.getItem('montflix_current_session');
    const savedList = localStorage.getItem('montflix_mylist');
    const savedDatabase = localStorage.getItem('MONTFLIX_CORE_DATABASE');
    
    if (savedSession) {
      try { setCurrentUser(JSON.parse(savedSession)); } catch (e) { localStorage.removeItem('montflix_current_session'); }
    }
    if (savedList) {
      try { setMyList(JSON.parse(savedList)); } catch (e) { setMyList([]); }
    }
    if (savedDatabase) {
      try { setDbUsers(JSON.parse(savedDatabase)); } catch (e) { setDbUsers([]); }
    }
  }, []);

  const handleLogin = (authData: { email: string; avatar: string | null }) => {
    const name = authData.email.split('@')[0].charAt(0).toUpperCase() + authData.email.split('@')[0].slice(1);
    const now = new Date().toLocaleString('pt-BR');
    
    setDbUsers(prev => {
      const existingUser = prev.find(u => u.email === authData.email);
      let updatedList: UserRecord[];

      if (existingUser) {
        const updatedUser = { ...existingUser, lastLogin: now };
        updatedList = prev.map(u => u.email === authData.email ? updatedUser : u);
        setCurrentUser(updatedUser);
        localStorage.setItem('montflix_current_session', JSON.stringify(updatedUser));
      } else {
        const newUser: UserRecord = {
          id: crypto.randomUUID(),
          email: authData.email,
          name: name,
          avatar: authData.avatar,
          createdAt: now,
          lastLogin: now
        };
        updatedList = [newUser, ...prev];
        setCurrentUser(newUser);
        localStorage.setItem('montflix_current_session', JSON.stringify(newUser));
      }

      localStorage.setItem('MONTFLIX_CORE_DATABASE', JSON.stringify(updatedList));
      return updatedList;
    });

    setToastMessage(`Sessão iniciada como ${name}`);
  };

  const exportUserData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbUsers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `montflix_users_backup_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setToastMessage("Backup do banco de dados concluído!");
  };

  const filteredMovies = useMemo(() => {
    if (!searchQuery) return MOCK_MOVIES;
    return MOCK_MOVIES.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
      />
      
      <main className="pb-24">
        {currentView === 'home' && !searchQuery ? (
          <div className="animate-in">
            <Hero movies={MOCK_MOVIES.slice(0, 5)} onWatchNow={setActiveMovie} currentLang={language} />
            <div className="relative z-20 -mt-24 space-y-16">
              {myList.length > 0 && <MovieRow title="Minha Lista" movies={myList} onSelect={setActiveMovie} onToggleFavorite={(m) => setMyList(prev => prev.filter(x => x.id !== m.id))} isFavoriteList />}
              <MovieRow title="Destaques Gratuitos" movies={MOCK_MOVIES} onSelect={setActiveMovie} favorites={myList} />
              <MovieRow title="Exclusivos" movies={[...MOCK_MOVIES].reverse()} onSelect={setActiveMovie} favorites={myList} />
            </div>
          </div>
        ) : currentView === 'database' ? (
          <DatabaseView users={dbUsers} onExport={exportUserData} currentUserEmail={currentUser.email} />
        ) : (
          <div className="px-6 md:px-14 lg:px-24 pt-32 animate-in">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-l-4 border-[#00D1FF] pl-6">Resultados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredMovies.map(m => (
                <MovieCard key={m.id} movie={m} onSelect={setActiveMovie} onToggleFavorite={() => {}} isFavorite={false} />
              ))}
            </div>
          </div>
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={currentUser} 
        allUsers={dbUsers}
        onExportData={exportUserData}
        onLogout={() => { localStorage.removeItem('montflix_current_session'); setCurrentUser(null); }} 
        onUpdateAvatar={(img) => {
          const updated = {...currentUser, avatar: img};
          setCurrentUser(updated);
          localStorage.setItem('montflix_current_session', JSON.stringify(updated));
        }}
        currentLang={language} 
        setLanguage={setLanguage} 
        onShowToast={setToastMessage}
        devices={[]} onAddDevice={() => {}} onRemoveDevice={() => {}} activePairingCode={null} onGeneratePairingCode={() => ""}
      />
      
      {activeMovie && <VideoPlayer movie={activeMovie} onClose={() => setActiveMovie(null)} />}
      {toastMessage && <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;