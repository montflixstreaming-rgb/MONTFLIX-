
import React, { useState, useEffect } from 'react';
import { IPTVChannel } from '../services/types';
import { iptvService } from '../services/iptvService';
import IPTVPlayer from './IPTVPlayer';

const IPTVView: React.FC = () => {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<IPTVChannel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('DESENHOS & KIDS (PT)');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState<IPTVChannel | null>(null);

  const SOURCES = [
    "https://iptv-org.github.io/iptv/countries/br.m3u", // Brasil
    "https://iptv-org.github.io/iptv/categories/animation.m3u", // Mundial Animação
    "https://iptv-org.github.io/iptv/languages/por.m3u" // Português
  ];

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(SOURCES.map(url => iptvService.fetchM3U(url)));
        let combined = results.flat().filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
        
        // CANAIS ESPECIAIS (FIXOS)
        const specials: IPTVChannel[] = [
          { 
            id: 'simpsons-24h-dub', 
            name: 'OS SIMPSONS 24H (DUBLADO)', 
            logo: 'https://upload.wikimedia.org/wikipedia/en/0/0d/The_Simpsons_Family.png', 
            url: 'https://cloud2.stmv.live/simpsons/simpsons/playlist.m3u8',
            group: 'DESENHOS & KIDS (PT)' 
          },
          { 
            id: 'tv-globinho-maratona', 
            name: 'TV GLOBINHO (MARATONA)', 
            logo: 'https://upload.wikimedia.org/wikipedia/pt/4/4e/TV_Globinho_logo.png', 
            url: 'https://cloud2.stmv.live/globinho/globinho/playlist.m3u8',
            group: 'DESENHOS & KIDS (PT)' 
          }
        ];

        combined = [...specials, ...combined];

        const normalized = combined.map(c => {
          const name = c.name.toUpperCase();
          const group = (c.group || '').toUpperCase();
          
          // MIX 50/50 Lógica
          if (name.includes('SIMPSONS') || group.includes('ANIMATION') || name.includes('GLOBO') || group.includes('KIDS') || name.includes('DISNEY')) {
            return { ...c, group: 'DESENHOS & KIDS (PT)' };
          }
          if (group.includes('LOCAL') || group.includes('BRASIL') || name.includes('TV ') || name.includes('RECORD') || name.includes('SBT')) {
            return { ...c, group: 'CIDADES & NOTÍCIAS (BR)' };
          }
          if (group.includes('SPORT') || name.includes('ESPN') || name.includes('FOX')) {
            return { ...c, group: 'ESPORTES MUNDIAIS' };
          }
          return { ...c, group: 'VARIEDADES GLOBAIS' };
        });

        setChannels(normalized);
        const cats = Array.from(new Set(normalized.map(c => c.group))).sort((a, b) => {
          if (a.includes('(PT)')) return -1;
          if (b.includes('(PT)')) return 1;
          return a.localeCompare(b);
        });
        setCategories(['Todos', ...cats]);
        setFilteredChannels(normalized);
      } catch (err) {
        console.error("IPTV Error", err);
      }
      setLoading(false);
    };
    loadChannels();
  }, []);

  useEffect(() => {
    let result = channels;
    if (activeCategory !== 'Todos') {
      result = result.filter(c => c.group === activeCategory);
    }
    if (search) {
      result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredChannels(result);
  }, [activeCategory, search, channels]);

  return (
    <div className="min-h-screen pt-44 px-6 md:px-16 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER BANNER APP STYLE */}
      <div className="relative w-full h-64 md:h-[400px] rounded-[3.5rem] overflow-hidden mb-16 bg-zinc-900 border-2 border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40" 
          alt="IPTV" 
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 md:p-20">
          <div className="flex items-center gap-4 mb-4">
             <span className="bg-[#00D1FF] text-black text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_0_15px_#00D1FF]">APP ATIVO</span>
             <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Brasil & Mundo 24h</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white">MONT<span className="text-[#00D1FF]">LIVE</span></h1>
          <p className="text-white/30 text-xs md:text-lg font-bold mt-4 uppercase tracking-[0.4em]">Sua cidade e seus desenhos favoritos em um só lugar.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* MENU LATERAL */}
        <div className="lg:w-80 shrink-0 space-y-4">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-8 pl-4 border-l-2 border-[#00D1FF]">Categorias Pro</h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap w-full text-left px-8 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-[#00D1FF] text-black shadow-xl scale-105' 
                    : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRADE DE CANAIS */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">
              Sintonizando: <span className="text-white">{activeCategory}</span>
            </h2>
            <input 
              type="text" 
              placeholder="🔍 Buscar cidade ou desenho..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border-2 border-white/5 rounded-3xl px-8 py-4 text-[11px] font-bold focus:outline-none focus:border-[#00D1FF] w-full md:w-80 transition-all"
            />
          </div>

          {loading ? (
             <div className="h-96 flex flex-col items-center justify-center gap-6">
               <div className="w-12 h-12 border-4 border-[#00D1FF]/10 border-t-[#00D1FF] rounded-full animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Varrendo Satélites...</p>
             </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {filteredChannels.slice(0, 300).map(channel => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className="group relative cursor-pointer bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 hover:border-[#00D1FF]/40 hover:bg-zinc-800 transition-all shadow-xl"
                >
                  <div className="aspect-video mb-5 flex items-center justify-center overflow-hidden rounded-[1.5rem] bg-black/60 p-6 relative border border-white/5">
                    <img 
                      src={channel.logo} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                      onError={(e) => { (e.target as any).src = 'https://cdn-icons-png.flaticon.com/512/716/716429.png' }}
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                       <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_red]" />
                       <span className="text-[8px] text-white font-black uppercase tracking-widest">Live</span>
                    </div>
                  </div>
                  <h3 className="text-[11px] font-black uppercase text-center line-clamp-2 tracking-tight text-gray-400 group-hover:text-white transition-colors">
                    {channel.name}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeChannel && <IPTVPlayer channel={activeChannel} onClose={() => setActiveChannel(null)} />}
    </div>
  );
};

export default IPTVView;
