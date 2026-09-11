import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, PlusIcon, ShareIcon, TicketIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { SpinWheel } from '../components/SpinWheel';
import { convexClient } from '../lib/convexClient';
import { useRoom, useSquadActions } from '../lib/squadApi';
import { useToast } from '../components/Toaster';
import { sound } from '../audio/sound';
import { getDiceBearAvatar } from '../utils/dicebear';

interface RitualPack {
  id: string;
  label: string;
  question: string;
  optionHint: string;
}

// Workplace ritual presets: one tap fills the room, add your own options
const RITUAL_PACKS: RitualPack[] = [
  {
    id: 'lunch',
    label: 'Lunch lottery',
    question: 'Where are we eating?',
    optionHint: 'Ramen Bowl',
  },
  {
    id: 'demo',
    label: 'Demo roulette',
    question: 'Who presents the demo this sprint?',
    optionHint: 'Your name',
  },
  {
    id: 'oncall',
    label: 'On-call lottery',
    question: 'Who is on call tonight?',
    optionHint: 'Your name',
  },
  {
    id: 'retro',
    label: 'Retro roulette',
    question: 'What is the first retro topic?',
    optionHint: 'Sprint pace',
  },
  {
    id: 'standup',
    label: 'Standup order',
    question: 'Who kicks off standup?',
    optionHint: 'Your name',
  },
];

interface SquadScreenProps {
  roomId: string | null;
  onOpenRoom: (id: string) => void;
  onViewReceipt: (question: string, options: string[], verdict: string) => void;
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

const SquadPage: React.FC<SquadScreenProps> = ({ roomId, onOpenRoom, onViewReceipt, onBack }) => {
  if (!roomId) {
    return <SquadLobby onOpenRoom={onOpenRoom} onBack={onBack} />;
  }
  return <SquadRoom roomId={roomId} onOpenRoom={onOpenRoom} onViewReceipt={onViewReceipt} onBack={onBack} />;
};

// Create a room
function SquadLobby({ onOpenRoom, onBack }: { onOpenRoom: (id: string) => void; onBack: () => void }) {
  const { createRoom } = useSquadActions();
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [option, setOption] = useState('');
  const [optionHint, setOptionHint] = useState('Ramen Bowl');
  const [busy, setBusy] = useState(false);
  const lastName = savedName();

  const applyRitual = (pack: RitualPack) => {
    sound.tap();
    setQuestion(pack.question);
    setOptionHint(pack.optionHint);
  };

  const create = async () => {
    if (!question.trim() || !option.trim() || busy) return;
    sound.click();
    setBusy(true);
    try {
      const who = name.trim() || lastName || 'Player 1';
      try {
        localStorage.setItem(NAME_KEY, who);
      } catch {
        // noop
      }
      const id = await createRoom({
        question: question.trim(),
        name: who,
        option: option.trim(),
      });
      onOpenRoom(id);
    } catch {
      toast.error({
        title: 'Could not create the room',
        message: 'Check your connection and try again.',
      });
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
            <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-2">
              Start from a ritual
            </label>
            <div className="flex flex-wrap gap-2">
              {RITUAL_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => applyRitual(pack)}
                  className={`text-[12px] font-bold rounded-full px-3.5 py-2 border transition-colors ${
                    question === pack.question
                      ? 'bg-ink-900 border-ink-900 text-white'
                      : 'bg-canvas border-ink-200 text-ink-700 hover:border-ink-900'
                  }`}
                >
                  {pack.label}
                </button>
              ))}
            </div>
          </div>
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
                placeholder={lastName || 'Alex'}
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
                placeholder={optionHint}
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
  onViewReceipt,
  onBack,
}: {
  roomId: string;
  onOpenRoom: (id: string) => void;
  onViewReceipt: (question: string, options: string[], verdict: string) => void;
  onBack: () => void;
}) {
  const room = useRoom(roomId);
  const { addOption, spinRoom } = useSquadActions();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [option, setOption] = useState('');
  const [spinRequest, setSpinRequest] = useState<{ winnerIndex: number; nonce: number } | null>(null);
  const prevStatus = useRef<string | undefined>(undefined);
  const lastName = savedName();

  void onOpenRoom;

  // Animate the wheel for everyone watching when the verdict locks
  useEffect(() => {
    if (!room || room.status !== 'locked' || !room.verdict) {
      prevStatus.current = room?.status;
      return;
    }
    if (prevStatus.current === 'open') {
      const idx = room.options.indexOf(room.verdict);
      if (idx >= 0) setSpinRequest({ winnerIndex: idx, nonce: Date.now() });
    }
    prevStatus.current = room.status;
  }, [room]);

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
  const myRawName = name.trim() || lastName;
  const myName = myRawName || 'Friend';
  const isCreator = myRawName === room.createdBy;
  const link = `${window.location.origin}${window.location.pathname}#/squad/${roomId}`;

  const submitOption = async () => {
    if (!option.trim() || room.options.length >= 12) return;
    sound.tap();
    const who = name.trim() || lastName || 'Friend';
    try {
      localStorage.setItem(NAME_KEY, who);
    } catch {
      // noop
    }
    try {
      await addOption({ roomId, name: who, option: option.trim() });
      setOption('');
    } catch {
      toast.error({
        title: 'Could not add your option',
        message: 'Check your connection and try again.',
      });
    }
  };

  const copyLink = async () => {
    sound.tap();
    try {
      await navigator.clipboard.writeText(link);
      toast.success({ title: 'Invite link copied' });
    } catch {
      toast.error({
        title: 'Could not copy automatically',
        message: 'Copy the link below instead.',
      });
    }
  };

  const spin = async () => {
    sound.coin();
    try {
      await spinRoom(roomId, myName);
      sound.win();
    } catch {
      toast.error({
        title: 'Could not lock the verdict',
        message: 'Only the room creator can seal the spin.',
      });
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
            <span>Copy invite link</span>
          </button>
          <button
            onClick={() => {
              sound.tap();
              const liveUrl = `${window.location.origin}/e/${roomId}`;
              window.open(liveUrl, '_blank', 'noopener');
            }}
            className="ml-2 mt-5 h-11 px-5 rounded-full bg-accent text-ink-900 text-[13px] font-bold inline-flex items-center gap-2 hover:bg-accent/90"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            <span>Present on live screen</span>
          </button>
          <p className="mt-2.5 font-mono text-[11px] text-white/40 break-all">
            {link}
          </p>
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
                placeholder={lastName || 'Your name'}
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

        {/* Live wheel, spins for everyone on lock */}
        {room.options.length >= 2 && (
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center">
            <SpinWheel
              options={room.options}
              verdict={locked ? room.verdict ?? null : null}
              request={spinRequest}
              onTick={() => sound.tick()}
              onSettled={() => {}}
            />
          </div>
        )}

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
                onViewReceipt(room.question, room.options, room.verdict as string);
              }}
              className="mt-4 h-11 px-6 rounded-full bg-white text-ink-900 text-[13px] font-bold inline-flex items-center gap-2"
            >
              <TicketIcon className="w-4 h-4" />
              <span>View sealed receipt</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={spin}
              disabled={room.options.length < 2 || !isCreator}
              className="btn-accent w-full h-[52px] text-[15px] font-extrabold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>
                {isCreator
                  ? `Spin for the squad (${room.options.length})`
                  : 'Spin is locked to the creator'}
              </span>
            </button>
            {!isCreator && (
              <p className="text-center text-[12px] font-bold text-ink-500">
                Only {room.createdBy} can seal the verdict.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
