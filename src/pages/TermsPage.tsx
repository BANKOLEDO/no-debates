import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';

// Short, honest terms
export const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Terms
          </h1>
          <p className="text-sm text-white/60 mt-2">Last updated September 2026.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5 text-sm text-ink-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-ink-900 mb-1">What this is</h2>
            <p>No Debates is a free decision helper. It picks randomly from the options you type. Results are for fun and settling friendly debates.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">Fair use</h2>
            <p>Don't use verdicts for gambling, lotteries, legal disputes, medical choices, or anything with real stakes. Random is random. It owes you nothing.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">Your content</h2>
            <p>Solo spins keep your questions and options in your browser. Squad rooms are shared by design — see the next section. Anonymized page-view counts (page name, day, count) are stored for our traffic dashboard.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">Squad rooms</h2>
            <p>Room links are unlisted but open to anyone who has them. Don't post anything illegal, hateful, or personal in a room. We may remove rooms that abuse the service.</p>
          </section>
          <section>
            <h2 className="font-bold text-ink-900 mb-1">As-is</h2>
            <p>The app is provided as-is, without warranties. If a verdict sends you to a bad taco, that's between you and the taco.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
