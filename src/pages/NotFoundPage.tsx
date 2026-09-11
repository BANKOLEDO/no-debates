import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';

// Unknown pages land here
export const NotFoundPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="bg-ink-900 text-white flex-1 flex flex-col items-center justify-center text-center px-4 py-20 min-h-[70vh]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent mb-3">
        Error 404
      </p>
      <h1 className="font-display font-black tracking-tight text-6xl sm:text-7xl leading-[1.02]">
        Lost<span className="text-accent">?</span>
      </h1>
      <p className="text-[15px] text-white/60 leading-relaxed mt-3 max-w-xs">
        This page doesn't exist. The verdict: go back.
      </p>
      <button
        onClick={() => {
          sound.click();
          onBack();
        }}
        className="mt-8 h-12 px-6 rounded-full bg-white text-ink-900 text-sm font-bold inline-flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back home</span>
      </button>
    </div>
  );
};
