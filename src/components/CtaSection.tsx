import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';

export const CtaSection: React.FC<{ onScrollToApp: () => void }> = ({ onScrollToApp }) => {
  return (
    <section className="py-10 px-4 text-center max-w-5xl mx-auto">
      <div className="bg-ink-900 text-white rounded-2xl p-8 sm:p-14 space-y-6 relative overflow-hidden">
        {/* Background ambient pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Zero Indecision</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight">
          Ready to settle today's group debate?
        </h2>

        <p className="text-sm sm:text-base text-ink-300 max-w-md mx-auto leading-relaxed">
          Open the decider, type your choices, and get an answer before everyone gets hungry.
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              sound.click();
              onScrollToApp();
            }}
            className="btn-accent text-sm px-8 py-4 inline-flex items-center space-x-2.5 active:scale-[0.98] transition-transform"
          >
            <span>Launch The Decider</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
