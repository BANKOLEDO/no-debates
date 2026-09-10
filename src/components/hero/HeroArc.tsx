import React from 'react';

export interface ArcCard {
  title: string;
  category: string;
  image: string;
  rotate: number;
  x: number;
  y: number;
  presetId: string;
}

// Desktop arc
export const HALO_ARC_CARDS: ArcCard[] = [
  { title: 'Street Tacos', category: 'Food', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80', rotate: -36, x: -340, y: 80, presetId: 'dinner' },
  { title: 'Ramen Bowl', category: 'Dinner', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', rotate: -22, x: -240, y: 10, presetId: 'dinner' },
  { title: 'Rooftop Lounge', category: 'Drinks', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80', rotate: -10, x: -120, y: -30, presetId: 'drinks' },
  { title: 'Squad Gaming', category: 'Games', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', rotate: 0, x: 0, y: -45, presetId: 'game' },
  { title: 'Movie Night', category: 'Cinema', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80', rotate: 10, x: 120, y: -30, presetId: 'movie' },
  { title: 'Roadtrip Trail', category: 'Weekend', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', rotate: 22, x: 240, y: 10, presetId: 'weekend' },
  { title: 'Morning Coffee', category: 'Coffee', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', rotate: 36, x: 340, y: 80, presetId: 'coffee' }
];

// Mobile arc, spread wide so cards don't overlap
export const MOBILE_ARC_CARDS: ArcCard[] = [
  { title: 'Street Tacos', category: 'Food', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80', rotate: -36, x: -150, y: 30, presetId: 'dinner' },
  { title: 'Ramen Bowl', category: 'Dinner', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', rotate: -22, x: -100, y: 8, presetId: 'dinner' },
  { title: 'Rooftop Lounge', category: 'Drinks', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80', rotate: -10, x: -50, y: -6, presetId: 'drinks' },
  { title: 'Squad Gaming', category: 'Games', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', rotate: 0, x: 0, y: -12, presetId: 'game' },
  { title: 'Movie Night', category: 'Cinema', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80', rotate: 10, x: 50, y: -6, presetId: 'movie' },
  { title: 'Roadtrip Trail', category: 'Weekend', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', rotate: 22, x: 100, y: 8, presetId: 'weekend' },
  { title: 'Morning Coffee', category: 'Coffee', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', rotate: 36, x: 150, y: 30, presetId: 'coffee' }
];

interface HeroArcProps {
  variant?: 'desktop' | 'mobile';
  onPick: (presetId: string) => void;
}

// Photo semicircle, dancing + shimmering
export const HeroArc: React.FC<HeroArcProps> = ({ variant = 'desktop', onPick }) => {
  const desktop = variant === 'desktop';
  const cards = desktop ? HALO_ARC_CARDS : MOBILE_ARC_CARDS;
  const imgFor = (url: string) => desktop ? url : url.replace('w=400', 'w=200').replace('q=80', 'q=60');
  const w = desktop ? 104 : 48;
  const h = desktop ? 128 : 68;

  return (
    <div className={desktop ? 'relative w-[900px] h-[280px] mb-8' : 'relative w-[340px] h-[130px] mb-6'}>
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => onPick(card.presetId)}
          className="absolute left-1/2 top-1/2 rounded-xl overflow-hidden bg-white p-1 cursor-pointer z-10"
          style={{
            width: desktop ? 104 : 48,
            height: desktop ? 128 : 68,
            marginLeft: -w / 2,
            marginTop: -h / 2,
            transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
          }}
        >
          <div className={`relative w-full h-full overflow-hidden arc-dance ${desktop ? 'rounded-xl' : 'rounded-lg'}`} style={{ animationDelay: `${i * 0.45}s` }}>
            <img
              src={imgFor(card.image)}
              alt={card.title}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className={`absolute text-white ${desktop ? 'bottom-1.5 left-1.5 right-1.5' : 'bottom-1 left-1 right-1'}`}>
              <span className={`font-black uppercase tracking-wider block leading-none mb-0.5 ${desktop ? 'text-[8px]' : 'text-[7px]'}`}>
                {card.category}
              </span>
              <span className={`font-extrabold leading-tight block truncate ${desktop ? 'text-[10px]' : 'text-[8px]'}`}>
                {card.title}
              </span>
            </div>
            <span className="arc-shine" style={{ animationDelay: `${i * 0.45}s` }} />
          </div>
        </div>
      ))}
    </div>
  );
};
