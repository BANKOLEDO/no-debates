import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, PlusIcon, ShareIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { convexClient } from '../lib/convexClient';
import { useRoom, useSquadActions } from '../lib/squadApi';
import { sound } from '../audio/sound';
import { getDiceBearAvatar } from '../utils/dicebear';

interface SquadScreenProps {
  roomId: string | null;
  onOpenRoom: (id: string) => void;
  onOpenInMachine: (question: string, options: string[], verdict: string) => void;
  onBack: () => void;
}

const NAME_KEY = 'nd_squad_name';

const savedName = () => {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
};

// Gate: squad needs a Convex backend URL
export const SquadScreen: React.FC<SquadScreenProps> = (props) => {
  if (!convexClient) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="bg-ink-900 text-white">
          <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">
            <button
              onClick={() => {
                sound.tap();
                props.onBack();
              }}
              className="flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors mb-7"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Home</span>
            </button>
            <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight">
              Squad spins aren't live yet<span className="text-accent">.</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed mt-3 max-w-md">
              Multiplayer rooms need a backend. Run <span className="font-mono text-white">npx convex dev</span> once,
              add the URL it prints as <span className="font-mono text-white">VITE_CONVEX_URL</span>, and redeploy.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return <SquadPage {...props} />;
};

const SquadPage: React.FC<SquadScreenProps> = ({ roomId, onOpenRoom, onOpenInMachine, onBack }) => {
  if (!roomId) {
    return <SquadLobby onOpenRoom={onOpenRoom} onBack={onBack} />;
  }
  return <SquadRoom roomId={roomId} onOpenRoom={onOpenRoom} onOpenInMachine={onOpenInMachine} onBack={onBack} />;
};

// Create a room
function SquadLobby({ onOpenRoom, onBack }: { onOpenRoom: (id: string) => void; onBack: () => void }) {
  const { createRoom } = useSquadActions();
  const [question, setQuestion] = useState('');
  const [name, setName] = useState(savedName);
  const [option, setOption] = useState('');
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!question.trim() || !option.trim() || busy) return;
    sound.click();
    setBusy(true);
    try {
      try {
        localStorage.setItem(NAME_KEY, name.trim() || 'Player 1');
      } catch {
        // noop
      }
      const id = await createRoom({
        question: question.trim(),
        name: name.trim() || 'Player 1',
        option: option.trim(),
      });
      onOpenRoom(id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-16">
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
            Squad spin
          </p>
          <h1 className="font-display font-black tracking-tight text-4xl sm:text-5xl leading-[1.02]">
            Everyone picks<span className="text-accent">.</span>
            <span className="block">Machine decides.</span>
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed mt-3 max-w-md">
            Start a room, share the link, friends add their options. Spin once it's full.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-10">
        <div className="bg-white rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
              The question
            </label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Where are we eating tonight?"
              className="w-full bg-canvas text-ink-900 font-bold text-base rounded-xl px-4 py-3 border border-ink-200 focus:border-ink-900 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className="w-full bg-canvas text-ink-900 font-bold text-sm rounded-xl px-4 py-3 border border-ink-200 focus:border-ink-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
                Your option
              </label>
              <input
                value={option}
                onChange={(e) => setOption(e.target.value)}
                placeholder="Ramen Bowl"
                className="w-full bg-canvas text-ink-900 font-bold text-sm rounded-xl px-4 py-3 border border-ink-200 focus:border-ink-900 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={create}
            disabled={!question.trim() || !option.trim() || busy}
            className="btn-accent w-full h-12 text-sm disabled:opacity-40"
          >
            {busy ? 'Creating room…' : 'Create room + share link'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Live room
function SquadRoom({
  roomId,
  onOpenRoom,
  onOpenInMachine,
  onBack,
}: {
  roomId: string;
  onOpenRoom: (id: string) => void;
  onOpenInMachine: (question: string, options: string[], verdict: string) => void;
  onBack: () => void;
}) {
  const room = useRoom(roomId);
  const { addOption, spinRoom } = useSquadActions();
  const [name, setName] = useState(savedName);
  const [option, setOption] = useState('');
  const [copied, setCopied] = useState(false);

  void onOpenRoom;

  if (room === undefined) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-sm font-bold text-ink-400">Loading room…</p>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display font-black text-3xl text-ink-900 mb-2">Room not found</h1>
          <p className="text-sm text-ink-500 mb-6">This invite link is stale or mistyped.</p>
          <button onClick={onBack} className="btn-primary h-11 px-6 text-sm">
            Back home
          </button>
        </div>
      </div>
    );
  }

  const locked = room.status === 'locked';
  const link = `${window.location.origin}${window.location.pathname}#/squad/${roomId}`;

  const submitOption = async () => {
    if (!option.trim() || room.options.length >= 12) return;
    sound.tap();
    try {
      localStorage.setItem(NAME_KEY, name.trim() || 'Friend');
    } catch {
      // noop
    }
    await addOption({ roomId, name: name.trim() || 'Friend', option: option.trim() });
    setOption('');
  };

  const copyLink = async () => {
    sound.tap();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  const spin = async () => {
    sound.coin();
    await spinRoom(roomId);
    sound.win();
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-16">
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
            {locked ? 'Verdict locked' : `Waiting on the squad · ${room.members.length} in`}
          </p>
          <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight break-words">
            {room.question}
          </h1>
          <button
            onClick={copyLink}
            className="mt-5 h-11 px-5 rounded-full bg-white/10 text-white text-[13px] font-bold flex items-center gap-2 hover:bg-white/15"
          >
            <ShareIcon className="w-4 h-4" />
            <span>{copied ? 'Invite link copied!' : 'Copy invite link'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-10 space-y-3">
        {/* Members */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-2">
            Squad ({room.members.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {room.members.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 bg-canvas text-ink-800 text-[12px] font-bold px-2.5 py-1.5 rounded-full"
              >
                <img src={getDiceBearAvatar(m, 'lorelei', 24)} alt="" className="w-4 h-4 rounded-full" />
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-2">
            Options ({room.options.length}/12)
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {room.options.map((opt) => (
              <span
                key={opt}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-bold ${
                  locked && room.verdict === opt
                    ? 'bg-accent text-white'
                    : 'bg-canvas text-ink-800'
                }`}
              >
                {opt}
              </span>
            ))}
          </div>

          {!locked && (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-canvas text-sm font-bold rounded-xl px-3.5 py-2.5 border border-ink-200 focus:border-ink-900 focus:outline-none"
              />
              <input
                value={option}
                onChange={(e) => setOption(e.target.value)}
                placeholder="Add your option…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitOption();
                }}
                className="bg-canvas text-sm font-bold rounded-xl px-3.5 py-2.5 border border-ink-200 focus:border-ink-900 focus:outline-none"
              />
              <button
                onClick={submitOption}
                disabled={!option.trim()}
                className="bg-ink-900 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Verdict / spin */}
        {locked && room.verdict ? (
          <div className="bg-ink-900 text-white rounded-2xl p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
              The squad has spoken
            </p>
            <p className="font-display font-black tracking-tight text-3xl text-accent mt-1">
              {room.verdict}
            </p>
            <button
              onClick={() => {
                sound.click();
                onOpenInMachine(room.question, room.options, room.verdict as string);
              }}
              className="mt-4 h-11 px-6 rounded-full bg-white text-ink-900 text-[13px] font-bold inline-flex items-center gap-2"
            >
              <span>Open in the machine</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={spin}
            disabled={room.options.length < 2}
            className="btn-accent w-full h-[52px] text-[15px] font-extrabold flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Spin for the squad ({room.options.length})</span>
          </button>
        )}
      </div>
    </div>
  );
}
