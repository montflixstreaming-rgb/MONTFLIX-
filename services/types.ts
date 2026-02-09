
export interface SubtitleTrack {
  label: string;
  src: string;
  srclang: string;
  default?: boolean;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  year: number;
  description: string;
  category: string;
  videoUrl: string;
  mediaType?: 'movie' | 'tv';
  subtitles?: SubtitleTrack[];
  originalLanguage?: 'en' | 'pt';
  imagePrompt?: string; // Prompt detalhado para o Gemini Image
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
