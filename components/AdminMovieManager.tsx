
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
    category: 'Ação',
    rating: 10,
    description: '',
    videoUrl: '',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1470&auto=format&fit=crop'
  });

  const processVideoUrl = (url: string) => {
    const trimmed = url.trim();
    
    // Suporte para Google Drive
    if (trimmed.includes('drive.google.com')) {
      const driveId = trimmed.match(/\/d\/([a-zA-Z0-9_-]{25,})/)?.[1];
      if (driveId) return `https://drive.google.com/uc?export=download&id=${driveId}`;
    }

    // Suporte para CineGato (Detecta se o usuário colou o link do player)
    if (trimmed.includes('cinegato')) {
      // Se for um link de página, tenta converter para o formato embed se possível
      // Aqui assumimos que se o link contém 'cinegato', o player do CineGato aceita ser rodado em iframe.
      return trimmed;
    }

    return trimmed;
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.videoUrl) return;

    const movieToAdd: Movie = {
      ...newMovie as Movie,
      id: `m-${Date.now()}`,
      videoUrl: processVideoUrl(newMovie.videoUrl || '')
    };

    onUpdate([movieToAdd, ...movies]);
    setIsAdding(false);
    setNewMovie({
      title: '', year: 2025, category: 'Ação', rating: 10, description: '', videoUrl: '',
      posterUrl: newMovie.posterUrl, backdropUrl: newMovie.backdropUrl
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este filme do catálogo?')) {
      onUpdate(movies.filter(m => m.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black flex flex-col">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#00D1FF]">Curadoria MONTFLIX</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Adicione filmes do Drive, CineGato ou links diretos</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsAdding(!isAdding)} className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00D1FF] transition-all">
            {isAdding ? 'Voltar' : '+ Adicionar Filme'}
          </button>
          <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">✕</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {isAdding ? (
          <div className="max-w-2xl mx-auto bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 animate-in slide-in-from-bottom-4 shadow-2xl">
            <form onSubmit={handleAddMovie} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Link do CineGato ou Servidor</label>
                  <input required value={newMovie.videoUrl} onChange={e => setNewMovie({...newMovie, videoUrl: e.target.value})} placeholder="Cole o link do player aqui..." className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Título do Filme</label>
                  <input required value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Categoria</label>
                  <input required value={newMovie.category} onChange={e => setNewMovie({...newMovie, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Sinopse</label>
                <textarea rows={3} value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00D1FF] focus:outline-none" />
              </div>
              <button type="submit" className="w-full py-6 bg-[#00D1FF] text-black font-black uppercase tracking-widest rounded-3xl hover:scale-[1.02] transition-all shadow-lg shadow-[#00D1FF]/20">Publicar Filme Grátis</button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {movies.map(movie => (
              <div key={movie.id} className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden group flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <img src={movie.backdropUrl || movie.posterUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt="" />
                  <div className="absolute top-4 right-4">
                    <button onClick={() => handleDelete(movie.id)} className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black uppercase tracking-tighter truncate">{movie.title}</h4>
                  <p className="text-[#00D1FF] text-[8px] font-black uppercase tracking-widest mt-2">
                    {movie.videoUrl.includes('cinegato') ? 'Provedor: CineGato' : 'Provedor: Interno'}
                  </p>
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
