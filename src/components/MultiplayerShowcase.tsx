import React from 'react';
import {
  UsersIcon,
  BoltIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';
import { Rise } from './Reveal';

interface MultiplayerShowcaseProps {
  onGoSquad: () => void;
  onGoSpeed: () => void;
}

const CODE_STYLE = 'font-mono text-[11px] leading-relaxed bg-canvas border border-ink-200 rounded-xl px-3.5 py-3 text-ink-500 break-all';

// Squad, speed round, live screen, and the flip API — the newer ways to settle it
export const MultiplayerShowcase: React.FC<MultiplayerShowcaseProps> = ({ onGoSquad, onGoSpeed }) => {
  return (
    <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
      <Rise className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white border border-ink-200 text-xs font-bold text-ink-700 mb-3">
          <span>Decide with the whole room</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 mb-2">
          More ways to settle the debate.
        </h2>
        <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
          Solo machine, squad rooms, live screens, and a fair API. Same sealed verdict.
        </p>
      </Rise>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Squad spins */}
        <Rise delay={0.05}>
          <div className="h-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-accent mb-2">
                <UsersIcon className="w-4 h-4" />
                <span className="uppercase tracking-wider">Squad Spins</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-2">
                Friends add options. Only the creator spins.
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Start a room, share the invite link, and let everyone throw in their pick live.
                Everyone watches the same wheel lock in — no leader to blame.
              </p>
            </div>
            <button
              onClick={() => {
                sound.tap();
                onGoSquad();
              }}
              className="w-full bg-ink-900 hover:bg-ink-800 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Start a squad spin</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-accent" />
            </button>
          </div>
        </Rise>

        {/* Speed round */}
        <Rise delay={0.1}>
          <div className="h-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-accent mb-2">
                <BoltIcon className="w-4 h-4" />
                <span className="uppercase tracking-wider">Speed Round</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-2">
                Rapid duels, one champion.
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Serial head-to-head spins with a running tally. Best win-count takes the sprint —
                built for streams, classrooms, and anything on a big screen.
              </p>
            </div>
            <button
              onClick={() => {
                sound.tap();
                onGoSpeed();
              }}
              className="w-full bg-ink-900 hover:bg-ink-800 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Run a speed round</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-accent" />
            </button>
          </div>
        </Rise>

        {/* Live screen */}
        <Rise delay={0.05}>
          <div className="h-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-ink-400 mb-2">
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                <span className="uppercase tracking-wider">Present It Live</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-2">
                Any squad room becomes a live board.
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Pop the room onto OBS, a projector, or an iframe. It's chromeless, reads from a
                distance, and stays in sync while the room fills and locks.
              </p>
            </div>
            <div className={CODE_STYLE}>
              no-debates.vercel.app
              <span className="text-accent">/e/</span>
              <span className="text-ink-800">&lt;roomId&gt;</span>
            </div>
          </div>
        </Rise>

        {/* Flip API */}
        <Rise delay={0.1}>
          <div className="h-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-ink-400 mb-2">
                <CodeBracketIcon className="w-4 h-4" />
                <span className="uppercase tracking-wider">Fair Flip API</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-2">
                A sealed verdict for your bots and scripts.
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                POST a question and options, get a fair random winner plus a verifiable receipt URL.
                Wire it into your workflow, no account needed.
              </p>
            </div>
            <div className={CODE_STYLE}>
              POST <span className="text-ink-800">/api/flip</span>{' '}
              <span className="text-ink-400">{`{ "question": "Who's on call?", "options": ["Sam","Rae"] }`}</span>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
};