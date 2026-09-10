import React from 'react';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DecisionRecord } from '../types';
import { sound } from '../audio/sound';
import { getDiceBearAvatar } from '../utils/dicebear';

interface HistoryPageProps {
  history: DecisionRecord[];
  onSelectRecord: (rec: DecisionRecord) => void;
  onClearHistory: () => void;
  onBack: () => void;
}

// Standalone history page, dark CTA backdrop on top
export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectRecord,
  onClearHistory,
  onBack,
}) => {
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
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight">
                History
              </h1>
              <p className="text-sm text-white/60 mt-2">
                {history.length === 0
                  ? 'Nothing saved yet. Go spin the machine.'
                  : `${history.length} past verdict${history.length === 1 ? '' : 's'}, stored only in this browser.`}
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => {
                  sound.tap();
                  onClearHistory();
                }}
                className="shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-white/60 hover:text-white border border-white/20 rounded-full px-3.5 py-2"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-sm text-ink-400">
            No verdicts on record. Your spins will show up here.
          </div>
        ) : (
          <>
            <StatsStrip history={history} />
            <div className="space-y-2.5">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sound.tap();
                  onSelectRecord(item);
                }}
                className="w-full text-left bg-white rounded-2xl p-4 active:scale-[0.99] transition-transform"
              >
                <div className="text-[11px] text-ink-400 mb-1">
                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' · '}
                  {item.options.length} options
                </div>
                <div className="text-sm font-bold text-ink-900 line-clamp-1 mb-2">
                  {item.question}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-ink-100">
                  <img
                    src={getDiceBearAvatar(item.verdict, 'bottts', 24)}
                    alt=""
                    className="w-5 h-5 rounded-full bg-canvas"
                  />
                  <span className="text-[13px] font-extrabold text-accent">
                    {item.verdict}
                  </span>
                </div>
              </button>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Settled count, weekly pace, day streak
function StatsStrip({ history }: { history: DecisionRecord[] }) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = history.filter((h) => h.timestamp >= weekAgo).length;

  const days = new Set(history.map((h) => new Date(h.timestamp).toDateString()));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const stats: [string, string][] = [
    [String(history.length), history.length === 1 ? 'Debate settled' : 'Debates settled'],
    [String(thisWeek), 'This week'],
    [String(streak), 'Day streak'],
  ];

  return (
    <div className="bg-ink-900 text-white rounded-2xl px-2 py-5 mb-3 grid grid-cols-3 text-center">
      {stats.map(([value, label], i) => (
        <div key={label} className={i > 0 ? 'border-l border-white/10' : ''}>
          <div className="font-display font-black tracking-tight text-[28px] leading-none">
            {value}
          </div>
          <div className="text-[11px] font-bold text-white/50 mt-1.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
