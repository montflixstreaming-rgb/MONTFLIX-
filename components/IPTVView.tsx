
import React, { useState, useEffect } from 'react';
import { IPTVChannel } from '../services/types';
import { iptvService } from '../services/iptvService';
import IPTVPlayer from './IPTVPlayer';

const IPTVView: React.FC = () => {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<IPTVChannel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('DESENHOS & KIDS');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState<IPTVChannel | null>(null);

  // Fontes IPTV mais estáveis e focadas no pedido do usuário
  const SOURCES = [
    "https://iptv-org.github.io/iptv/countries/br.m3u", // Canais do Brasil (Cidades/Nacional)
    "https://iptv-org.github.io/iptv/categories/animation.m3u", // Desenhos e Kids
    "https://iptv-org.github.io/iptv/languages/por.m3u", // Português Geral
    "https://raw.githubusercontent.com/TiagoS86/Lista-IPTV/master/Lista.m3u" // Alternativa estável
  ];

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(SOURCES.map(url => iptvService.fetchM3U(url)));
        const combined = results.flat().filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
        
        if (combined.length > 0) {
          const normalized = combined.map(c => {
            const name = c.name.toUpperCase();
            const group = c.group.toUpperCase();
            
            // Prioridade para Kids/Desenhos
            if (group.includes('ANIMATION') || group.includes('KIDS') || group.includes('DESENHO') || group.includes('INFANTIL') || name.includes('DISNEY') || name.includes('NICK') || name.includes('CARTOON')) {
              return { ...c, group: 'DESENHOS & KIDS' };
            }
            // Canais Abertos / Cidades
            if (group.includes('ABERTO') || group.includes('GENERAL') || group.includes('NACIONAL') || group.includes('BRASIL') || name.includes('GLOBO') || name.includes('SBT') || name.includes('RECORD') || name.includes('TV')) {
              return { ...c, group: 'CANAIS ABERTOS (CIDADES)' };
            }
            // Esportes
            if (group.includes('SPORT') || group.includes('ESPORTE') || name.includes('ESP') || name.includes('FOOTBALL')) {
              return { ...c, group: 'ESPORTES' };
            }
            // Filmes 24h
            if (group.includes('MOVIES') || group.includes('FILMES') || name.includes('HBO') || name.includes('TELE CINE')) {
              return { ...c, group: 'FILMES 24H' };
            }
            return { ...c, group: group || 'OUTROS' };
          });

          setChannels(normalized);
          
          const cats = Array.from(new Set(normalized.map(c => c.group))).sort((a, b) => {
            if (a === 'DESENHOS & KIDS') return -1;
            if (b === 'DESENHOS & KIDS') return 1;
            if (a === 'CANAIS ABERTOS (CIDADES)') return -1;
            if (b === 'CANAIS ABERTOS (CIDADES)') return 1;
            return a.localeCompare(b);
          });
          
          setCategories(['Todos', ...cats]);
          setFilteredChannels(normalized);
          setActiveCategory('DESENHOS & KIDS'); // Começa na categoria infantil como pedido
        }
      } catch (err) {
        console.error("IPTV Global Load Error", err);
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
      result = result.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.group.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredChannels(result);
  }, [activeCategory, search, channels]);

  return (
    <div className="min-h-screen pt-40 px-6 md:px-16 pb-20 animate-in fade-in duration-1000">
      
      {/* Mega Banner IPTV */}
      <div className="relative w-full h-64 md:h-96 rounded-[3rem] overflow-hidden mb-16 bg-zinc-900 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30 hover:scale-105 transition-transform duration-[20s]" 
          alt="IPTV" 
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full animate-pulse shadow-[0_0_20px_red]">SINAL AO VIVO</span>
            <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Multi-Satélite Pro</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-white">CENTRO <span className="text-[#00D1FF]">GLOBAL</span></h1>
          <p className="text-white/30 text-xs md:text-sm font-black mt-4 uppercase tracking-[0.6em] max-w-2xl">Cidades • Desenhos • Esportes • Filmes • Notícias</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Guia de Categorias Slim */}
        <div className="lg:w-72 shrink-0 space-y-4">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-8 pl-2">Seleção de Sinal</h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide">
            {categories.slice(0, 18).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap w-full text-left px-7 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-white text-black shadow-2xl scale-105 translate-x-2' 
                    : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Canais Profissional */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 italic">
              Navegando em <span className="text-white">/ {activeCategory}</span>
            </h2>
            <div className="relative w-full md:w-80 group">
              <input 
                type="text" 
                placeholder="🔍 Buscar canal ou cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-[11px] font-bold focus:outline-none focus:border-[#00D1FF] w-full transition-all group-hover:border-white/20"
              />
            </div>
          </div>

          {loading ? (
             <div className="h-80 flex flex-col items-center justify-center gap-6">
               <div className="w-12 h-12 border-2 border-white/5 border-t-[#00D1FF] rounded-full animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Sintonizando Rede Mundial...</p>
             </div>
          ) : filteredChannels.length === 0 ? (
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
               <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Nenhum sinal encontrado nesta região</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {filteredChannels.slice(0, 300).map(channel => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className="group relative cursor-pointer bg-zinc-900/50 border border-white/5 rounded-3xl p-5 hover:border-[#00D1FF]/40 hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-2"
                >
                  <div className="aspect-video mb-4 flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 p-5 relative border border-white/5">
                    <img 
                      src={channel.logo} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                      onError={(e) => { (e.target as any).src = 'https://cdn-icons-png.flaticon.com/512/716/716429.png' }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                       <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                       <span className="text-[7px] text-white font-black uppercase">Live</span>
                    </div>
                  </div>
                  <h3 className="text-[10px] font-black uppercase text-center line-clamp-1 tracking-tight text-gray-500 group-hover:text-white transition-colors">
                    {channel.name}
                  </h3>
                  <div className="mt-2 text-[7px] font-bold text-white/10 text-center uppercase tracking-[0.3em] truncate">{channel.group}</div>
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
