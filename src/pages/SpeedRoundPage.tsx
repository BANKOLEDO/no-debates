import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BoltIcon,
  PlusIcon,
  StopIcon,
  TrophyIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { SpinWheel } from '../components/SpinWheel';
import { sound } from '../audio/sound';
import { DecisionRecord } from '../types';

interface SpeedRoundPageProps {
  onSaveRecord: (record: DecisionRecord) => void;
  onOpenReceipt: (question: string, options: string[], verdict: string, timestamp: number) => void;
  onBack: () => void;
}

type Phase = 'setup' | 'round' | 'ended';

interface Round {
  pair: [string, string];
  winnerIndex: number;
  nonce: number;
}

// Rapid serial decisions: pair options head-to-head, tally runs,
// best streak wins. Built for streams and big screens.
export const SpeedRoundPage: React.FC<SpeedRoundPageProps> = ({
  onSaveRecord,
  onOpenReceipt,
  onBack,
}) => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [question, setQuestion] = useState('');
  const [pool, setPool] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [round, setRound] = useState<Round | null>(null);
  const [standings, setStandings] = useState<Record<string, number>>({});
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const roundTotal = useRef(0);

  const start = () => {
    if (pool.length < 4 || question.trim().length < 2) return;
    sound.click();
    roundTotal.current = 0;
    setStandings(Object.fromEntries(pool.map((o) => [o, 0])));
    setRoundsPlayed(0);
    setPhase('round');
    nextPair(false);
  };

  const nextPair = (playSound: boolean) => {
    const poolNow = pool;
    if (poolNow.length < 2) return;
    const i1 = Math.floor(Math.random() * poolNow.length);
    let i2 = Math.floor(Math.random() * (poolNow.length - 1));
    if (i2 >= i1) i2 += 1;
    if (playSound) sound.tap();
    setRound({ pair: [poolNow[i1], poolNow[i2]], winnerIndex: -1, nonce: Date.now() });
  };

  const handleSettled = (winnerIndex: number, roundSeed: Round) => {
    const winner = roundSeed.pair[winnerIndex];
    sound.win();
    setRound({ ...roundSeed, winnerIndex });
    setStandings((prev) => ({ ...prev, [winner]: (prev[winner] ?? 0) + 1 }));
    setRoundsPlayed((n) => n + 1);
    roundTotal.current += 1;
  };

  const endSprint = () => {
    sound.tap();
    const sorted = Object.entries(standings).sort((a, b) => b[1] - a[1]);
    setStandings(Object.fromEntries(sorted));
    setRound(null);
    setPhase('ended');
  };

  const lockChampion = () => {
    const champ = champEntry;
    if (!champ) return;
    sound.click();
    const ts = Date.now();
    const record: DecisionRecord = {
      id: Math.random().toString(36).substring(2, 9),
      question: `Speed round · ${question.trim() || 'Best of the sprint'}`,
      options: [...pool],
      verdict: champ,
      timestamp: ts,
      shareCode: '',
      coinCount: roundsPlayed,
    };
    onSaveRecord(record);
    onOpenReceipt(
      `Speed round · ${question.trim() || 'Best of the sprint'}`,
      pool,
      champ,
      ts
    );
  };

  useEffect(() => {
    if (phase !== 'round' || !round) return;
    if (round.winnerIndex >= 0) {
      const timer = setTimeout(() => nextPair(true), 700);
      return () => clearTimeout(timer);
    }
  }, [round, phase]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const champCandidate = phase === 'ended'
    ? Object.entries(standings).sort((a, b) => b[1] - a[1])[0]
    : null;
  const champEntry = champCandidate ? champCandidate[0] : '';

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                sound.tap();
                onBack();
              }}
              className="flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span className="flex items-center gap-1.5 text-[13px] font-extrabold tracking-tight">
              <BoltIcon className="w-4 h-4 text-accent" />
              Speed Round
            </span>
            <span className="w-14" />
          </div>

          {phase === 'round' && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent">
                Head-to-head · {roundsPlayed} decided
              </p>
              <button
                onClick={() => {
                  sound.tap();
                  endSprint();
                }}
                className="flex items-center gap-1.5 text-[12px] font-bold text-white/60 hover:text-white border border-white/15 rounded-full px-3 py-1.5"
              >
                <StopIcon className="w-3.5 h-3.5" />
                End sprint
              </button>
            </div>
          )}

          {phase !== 'round' && (
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Rapid-fire verdicts
            </p>
          )}

          <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight break-words mt-3">
            {question.trim() || 'Who stays standing?'}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 pb-12 space-y-3">
        {phase === 'setup' && (
          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
                The question
              </label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Who stays standing in this tournament?"
                className="w-full bg-canvas text-ink-900 font-bold text-base rounded-xl px-4 py-3 border border-ink-200 focus:border-ink-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-2">
                Contestants · {pool.length} (4–12)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {pool.map((o) => (
                  <span
                    key={o}
                    className="inline-flex items-center gap-1.5 bg-canvas rounded-full pl-3 pr-1 py-1 text-[13px] font-bold"
                  >
                    {o}
                    <button
                      onClick={() => {
                        sound.tap();
                        setPool(pool.filter((x) => x !== o));
                      }}
                      aria-label={`Remove ${o}`}
                      className="w-5 h-5 rounded-full hover:bg-ink-200 flex items-center justify-center text-ink-400"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = newOption.trim();
                      if (v && pool.length < 12 && !pool.includes(v)) {
                        sound.tap();
                        setPool([...pool, v]);
                        setNewOption('');
                      }
                    }
                  }}
                  placeholder="Add a contestant…"
                  className="flex-1 bg-canvas text-sm font-bold rounded-xl px-3.5 py-2.5 border border-ink-200 focus:border-ink-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const v = newOption.trim();
                    if (v && pool.length < 12 && !pool.includes(v)) {
                      sound.tap();
                      setPool([...pool, v]);
                      setNewOption('');
                    }
                  }}
                  disabled={!newOption.trim() || pool.length >= 12}
                  className="bg-ink-900 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>

            <button
              onClick={start}
              disabled={pool.length < 4 || question.trim().length < 2}
              className="btn-accent w-full h-12 text-sm disabled:opacity-40"
            >
              {pool.length < 4 ? 'Add at least 4 contestants' : 'Start speed round'}
            </button>
          </div>
        )}

        {phase === 'round' && round && (
          <>
            <div className="bg-white rounded-3xl p-6 flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-400 mb-4">
                Round {roundsPlayed + 1} · {round.pair[0]} vs {round.pair[1]}
              </p>
              <SpinWheel
                key={round.nonce}
                options={round.pair}
                verdict={round.winnerIndex >= 0 ? round.pair[round.winnerIndex] : null}
                request={
                  round.winnerIndex >= 0 ? null : { winnerIndex: Math.floor(Math.random() * 2), nonce: round.nonce }
                }
                onTick={() => sound.tick()}
                onSettled={(idx) => handleSettled(idx, round)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {round.pair.map((o) => (
                <div
                  key={o}
                  className={`rounded-2xl p-5 text-center ${
                    round.winnerIndex >= 0 && round.pair[round.winnerIndex] === o
                      ? 'bg-ink-900 text-white'
                      : 'bg-white'
                  }`}
                >
                  <p className="font-display font-black tracking-tight text-4xl text-accent">
                    {standings[o] ?? 0}
                  </p>
                  <p className="text-[13px] font-bold mt-1.5 break-words">{o}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-ink-400 mb-3">
                Standings
              </p>
              <div className="space-y-2">
                {Object.entries(standings)
                  .sort((a, b) => b[1] - a[1])
                  .map(([o, pts], i) => (
                    <div key={o} className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-ink-400 w-4">{i + 1}</span>
                      <span className="text-[13px] font-bold flex-1 truncate">{o}</span>
                      <span className="text-[13px] font-black tabular-nums text-ink-900">{pts}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {phase === 'ended' && champEntry && (
          <div className="bg-ink-900 text-white rounded-3xl p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-ink-900" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mt-4">
              Sprint champion · {roundsPlayed} rounds
            </p>
            <p className="font-display font-black tracking-tight text-5xl text-accent mt-2">
              {champEntry}
            </p>
            <p className="text-[13px] text-white/60 mt-3">
              {standings[champEntry]} wins · best of {pool.length} contestants
            </p>
            <div className="grid gap-2.5 mt-6">
              <button
                onClick={lockChampion}
                className="h-12 rounded-full bg-white text-ink-900 text-sm font-bold"
              >
                Lock champion → sealed receipt
              </button>
              <button
                onClick={() => {
                  sound.tap();
                  setPhase('setup');
                  setRound(null);
                  setStandings({});
                  setRoundsPlayed(0);
                }}
                className="h-12 rounded-full border border-white/20 text-white text-sm font-bold flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Run another sprint
              </button>
            </div>
          </div>
        )}

        {phase === 'setup' && (
          <p className="text-center text-[12px] font-bold text-ink-500">
            Each round spins two contestants head-to-head. Best win count takes the sprint.
          </p>
        )}
      </div>
    </div>
  );
};