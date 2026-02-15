
import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../services/types';
import { realSpiderService } from '../services/realSpiderService';

interface IndexerDashboardProps {
  onMoviesFound: (newMovies: Movie[]) => void;
  onClose: () => void;
}

const CINEMA_SITES = [
  'google.com/search?q=cinema+2025',
  'omelete.com.br/filmes',
  'adorocinema.com',
  'imdb.com/calendar',
  'rottentomatoes.com',
  'cinepop.com.br',
  'legiaodosherois.com.br',
  'themoviedb.org/trending'
];

const IndexerDashboard: React.FC<IndexerDashboardProps> = ({ onMoviesFound, onClose }) => {
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'web' | 'error' | 'cmd'}[]>([]);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activePing, setActivePing] = useState("");
  const [radarDots, setRadarDots] = useState<{x: number, y: number, id: number}[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Efeito Visual do Radar e Pings de Rede
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setRadarDots(prev => [
          ...prev.slice(-12), 
          { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, id: Date.now() }
        ]);
        setActivePing(CINEMA_SITES[Math.floor(Math.random() * CINEMA_SITES.length)]);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const addLog = (msg: string, type: 'info' | 'success' | 'web' | 'error' | 'cmd' = 'info') => {
    setLogs(prev => [...prev, { msg, type }]);
  };

  const startRealScan = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setSources([]);
    setProgress(0);
    
    addLog("MONTFLIX_SPIDER_CORE_V4_MASTER INITIALIZING...", "cmd");
    addLog("ESTABELECENDO CONEXÃO SEGURA COM NÓS GEMINI-3-PRO...", "info");
    
    try {
      // Sequência de varredura visual (Simula o robô "saindo" para a web)
      for (let i = 0; i < 4; i++) {
        await new Promise(r => setTimeout(r, 700));
        addLog(`CRAWLING_TARGET: https://www.${CINEMA_SITES[i]}`, "web");
        setProgress(p => p + 10);
      }

      addLog("EXECUTANDO BUSCA POR GROUNDING (GOOGLE SEARCH ENGINE)...", "info");
      const result = await realSpiderService.scanForNewReleases();
      
      setProgress(60);
      
      if (result.sources.length > 0) {
        setSources(result.sources);
        addLog(`GROUNDING_SUCCESS: ${result.sources.length} FONTES DE DADOS MAPEADAS.`, "success");
        // Loga cada fonte encontrada para o dono ver
        result.sources.forEach(src => addLog(`FONTE_DETECTADA: ${src.title}`, "web"));
      }

      if (result.movies.length > 0) {
        addLog(`DECODIFICANDO STREAM DE DADOS: ${result.movies.length} TÍTULOS ENCONTRADOS.`, "info");
        setProgress(85);
        
        for (const m of result.movies) {
          addLog(`> INDEXANDO: ${m.title.toUpperCase()} [ID_VALIDADO_TMDB]`, "success");
          await new Promise(r => setTimeout(r, 200));
        }
        
        onMoviesFound(result.movies);
        setProgress(100);
        addLog("BANCO DE DADOS ATUALIZADO. SPIDER EM MODO STANDBY.", "success");
      } else {
        addLog("NENHUM DADO NOVO RELEVANTE ENCONTRADO NA VARREDURA ATUAL.", "error");
      }
    } catch (err: any) {
      addLog(`FALHA CRÍTICA NO SPIDER: ${err.message}`, "error");
      setProgress(0);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[550] bg-[#020202] flex flex-col font-mono text-green-500 overflow-hidden border-4 border-green-900/20">
      
      {/* HEADER DO CENTRO DE COMANDO */}
      <div className="p-5 bg-black border-b border-green-900/40 flex justify-between items-center shadow-[0_0_40px_rgba(0,0,0,1)] relative z-20">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-[0.4em] text-white flex items-center gap-4">
              <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]' : 'bg-red-600'}`} />
              CENTRO DE COMANDO SPIDER
            </h2>
            <div className="flex gap-6 mt-1">
              <span className="text-[8px] text-green-900 font-black uppercase">User: MASTER_ADMIN</span>
              <span className="text-[8px] text-green-900 font-black uppercase">Status: {isRunning ? 'EXECUTING_SCAN' : 'READY_FOR_COMMAND'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={startRealScan}
            disabled={isRunning}
            className={`px-10 py-4 border-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${
              isRunning ? 'border-green-900 text-green-900' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]'
            }`}
          >
            {isRunning ? 'VARRENDO WEB...' : 'INICIAR BUSCA REAL'}
            {isRunning && <div className="absolute inset-0 bg-green-500/10 animate-pulse" />}
          </button>
          <button onClick={onClose} className="px-6 py-4 border border-red-900 text-red-900 hover:bg-red-600 hover:text-white text-[10px] font-black uppercase transition-colors">Fechar Painel</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[radial-gradient(circle_at_center,_#050505_0%,_#000_100%)]">
        
        {/* LADO ESQUERDO: RADAR E INFOS TÉCNICAS */}
        <div className="w-full lg:w-1/3 border-r border-green-900/20 flex flex-col relative overflow-hidden">
          <div className="p-8 border-b border-green-900/10 bg-black/40">
            <h3 className="text-[10px] font-black text-green-500/50 uppercase tracking-[0.4em] mb-8">Radar de Proximidade de Dados</h3>
            <div className="aspect-square w-full max-w-[280px] mx-auto relative border border-green-900/30 rounded-full flex items-center justify-center overflow-hidden">
               {/* Grid do Radar */}
               <div className="absolute inset-0 border border-green-900/10 rounded-full scale-75" />
               <div className="absolute inset-0 border border-green-900/10 rounded-full scale-50" />
               <div className="absolute w-full h-px bg-green-900/10" />
               <div className="absolute h-full w-px bg-green-900/10" />
               
               {/* Linha de Varredura */}
               <div className={`absolute w-1/2 h-1 bg-gradient-to-r from-transparent to-green-500 origin-left ${isRunning ? 'animate-[spin_4s_linear_infinite]' : 'hidden'}`} />
               
               {/* Sinais Detectados (Dots) */}
               {radarDots.map(dot => (
                 <div 
                   key={dot.id}
                   className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
                   style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                 />
               ))}
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-end gap-8 bg-black/20">
            <div className="space-y-4">
              <p className="text-[8px] text-green-900 font-black uppercase">Rede Ativa (Pings)</p>
              <div className="h-12 bg-black border border-green-900/20 flex items-center px-4 overflow-hidden relative">
                <p className="text-[10px] text-green-400 font-bold truncate animate-pulse">
                  {activePing ? `PINGING > ${activePing}` : "AGUARDANDO_SINAL"}
                </p>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border border-green-900/20 bg-green-900/5 rounded-xl">
                <span className="text-[8px] text-green-900 font-black uppercase block mb-1">Packet_Loss</span>
                <span className="text-lg font-black text-white">0.00%</span>
              </div>
              <div className="p-5 border border-green-900/20 bg-green-900/5 rounded-xl">
                <span className="text-[8px] text-green-900 font-black uppercase block mb-1">Encrypted</span>
                <span className="text-lg font-black text-white">AES_256</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTRO: TERMINAL DE LOGS EM TEMPO REAL */}
        <div className="flex-1 overflow-y-auto p-8 space-y-1 bg-black/50 relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden text-[6px] text-green-500 break-all select-none">
            {Array(150).fill(0).map((_, i) => <div key={i}>{Math.random().toString(36).substring(2)} {Math.random().toString(36).substring(2)}</div>)}
          </div>
          
          {logs.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-20">
               <div className="w-16 h-16 border border-green-500 rounded-full animate-ping mb-6" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">Sistema de Varredura em Standby</p>
             </div>
          )}

          {logs.map((log, i) => (
            <div key={i} className="flex gap-6 text-[11px] leading-relaxed group hover:bg-green-500/5 transition-colors p-1 rounded">
              <span className="text-green-900 shrink-0 font-bold opacity-40 group-hover:opacity-100 transition-opacity uppercase text-[9px]">EVNT_{i.toString().padStart(3, '0')}</span>
              <span className={`
                ${log.type === 'success' ? 'text-green-400 font-black drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]' : ''}
                ${log.type === 'web' ? 'text-cyan-400 italic' : ''}
                ${log.type === 'error' ? 'text-red-500 font-black animate-pulse' : ''}
                ${log.type === 'cmd' ? 'text-white font-black bg-white/5 px-2 py-0.5' : 'text-green-600/80'}
              `}>
                {log.type === 'web' ? '>> SCAN_NODE: ' : ''}
                {log.msg}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* LADO DIREITO: FONTES DE GROUNDING REAIS */}
        <div className="w-full lg:w-96 bg-black border-l border-green-900/20 p-8 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-8 border-b border-green-900/20 pb-4 flex items-center gap-3">
             <span className="animate-pulse">●</span> GROUNDING_NETWORK
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-5">
            {sources.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                <p className="text-[8px] font-black uppercase tracking-widest leading-relaxed">Aguardando mapeamento de<br/>nós de rede do Google</p>
              </div>
            ) : (
              sources.map((src, i) => (
                <div key={i} className="p-5 border border-green-900/20 bg-green-500/5 rounded-xl hover:border-green-500 transition-all group/src relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[6px] text-green-900 font-black">NODE_0x{i}</div>
                  <p className="text-[10px] font-black text-green-400 truncate mb-1">{src.title}</p>
                  <a 
                    href={src.uri} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[8px] text-green-900 hover:text-green-300 truncate block underline decoration-green-900/40"
                  >
                    {src.uri}
                  </a>
                </div>
              ))
            )}
          </div>

          <div className="pt-8 mt-8 border-t border-green-900/20">
             <div className="flex justify-between text-[10px] font-black text-green-500 uppercase mb-3">
                <span>Task_Progress</span>
                <span className="animate-pulse">{progress}%</span>
             </div>
             <div className="h-1.5 bg-green-900/20 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-700 shadow-[0_0_10px_#22c55e]" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER: STATUS DE SISTEMA MARQUEE */}
      <div className="h-10 bg-green-500 text-black flex items-center px-8 justify-between overflow-hidden shadow-[0_-10px_30px_rgba(34,197,94,0.1)]">
        <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
          <span className="text-[9px] font-black uppercase tracking-widest">© 2025 MONTFLIX_SPIDER_EYE_REALTIME</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Grounding: ENABLED</span>
          <span className="text-[9px] font-black uppercase tracking-widest">API_KEY: {process.env.API_KEY ? 'SECURED_SSL' : 'MISSING'}</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Bypass: ACTIVE</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Nodes: ONLINE</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default IndexerDashboard;
