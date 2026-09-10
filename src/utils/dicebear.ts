/**
 * DiceBear Avatar URL Builder
 * Generates deterministic SVG avatar URLs across multiple styles with pastel backgrounds
 */

export type DiceBearStyle = 
  | 'lorelei' 
  | 'adventurer' 
  | 'notionists' 
  | 'bottts' 
  | 'fun-emoji' 
  | 'micah' 
  | 'open-peeps' 
  | 'shapes' 
  | 'thumbs';

const PASTEL_BG_COLORS = [
  'ffe4e6', // soft pink
  'fef3c7', // soft amber
  'cffafe', // soft cyan
  'dcfce7', // soft green
  'dbeafe', // soft blue
  'ecfccb', // soft lime
  'f3e8ff', // soft purple
  'ffedd5', // soft orange
];

export function getDiceBearAvatar(
  seed: string, 
  style: DiceBearStyle = 'lorelei',
  size: number = 120
): string {
  // Deterministic pastel color based on seed characters
  let charSum = 0;
  for (let i = 0; i < seed.length; i++) {
    charSum += seed.charCodeAt(i);
  }
  const bg = PASTEL_BG_COLORS[charSum % PASTEL_BG_COLORS.length];
  
  const cleanSeed = encodeURIComponent(seed.trim() || 'NoDebates');
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${cleanSeed}&backgroundColor=${bg}&size=${size}`;
}
