
import { Movie } from './services/types';

export const COLORS = {
  primary: '#00D1FF',
  background: '#0a0a0b',
  card: '#1c1c1e',
  text: '#FFFFFF'
};

export const MOCK_MOVIES: Movie[] = [
  { 
    id: 'big-buck-bunny', 
    title: 'Big Buck Bunny', 
    posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg', 
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
    rating: 8.5, 
    year: 2008, 
    description: 'Um coelho gigante e adorável enfrenta três roedores rebeldes em uma aventura clássica da animação open-source.', 
    category: 'Animação',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  { 
    id: 'sintel', 
    title: 'Sintel', 
    posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg', 
    backdropUrl: 'https://durian.blender.org/wp-content/uploads/2010/10/sintel-01280.jpg',
    rating: 9.1, 
    year: 2010, 
    description: 'Uma jovem em busca de seu dragão desaparecido em uma jornada épica de tirar o fôlego.', 
    category: 'Aventura',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  }
];
