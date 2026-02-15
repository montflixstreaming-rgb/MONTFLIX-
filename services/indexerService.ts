
import { Movie } from './types';

export interface IndexerLog {
  id: string;
  timestamp: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface ProviderStatus {
  name: string;
  latency: number;
  status: 'online' | 'busy' | 'offline';
  linksFound: number;
}

export const indexerService = {
  providers: [
    'CineGato BR', 'VidSrc Me', 'VidSrc To', 'WarezCDN', 
    'Embed.su', 'Vidsrc.xyz', 'SuperEmbed', 'AutoPlayer'
  ],

  async simulateScraping(movie: Movie): Promise<{ logs: IndexerLog[], status: ProviderStatus[] }> {
    const logs: IndexerLog[] = [];
    const status: ProviderStatus[] = [];

    for (const p of this.providers) {
      const isSuccess = Math.random() > 0.15;
      const latency = Math.floor(Math.random() * 800) + 100;
      
      logs.push({
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        message: `Scraping ${p} para "${movie.title}" (ID: ${movie.id})...`,
        status: 'info'
      });

      // Simula delay de rede
      await new Promise(r => setTimeout(r, 200));

      if (isSuccess) {
        logs.push({
          id: Math.random().toString(36),
          timestamp: new Date().toLocaleTimeString(),
          message: `Indexado com sucesso em ${p}. Latência: ${latency}ms.`,
          status: 'success'
        });
        status.push({ name: p, latency, status: 'online', linksFound: Math.floor(Math.random() * 5) + 1 });
      } else {
        logs.push({
          id: Math.random().toString(36),
          timestamp: new Date().toLocaleTimeString(),
          message: `Falha na indexação em ${p}. Timeout ou Link Quebrado.`,
          status: 'error'
        });
        status.push({ name: p, latency: 0, status: 'offline', linksFound: 0 });
      }
    }

    return { logs, status };
  }
};
