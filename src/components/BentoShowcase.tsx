import React, { useState } from 'react';
import { 
  DocumentDuplicateIcon, 
  CheckIcon, 
  LinkIcon, 
  SpeakerWaveIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';
import { LogoMark } from './Logo';
import { Rise } from './Reveal';
import { getDiceBearAvatar, DiceBearStyle } from '../utils/dicebear';

const SAMPLE_AVATAR_STYLES: { id: DiceBearStyle; label: string }[] = [
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'bottts', label: 'Bottts' },
  { id: 'notionists', label: 'Notionists' },
  { id: 'fun-emoji', label: 'Fun Emoji' }
];

export const BentoShowcase: React.FC = () => {
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DiceBearStyle>('lorelei');
  const [seedName, setSeedName] = useState<string>('Felix');

  const handleTestSound = (type: 'click' | 'tick' | 'success') => {
    setActiveSound(type);
    if (type === 'click') sound.click();
    if (type === 'tick') sound.tick(1.2);
    if (type === 'success') sound.win();
    setTimeout(() => setActiveSound(null), 300);
  };

  const handleCopyDemo = async () => {
    sound.click();
    await navigator.clipboard.writeText(`${window.location.origin}/#eyJxIjoiV2hlcmUgdG8gZWF0PyIsInYiOiJSYW1lbiJ9`);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <section id="ledger" className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <Rise className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white border border-ink-200 text-xs font-bold text-ink-700 mb-3">
          <span>The Ledger & Audio Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 mb-2">
          No signups. No bias. Just the verdict.
        </h2>
        <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
          True randomness with tactile physical audio feedback.
        </p>
      </Rise>

      {/* Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Receipt */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-ink-400 mb-2">
              <DocumentDuplicateIcon className="w-4 h-4" />
              <span className="uppercase tracking-wider">OFFICIAL DECISION RECEIPT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-2">
              Clean receipt format everyone respects
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-w-lg">
              Generates an itemized verdict stamp with timestamp, hash code, and winning avatar. Ready to paste directly into WhatsApp, Telegram, or iMessage.
            </p>
          </div>

          {/* Receipt preview */}
          <div className="bg-canvas border border-ink-200 rounded-2xl p-5 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-ink-200 pb-2.5">
              <div className="flex items-center space-x-2">
                <LogoMark className="w-5 h-5" />
                <span className="font-extrabold text-ink-900 text-xs tracking-wider uppercase">NO DEBATES VERDICT</span>
              </div>
              <span className="text-[10px] text-ink-400">TODAY // 8:42 PM</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-500 font-sans">Question:</span>
              <span className="font-bold text-ink-900 font-sans">"Friday Dinner Spot"</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-ink-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={getDiceBearAvatar('Woodfire Pizza', 'bottts', 36)} 
                  alt="Winner Avatar" 
                  className="w-8 h-8 rounded-lg bg-sand-light p-0.5"
                />
                <div>
                  <span className="text-[9px] uppercase font-bold text-ink-400 block leading-none">VERDICT</span>
                  <span className="text-sm font-extrabold uppercase text-accent leading-tight">Woodfire Pizza</span>
                </div>
              </div>
              <span className="bg-accent-soft text-accent text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-accent/20">
                SEALED
              </span>
            </div>

            <div className="pt-2 border-t border-dashed border-ink-200 flex items-center justify-between text-[10px] text-ink-400">
              <span>HASH: #nd-9481a</span>
              <span className="text-emerald-600 font-bold">100% UNBIASED</span>
            </div>
          </div>
        </div>

        {/* Avatars */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 mb-2">
              <SparklesIcon className="w-4 h-4" />
              <span className="uppercase tracking-wider">DICEBEAR AVATARS</span>
            </div>
            <h3 className="text-lg font-bold text-ink-900 mb-1">
              Personalized Avatars
            </h3>
            <p className="text-xs text-ink-600 leading-relaxed">
              Every person & choice gets a deterministic SVG avatar generated live with DiceBear.
            </p>
          </div>

          {/* Avatar playground */}
          <div className="bg-canvas border border-ink-200 rounded-2xl p-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-ink-200 p-2 mb-3 flex items-center justify-center">
              <img 
                src={getDiceBearAvatar(seedName, selectedStyle, 80)} 
                alt={seedName}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {SAMPLE_AVATAR_STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    sound.tap();
                    setSelectedStyle(st.id);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                    selectedStyle === st.id 
                      ? 'bg-ink-900 text-white' 
                      : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <input 
              type="text"
              value={seedName}
              onChange={(e) => setSeedName(e.target.value)}
              placeholder="Type any name..."
              className="w-full bg-white border border-ink-200 rounded-xl px-2.5 py-1 text-xs text-center font-bold text-ink-900 focus:outline-none focus:border-ink-900"
            />
          </div>
        </div>

        {/* Proof link */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 mb-2">
              <LinkIcon className="w-4 h-4" />
              <span className="uppercase tracking-wider">URL ENCODING</span>
            </div>
            <h3 className="text-lg font-bold text-ink-900 mb-1">
              Zero Database Required
            </h3>
            <p className="text-xs text-ink-600 leading-relaxed">
              The entire question and verdict is compressed directly into the URL hash.
            </p>
          </div>

          <div className="bg-canvas border border-ink-200 rounded-xl p-3 text-[11px] font-mono text-ink-500 break-all">
            <div className="text-[10px] text-ink-400 font-bold mb-1">Sample Proof URL:</div>
            <div className="text-ink-800 truncate font-semibold">{window.location.host}/#eyJxIjoiRG...</div>
          </div>

          <button
            onClick={handleCopyDemo}
            className="w-full bg-ink-900 hover:bg-ink-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
          >
            {copiedDemo ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
            <span>{copiedDemo ? 'Copied to Clipboard!' : 'Copy Sample Link'}</span>
          </button>
        </div>

        {/* Sounds */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600">
              <SpeakerWaveIcon className="w-4 h-4" />
              <span className="uppercase tracking-wider">PHYSICAL WEB AUDIO</span>
            </div>
            <h3 className="text-xl font-bold text-ink-900">
              Tactile sounds crafted for every action
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              Synthesized purely via Web Audio API. Low-latency ticks, coin drops, and victory chimes.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleTestSound('click')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                activeSound === 'click' ? 'bg-ink-900 text-white border-ink-900' : 'bg-canvas text-ink-700 border-ink-200 hover:bg-ink-100'
              }`}
            >
              Click
            </button>
            <button
              onClick={() => handleTestSound('tick')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                activeSound === 'tick' ? 'bg-ink-900 text-white border-ink-900' : 'bg-canvas text-ink-700 border-ink-200 hover:bg-ink-100'
              }`}
            >
              Tick
            </button>
            <button
              onClick={() => handleTestSound('success')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                activeSound === 'success' ? 'bg-accent text-white border-accent' : 'bg-canvas text-ink-700 border-ink-200 hover:bg-ink-100'
              }`}
            >
              Fanfare
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
