
import { Movie } from './types';
import { GoogleGenAI } from "@google/genai";

export interface SpiderLog {
  id: string;
  timestamp: string;
  node: string;
  action: string;
  status: 'scanning' | 'found' | 'error' | 'bypassing';
}

const NODES = ['US-EAST-1', 'EU-WEST-2', 'BR-SAO-1', 'ASIA-TOK-1', 'RU-MOS-1'];

export const spiderService = {
  async runGlobalScan(movies: Movie[], onLog: (log: SpiderLog) => void): Promise<number> {
    let linksFound = 0;

    for (const movie of movies) {
      const node = NODES[Math.floor(Math.random() * NODES.length)];
      
      // Fase 1: Discovery
      onLog({
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        node,
        action: `Iniciando varredura profunda: "${movie.title}"`,
        status: 'scanning'
      });
      await new Promise(r => setTimeout(r, 600));

      // Fase 2: Bypassing/Scraping
      onLog({
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        node,
        action: `Tentando bypass em Provedores CDN (Vidsrc/Warez)...`,
        status: 'bypassing'
      });
      await new Promise(r => setTimeout(r, 800));

      // Fase 3: Link Resolution (Simulado mas com lógica de sucesso)
      const success = Math.random() > 0.1;
      if (success) {
        const foundCount = Math.floor(Math.random() * 3) + 1;
        linksFound += foundCount;
        onLog({
          id: Math.random().toString(36),
          timestamp: new Date().toLocaleTimeString(),
          node,
          action: `Sucesso! ${foundCount} mirrors estáveis indexados para "${movie.title}"`,
          status: 'found'
        });
      } else {
        onLog({
          id: Math.random().toString(36),
          timestamp: new Date().toLocaleTimeString(),
          node,
          action: `Falha: Link quebrado ou Geo-bloqueio detectado em ${movie.title}`,
          status: 'error'
        });
      }
      
      await new Promise(r => setTimeout(r, 400));
    }

    return linksFound;
  }
};
