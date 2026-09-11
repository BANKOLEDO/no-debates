import React, { useEffect, useRef, useState } from 'react';
import { SpinWheel } from '../components/SpinWheel';
import { useRoom } from '../lib/squadApi';
import { sound } from '../audio/sound';
import { getDiceBearAvatar } from '../utils/dicebear';

// Chromeless live board for iframe embedding: /e/<roomId>
export const EmbedPage: React.FC<{ roomId: string }> = ({ roomId }) => {
  const room = useRoom(roomId);
  const [spinRequest, setSpinRequest] = useState<{ winnerIndex: number; nonce: number } | null>(null);
  const prevStatus = useRef<string | undefined>(undefined);

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
      <div className="w-screen h-screen bg-ink-900 text-white flex items-center justify-center">
        <p className="text-sm font-bold text-white/50">Loading live decision…</p>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="w-screen h-screen bg-ink-900 text-white flex items-center justify-center flex-col gap-4 px-6 text-center">
        <p className="font-display font-black tracking-tight text-2xl">Room not found</p>
        <p className="text-sm text-white/50">This invite link is stale or mistyped.</p>
      </div>
    );
  }

  const locked = room.status === 'locked';

  return (
    <div className="w-screen h-[100dvh] bg-ink-900 text-white overflow-hidden relative">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[320px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-10 max-w-3xl mx-auto relative">
        {/* Watermark row */}
        <div className="flex items-center gap-2.5 absolute top-5 left-5 sm:left-10">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-ink-900" />
          </div>
          <span className="text-[11px] font-extrabold tracking-[0.18em] text-white/70">
            NO DEBATES · LIVE
          </span>
        </div>
        <span className="absolute top-5 right-5 sm:right-10 text-[11px] font-bold text-white/50 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          Squad of {room.members.length}
        </span>

        {/* Question */}
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent mb-3 text-center">
          {locked ? 'Verdict locked' : 'The question on the floor'}
        </p>
        <h1 className="font-display font-black tracking-tight text-3xl sm:text-5xl leading-[1.05] break-words text-center max-w-xl">
          {room.question}
        </h1>

        {/* Options */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
          {room.options.map((opt) => (
            <span
              key={opt}
              className={`px-3.5 py-2 rounded-full text-[13px] font-bold border ${
                locked && room.verdict === opt
                  ? 'bg-accent border-accent text-white'
                  : 'border-white/15 text-white/75'
              }`}
            >
              {opt}
            </span>
          ))}
        </div>

        {/* Wheel */}
        {room.options.length >= 2 && (
          <div className="mt-8">
            <SpinWheel
              options={room.options}
              verdict={locked ? room.verdict ?? null : null}
              request={spinRequest}
              onTick={() => sound.tick()}
              onSettled={() => {}}
            />
          </div>
        )}

        {/* Members */}
        <div className="flex items-center gap-2 mt-6">
          {room.members.slice(0, 8).map((m) => (
            <img
              key={m}
              src={getDiceBearAvatar(m, 'lorelei', 32)}
              alt={m}
              title={m}
              className="w-8 h-8 rounded-full border border-white/20"
            />
          ))}
        </div>
      </div>

      {/* Verdict banner */}
      {locked && room.verdict && (
        <div className="absolute inset-x-0 bottom-0 py-5 text-center bg-white text-ink-900">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-500">
            The squad has spoken
          </p>
          <p className="font-display font-black tracking-tight text-3xl sm:text-4xl">
            {room.verdict}
            <span className="text-accent">.</span>
          </p>
        </div>
      )}
    </div>
  );
};