
import { IPTVChannel } from './types';

export const iptvService = {
  PROXIES: [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://cors-anywhere.herokuapp.com/${url}`
  ],

  async fetchM3U(url: string): Promise<IPTVChannel[]> {
    for (const proxyFn of this.PROXIES) {
      try {
        const proxyUrl = proxyFn(url);
        const response = await fetch(proxyUrl, { 
          signal: AbortSignal.timeout(20000) 
        });

        if (response.ok) {
          const text = await response.text();
          if (text.includes('#EXTM3U')) {
            return this.parseM3U(text);
          }
        }
      } catch (e) {
        continue;
      }
    }
    return [];
  },

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
          name: nameMatch ? nameMatch[1].trim() : "Canal",
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
