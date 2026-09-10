import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';

// Short, honest privacy policy
export const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">
          <button
            onClick={() => {
              sound.tap();
              onBack();
            }}
            className="flex items-center gap-1.5 text-[13px] font-bold text-white/70 hover:text-white mb-7"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Home</span>
          </button>
          <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight">
            Privacy
          </h1>
          <p className="text-sm text-white/60 mt-2">Last updated September 2026.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5 text-sm text-ink-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-ink-900 mb-1">Nothing leaves your device</h2>
            <p>No accounts, no cookies, no analytics, no tracking pixels. There is no server collecting your decisions.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">What is stored</h2>
            <p>Your past verdicts live in your browser's local storage, on your device only. Clearing your browser data erases them for good.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">Shared links</h2>
            <p>Proof links encode the question and verdict inside the URL itself. Anyone with the link can read it. Only share what you're comfortable sharing.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">Third parties</h2>
            <p>Images and fonts load from third-party CDNs (Unsplash, Google Fonts), which may see basic request data per their own policies.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
