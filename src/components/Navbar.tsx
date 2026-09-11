import React from 'react';
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ClockIcon,
  BoltIcon,
  UsersIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';
import { Logo } from './Logo';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onGoHome: () => void;
  onGoSection: (id: string) => void;
  onGoMachine: () => void;
  onOpenSpeed: () => void;
  onGoSquad: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  onOpenHistory,
  historyCount,
  onGoHome,
  onGoSection,
  onGoMachine,
  onOpenSpeed,
  onGoSquad,
  activeSection
}) => {
  const link = (id: string) => () => {
    sound.tap();
    onGoSection(id);
  };

  const links: [string, string][] = [
    ['ledger', 'How It Works'],
    ['scenarios', 'Scenarios'],
    ['faq', 'FAQ'],
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-2 bg-canvas">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Brand Identity */}
        <button
          onClick={onGoHome}
          className="text-left focus:outline-none flex items-center"
        >
          <Logo size="md" />
        </button>

        {/* Section links with scroll-spy */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-ink-600">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={link(id)}
              className={`relative pb-0.5 transition-colors ${activeSection === id ? 'text-ink-900' : 'hover:text-ink-900'}`}
            >
              {label}
              {activeSection === id && (
                <span className="absolute -bottom-[3px] left-0 right-0 h-[2px] bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio Toggle */}
          <button
            onClick={() => {
              sound.tap();
              onToggleMute();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-500 hover:text-ink-900 bg-ink-50/80 hover:bg-ink-100 border border-ink-100 transition-all focus:outline-none"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-4 h-4 text-ink-400" />
            ) : (
              <SpeakerWaveIcon className="w-4 h-4 text-accent" />
            )}
          </button>

          {/* Decision Ledger Drawer Trigger */}
          <button
            onClick={() => {
              sound.tap();
              onOpenHistory();
            }}
            className="h-9 px-3.5 rounded-full text-xs font-bold text-ink-700 hover:text-ink-900 bg-ink-50/80 hover:bg-ink-100 border border-ink-100 transition-all hidden sm:flex items-center space-x-1.5"
          >
            <ClockIcon className="w-3.5 h-3.5 text-ink-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="bg-ink-900 text-white px-1.5 py-0.5 rounded-full text-[10px] font-extrabold leading-none">
                {historyCount}
              </span>
            )}
          </button>

          {/* Squad (desktop; mobile uses the bottom tab bar) */}
          <button
            onClick={() => {
              sound.tap();
              onGoSquad();
            }}
            className="hidden md:flex h-9 px-3.5 rounded-full text-xs font-bold text-ink-700 hover:text-ink-900 bg-ink-50/80 hover:bg-ink-100 border border-ink-100 transition-all items-center space-x-1.5"
          >
            <UsersIcon className="w-3.5 h-3.5 text-ink-400" />
            <span>Squad</span>
          </button>

          {/* Speed round (desktop; also on the machine header) */}
          <button
            onClick={() => {
              sound.tap();
              onOpenSpeed();
            }}
            className="hidden md:flex h-9 px-3.5 rounded-full text-xs font-bold text-ink-700 hover:text-ink-900 bg-ink-50/80 hover:bg-ink-100 border border-ink-100 transition-all items-center space-x-1.5"
          >
            <BoltIcon className="w-3.5 h-3.5 text-ink-400" />
            <span>Speed</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              sound.click();
              onGoMachine();
            }}
            className="btn-primary text-xs px-4 h-9 flex items-center space-x-1.5"
          >
            <span>Spin Now</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>

      </nav>
    </header>
  );
};
