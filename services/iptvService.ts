
import { IPTVChannel } from './types';

export const iptvService = {
  // Lista de proxies para garantir o carregamento
  PROXIES: [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`
  ],

  /**
   * Conecta e processa uma lista M3U tentando múltiplos caminhos de rede
   */
  async fetchM3U(url: string): Promise<IPTVChannel[]> {
    console.log(`[IPTV] Iniciando sintonização de: ${url}`);
    
    // Tenta cada proxy até um funcionar
    for (const proxyFn of this.PROXIES) {
      try {
        const proxyUrl = proxyFn(url);
        const response = await fetch(proxyUrl, { 
          signal: AbortSignal.timeout(8000) // Timeout de 8 segundos por tentativa
        });

        if (response.ok) {
          const text = await response.text();
          if (text.includes('#EXTM3U')) {
            const parsed = this.parseM3U(text);
            if (parsed.length > 0) {
              console.log(`[IPTV] Sucesso via proxy. Canais: ${parsed.length}`);
              return parsed;
            }
          }
        }
      } catch (e) {
        console.warn(`[IPTV] Falha na tentativa de proxy para ${url}`);
      }
    }

    // Última tentativa: Direto (pode falhar por CORS no browser mas funciona em alguns ambientes)
    try {
      const directResponse = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (directResponse.ok) {
        const text = await directResponse.text();
        return this.parseM3U(text);
      }
    } catch (e) {}

    console.error(`[IPTV] Erro crítico: Não foi possível carregar a lista ${url}`);
    return [];
  },

  /**
   * Parser otimizado para extração de metadados
   */
  parseM3U(content: string): IPTVChannel[] {
    const channels: IPTVChannel[] = [];
    const lines = content.split('\n');
    let currentChannel: Partial<IPTVChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#EXTINF:')) {
        const nameMatch = line.match(/,(.*)$/);
        const logoMatch = line.match(/tvg-logo="(.*?)"/);
        const groupMatch = line.match(/group-title="(.*?)"/);

        currentChannel = {
          id: `iptv-${i}-${Math.random().toString(36).substr(2, 5)}`,
          name: nameMatch ? nameMatch[1].trim() : "Canal Desconhecido",
          logo: logoMatch ? logoMatch[1] : "https://cdn-icons-png.flaticon.com/512/716/716429.png",
          group: groupMatch ? groupMatch[1] : "Geral"
        };
      } else if (line.startsWith('http')) {
        currentChannel.url = line;
        if (currentChannel.name && currentChannel.url) {
          channels.push(currentChannel as IPTVChannel);
        }
        currentChannel = {};
      }
    }

    return channels;
  }
};
