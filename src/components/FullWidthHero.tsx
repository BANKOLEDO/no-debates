import React from 'react';
import { sound } from '../audio/sound';
import { HeroArc } from './hero/HeroArc';
import { HeroHeader } from './hero/HeroHeader';
import { DecisionPreset } from '../types';
import { PRESETS } from '../utils/presets';

interface FullWidthHeroProps {
  presets?: DecisionPreset[];
  onLaunchMachine?: () => void;
  onSelectPreset?: (preset: DecisionPreset) => void;
}

// Landing hero only. No machine inside.
export const FullWidthHero: React.FC<FullWidthHeroProps> = ({
  presets = PRESETS,
  onLaunchMachine,
  onSelectPreset
}) => {
  const scrollToMachine = () => {
    if (onLaunchMachine) {
      onLaunchMachine();
      return;
    }
    document.getElementById('machine')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePick = (presetId: string) => {
    const found = presets.find(p => p.id === presetId);
    if (found && onSelectPreset) {
      sound.click();
      onSelectPreset(found);
    } else {
      scrollToMachine();
    }
  };

  return (
    <section className="relative w-full pt-4 sm:pt-10 pb-10 px-4 select-none">

      {/* Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#F9E8DE]/60 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* Desktop hero */}
      <div className="hidden lg:flex flex-col items-center max-w-6xl mx-auto min-h-[560px] relative justify-center pt-8 mb-16">
        <HeroArc variant="desktop" onPick={handlePick} />
        <HeroHeader onLaunch={scrollToMachine} />
      </div>

      {/* Mobile hero */}
      <div className="lg:hidden flex flex-col items-center max-w-md mx-auto relative justify-center pt-6 mb-12">
        <HeroArc variant="mobile" onPick={handlePick} />
        <HeroHeader compact onLaunch={scrollToMachine} />
      </div>

    </section>
  );
};
