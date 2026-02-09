
import { Movie } from './services/types';

export const COLORS = {
  primary: '#00D1FF',
  background: '#0a0a0b',
  card: '#1c1c1e',
  text: '#FFFFFF'
};

const DEMO_SUBTITLES = [
  { label: 'Português (Manual)', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/subtitles/tears_of_steel_pt.vtt', srclang: 'pt', default: true },
  { label: 'English (Original)', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/subtitles/tears_of_steel_en.vtt', srclang: 'en' }
];

export const MOCK_MOVIES: Movie[] = [
  { 
    id: 'montflix-epic-01', 
    title: 'Sinfonia do Espaço', 
    posterUrl: '', 
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1472&auto=format&fit=crop',
    rating: 10, 
    year: 2026, 
    description: 'PRODUÇÃO ÉPICA (1h 08min). Uma exploração definitiva sobre a origem das galáxias e o destino do tempo. Este longa-metragem exclusivo da MONTFLIX Pro leva você em uma viagem imersiva de mais de uma hora pelos segredos do cosmos, renderizado em 4K nativo com trilha sonora orquestral.', 
    category: 'Documentário',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Simulando o longa
    subtitles: DEMO_SUBTITLES,
    originalLanguage: 'pt',
    imagePrompt: 'Epic cinematic shot of a colorful nebula swirling around a black hole, stars reflecting in a spaceship window, ultra-detailed space photography, 8k resolution'
  },
  { 
    id: 'montflix-long-01', 
    title: 'A Travessia do Infinito', 
    posterUrl: '', 
    backdropUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=1470&auto=format&fit=crop',
    rating: 9.9, 
    year: 2026, 
    description: 'PRODUÇÃO ORIGINAL MONTFLIX (82 MINUTOS). Uma jornada sem precedentes através das estrelas. Este longa-metragem épico explora os limites da consciência humana.', 
    category: 'Sci-Fi',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    subtitles: DEMO_SUBTITLES,
    originalLanguage: 'pt',
    imagePrompt: 'Hyper-realistic cinematic shot of a massive spaceship orbiting a glowing ringed planet'
  },
  { 
    id: 'montflix-01', 
    title: 'Tears of Steel (4K)', 
    posterUrl: '', 
    backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1280&auto=format&fit=crop',
    rating: 9.8, 
    year: 2025, 
    description: 'Um clássico da ficção científica moderna agora em versão estendida nativa na MONTFLIX.', 
    category: 'Sci-Fi',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    subtitles: DEMO_SUBTITLES,
    originalLanguage: 'en',
    imagePrompt: 'Detailed close-up of a high-tech cyborg eye reflecting a futuristic cityscape'
  },
  { 
    id: 'montflix-02', 
    title: 'Big Buck Bunny', 
    posterUrl: '', 
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1280&auto=format&fit=crop',
    rating: 8.5, 
    year: 2024, 
    description: 'A animação que conquistou gerações agora em altíssima definição.', 
    category: 'Ação',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    subtitles: DEMO_SUBTITLES,
    originalLanguage: 'en',
    imagePrompt: 'Realistic fluffy giant rabbit standing in a misty sunlit forest'
  },
  { 
    id: 'montflix-06', 
    title: 'Cosmos: Além do Horizonte', 
    posterUrl: '', 
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1280&auto=format&fit=crop',
    rating: 9.9, 
    year: 2025, 
    description: 'A maior exploração espacial já documentada. Imagens reais de nebulosas e galáxias distantes.', 
    category: 'Sci-Fi',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    originalLanguage: 'en',
    imagePrompt: 'Astronaut helmet visor reflecting a massive sun'
  }
];

export const CATEGORIES = [
  { id: 'trending', title: 'Bombando na MONTFLIX' },
  { id: 'action', title: 'Adrenalina Pura' },
  { id: 'scifi', title: 'Futuro & Tecnologia' },
  { id: 'drama', title: 'Emocionantes' }
];
