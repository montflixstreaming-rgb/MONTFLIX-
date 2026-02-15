
/**
 * TMDB SERVICE v2.5 - MONTFLIX ULTRA SPEED
 * Chave Pessoal: d5ece792587135e1e07bc5ae8be84538
 */

const API_KEY = 'd5ece792587135e1e07bc5ae8be84538'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_KEY = 'montflix_catalog_cache_v2';

export const tmdbService = {
  /**
   * Recupera o catálogo salvo para exibição INSTANTÂNEA
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },

  /**
   * Persiste o catálogo em background
   */
  setCacheData(data: any) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Cache storage full");
    }
  },

  /**
   * Busca otimizada sem telas de carregamento
   */
  async fetchMovies(endpoint: string, page = 1) {
    try {
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=pt-BR&page=${page}&include_adult=false`;
      
      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();
      return data.results ? data.results.map((m: any) => this.formatMovie(m)) : [];
    } catch (error) {
      console.error("TMDB Fetch Error:", error);
      return [];
    }
  },

  async getTrending() { return this.fetchMovies('/trending/movie/day'); },
  async getPopular() { return this.fetchMovies('/movie/popular'); },
  async getNowPlaying() { return this.fetchMovies('/movie/now_playing'); },
  async getUpcoming() { return this.fetchMovies('/movie/upcoming'); },
  async getTopRated() { return this.fetchMovies('/movie/top_rated'); },
  
  async search(query: string) {
    if (!query || query.trim().length < 2) return [];
    return this.fetchMovies(`/search/movie?query=${encodeURIComponent(query.trim())}`);
  },

  /**
   * Formata os dados reais do TMDB com suporte a imagens originais
   */
  formatMovie(m: any) {
    return {
      id: String(m.id),
      title: m.title || m.original_title || 'Título Indisponível',
      posterUrl: m.poster_path 
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}` 
        : 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=500&auto=format&fit=crop',
      backdropUrl: m.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` 
        : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1280&auto=format&fit=crop',
      rating: m.vote_average || 0,
      year: m.release_date ? new Date(m.release_date).getFullYear() : 2025,
      description: m.overview || 'Sinopse oficial em processamento pela nossa equipe de tradução.',
      category: 'Cinema',
      videoUrl: 'AUTO_EMBED' // O VideoPlayer usará o ID para o CineGato
    };
  }
};
