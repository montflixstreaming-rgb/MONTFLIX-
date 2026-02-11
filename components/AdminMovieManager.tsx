
import React, { useState } from 'react';
import { Movie } from '../services/types';

interface AdminMovieManagerProps {
  movies: Movie[];
  onUpdate: (movies: Movie[]) => void;
  onClose: () => void;
}

const AdminMovieManager: React.FC<AdminMovieManagerProps> = ({ movies, onUpdate, onClose }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    title: '',
    year: 2025,
    category: 'Animação',
    rating: 10,
    description: '',
    videoUrl: '',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1470&auto=format&fit=crop'
  });

  const extractDriveId = (url: string) => {
    // Tenta padrões mais abrangentes para capturar o ID sem erros
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]{25,})/,           
      /id=([a-zA-Z0-9_-]{25,})/,             
      /file\/d\/([a-zA-Z0-9_-]{25,})\/view/,
      /([a-zA-Z0-9_-]{25,})/ // Fallback para se colar só o ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.videoUrl) return;

    let finalUrl = newMovie.videoUrl.trim();
    
    // Processamento especial para Google Drive
    if (finalUrl.includes('drive.google.com') || finalUrl.length > 25) {
      const driveId = extractDriveId(finalUrl);
      if (driveId) {
        // Formato uc?export=download é o mais estável para streaming direto no <video>
        finalUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      }
    }

    const movieToAdd: Movie = {
      ...newMovie as Movie,
      id: `custom-${Date.now()}`,
      videoUrl: finalUrl
    };

    onUpdate([movieToAdd, ...movies]);
    setIsAdding(false);
    setNewMovie({
      title: '',
      year: 2025,
      category: 'Animação',
      rating: 10,
      description: '',
      videoUrl: '',
      posterUrl: newMovie.posterUrl,
      backdropUrl: newMovie.backdropUrl
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este filme permanentemente do banco de dados?')) {
      onUpdate(movies.filter(m => m.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black flex flex-col">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#00D1FF]">Gestor de Cinema</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Banco de Dados Ativo</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00D1FF] transition-all"
          >
            {isAdding ? 'Cancelar' : '+ Novo Filme'}
          </button>
          <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">✕</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {isAdding ? (
          <div className="max-w-2xl mx-auto bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 animate-in slide-in-from-bottom-4 shadow-2xl">
            <h3 className="text-xl font-black uppercase mb-8 border-b border-white/5 pb-4">Cadastrar no Banco</h3>
            <form onSubmit={handleAddMovie} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Nome do Filme</label>
                  <input required value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Ano Lançamento</label>
                  <input type="number" value={newMovie.year} onChange={e => setNewMovie({...newMovie, year: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Link do Filme (Google Drive)</label>
                <input required value={newMovie.videoUrl} onChange={e => setNewMovie({...newMovie, videoUrl: e.target.value})} placeholder="Cole o link ou ID aqui..." className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Sinopse Curta</label>
                <textarea rows={2} value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Categoria</label>
                  <select value={newMovie.category} onChange={e => setNewMovie({...newMovie, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none">
                    <option>Ação</option><option>Animação</option><option>Drama</option><option>Terror</option><option>Sci-Fi</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Nota</label>
                  <input type="number" step="0.1" value={newMovie.rating} onChange={e => setNewMovie({...newMovie, rating: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-6 bg-[#00D1FF] text-black font-black uppercase tracking-widest rounded-3xl hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-[#00D1FF]/20">Salvar e Liberar</button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map(movie => (
              <div key={movie.id} className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-[#00D1FF]/30 transition-all flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <img src={movie.backdropUrl || movie.posterUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt="" />
                  <div className="absolute top-4 right-4">
                    <button onClick={() => handleDelete(movie.id)} className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black uppercase tracking-tighter mb-1">{movie.title}</h4>
                  <p className="text-gray-600 text-[8px] font-mono break-all">{movie.videoUrl}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovieManager;
