import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { sound } from '../../audio/sound';
import { MaskedLine, Rise } from '../Reveal';

const PILLARS: [string, string][] = [
  ['100% Unbiased', 'Zero human blame, purely random'],
  ['Instant Verdict', 'Locked answer in one single spin'],
  ['WhatsApp Ready', 'One-click formatted receipt for the chat'],
];

interface HeroHeaderProps {
  compact?: boolean;
  onLaunch: () => void;
}

// Headline, sub, CTA + pillars
export const HeroHeader: React.FC<HeroHeaderProps> = ({ compact = false, onLaunch }) => (
  <>
    <div className={compact ? 'text-center max-w-md mx-auto px-4' : 'text-center max-w-2xl mx-auto z-20'}>
      <h1 className={`font-black text-ink-900 tracking-tight leading-[1.06] mb-4 ${compact ? 'text-4xl' : 'text-5xl sm:text-6xl'}`}>
        <MaskedLine delay={0.05}>End the group debate</MaskedLine>
        <MaskedLine delay={0.15} className="font-serif italic font-normal text-accent">
          in 3 seconds flat.
        </MaskedLine>
      </h1>

      <Rise delay={0.28}>
        <p className={`text-ink-600 font-medium leading-relaxed mx-auto mb-8 ${compact ? 'text-sm max-w-sm' : 'text-base max-w-lg'}`}>
          Add choices, hit spin, and get an unbiased locked verdict. No hurt feelings, no 40-message arguments.
        </p>
      </Rise>

      <Rise delay={0.38}>
        <button
          onClick={() => {
            sound.click();
            onLaunch();
          }}
          className="bg-ink-900 hover:bg-ink-800 text-white font-bold text-sm px-8 py-4 rounded-full inline-flex items-center space-x-2.5 transition-colors"
        >
          <span>Launch The Machine</span>
          <ArrowRightIcon className="w-4 h-4 text-accent" />
        </button>
      </Rise>
    </div>

    <div className={compact
      ? 'w-full max-w-xs mx-auto mt-10 pt-6 border-t border-ink-200 text-center space-y-5'
      : 'grid grid-cols-3 gap-12 max-w-3xl mx-auto mt-16 pt-8 border-t border-ink-200 text-center'
    }>
      {PILLARS.map(([title, sub]) => (
        <div key={title}>
          <span className={`font-serif italic text-ink-900 font-semibold block mb-0.5 ${compact ? 'text-base' : 'text-lg'}`}>
            {title}
          </span>
          <p className="text-xs text-ink-500">{sub}</p>
        </div>
      ))}
    </div>
  </>
);
