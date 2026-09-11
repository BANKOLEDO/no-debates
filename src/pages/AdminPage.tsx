import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useQuery } from 'convex/react';
import { convexClient } from '../lib/convexClient';
import { sound } from '../audio/sound';
import { DecisionRecord } from '../types';

interface AdminPageProps {
  history: DecisionRecord[];
  templatesEdited: number;
  onBack: () => void;
}

interface Overview {
  rooms: number;
  open: number;
  locked: number;
  options: number;
  members: number;
  byDay: Record<string, number>;
}

// Private dashboard at #/nodb-admin. Aggregates only, no room content.
export const AdminPage: React.FC<AdminPageProps> = ({ history, templatesEdited, onBack }) => {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">
          <button
            onClick={() => {
              sound.tap();
              onBack();
            }}
            className="flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors mb-7"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Home</span>
          </button>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent mb-3">
            Private · Aggregates only
          </p>
          <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight">
            Usage overview
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Counts and trends. No questions, options, or names ever leave the database.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-3">
        <BackendPanels />
        <div className="bg-white rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-3">
            This device
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="My spins" value={String(history.length)} />
            <Stat label="Templates customized" value={String(templatesEdited)} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
            Traffic
          </p>
          <p className="text-[13px] text-ink-600 leading-relaxed">
            Page views and visitors live in the Vercel Analytics dashboard for this project, not here.
          </p>
        </div>
      </div>
    </div>
  );
};

function BackendPanels() {
  if (!convexClient) {
    return (
      <div className="bg-white rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
          Squad backend
        </p>
        <p className="text-[13px] text-ink-600 leading-relaxed">
          Offline. Set <span className="font-mono">VITE_CONVEX_URL</span> to light up live room stats.
        </p>
      </div>
    );
  }
  return <LiveBackendPanels />;
}

function LiveBackendPanels() {
  const data = useQuery('analytics:overview' as any, {}) as Overview | undefined;

  if (data === undefined) {
    return (
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-bold text-ink-400">Loading backend stats…</p>
      </div>
    );
  }

  const days = Object.keys(data.byDay)
    .sort()
    .slice(-14);
  const peak = Math.max(1, ...days.map((d) => data.byDay[d]));

  return (
    <>
      <div className="bg-ink-900 text-white rounded-2xl px-2 py-5 grid grid-cols-3 text-center">
        <div>
          <div className="font-display font-black tracking-tight text-[28px] leading-none">
            {data.rooms}
          </div>
          <div className="text-[11px] font-bold text-white/50 mt-1.5">Squad rooms</div>
        </div>
        <div className="border-l border-white/10">
          <div className="font-display font-black tracking-tight text-[28px] leading-none">
            {data.locked}
          </div>
          <div className="text-[11px] font-bold text-white/50 mt-1.5">Decided</div>
        </div>
        <div className="border-l border-white/10">
          <div className="font-display font-black tracking-tight text-[28px] leading-none">
            {data.open}
          </div>
          <div className="text-[11px] font-bold text-white/50 mt-1.5">Still open</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-3">
          Participation
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Options added" value={String(data.options)} />
          <Stat label="Players joined" value={String(data.members)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-3">
          Rooms per day · last 14
        </p>
        {days.length === 0 ? (
          <p className="text-[13px] text-ink-400">No rooms yet.</p>
        ) : (
          <div className="flex items-end gap-1.5 h-24">
            {days.map((day) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <span className="text-[10px] font-bold text-ink-500 tabular-nums">
                  {data.byDay[day]}
                </span>
                <div
                  className="w-full rounded-md bg-accent"
                  style={{ height: `${Math.max(6, (data.byDay[day] / peak) * 64)}px` }}
                />
                <span className="text-[9px] text-ink-400 tabular-nums">
                  {day.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-canvas rounded-xl px-3 py-4 text-center">
      <div className="font-display font-black tracking-tight text-2xl leading-none text-ink-900">
        {value}
      </div>
      <div className="text-[11px] font-bold text-ink-500 mt-1.5">{label}</div>
    </div>
  );
}
