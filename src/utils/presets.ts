import { DecisionPreset } from '../types';

export const PRESETS: DecisionPreset[] = [
  {
    id: 'dinner',
    tag: 'Food & Dining',
    iconName: 'utensils',
    accentColor: '#FF5500',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=60',
    question: "Where are we eating tonight?",
    options: ['Ramen Bowl', 'Street Tacos', 'Smash Burgers', 'Thai Curry', 'Woodfire Pizza', 'Dim Sum']
  },
  {
    id: 'drinks',
    tag: 'Night Out',
    iconName: 'drink',
    accentColor: '#A855F7',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=200&q=60',
    question: "First drink destination?",
    options: ['The Dive Bar', 'Rooftop Lounge', 'Local Brewery', 'Speakeasy', 'Boba Spot']
  },
  {
    id: 'game',
    tag: 'Squad Gaming',
    iconName: 'gamepad',
    accentColor: '#10B981',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=60',
    question: "What game are we launching tonight?",
    options: ['Helldivers 2', 'Valorant', 'Mario Kart', 'Lethal Company', 'Overwatch', 'Apex Legends']
  },
  {
    id: 'movie',
    tag: 'Movie Night',
    iconName: 'film',
    accentColor: '#3B82F6',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=60',
    question: "What genre/film are we watching?",
    options: ['Sci-Fi Mind Bender', '90s Action Classic', 'Psychological Thriller', 'Indie Comedy', 'Studio Ghibli']
  },
  {
    id: 'coffee',
    tag: 'Coffee Run',
    iconName: 'coffee',
    accentColor: '#F59E0B',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=60',
    question: "Who is buying the morning coffee round?",
    options: ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Riley']
  },
  {
    id: 'weekend',
    tag: 'Day Trip',
    iconName: 'map',
    accentColor: '#EC4899',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=60',
    question: "Saturday day trip spot?",
    options: ['Beach Boardwalk', 'Mountain Trail', 'Flea Market Crawl', 'Arcade & Bowling', 'Stay In & Cook']
  }
];
