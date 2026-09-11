import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { convexClient } from '../lib/convexClient';
import { LogoMark } from '../components/Logo';
import { sound } from '../audio/sound';
import { DecisionRecord } from '../types';

interface AdminPageProps {
  history: DecisionRecord[];
  templatesEdited: number;
}

interface Overview {
  rooms: number;
  open: number;
  locked: number;
  options: number;
  members: number;
  byDay: Record<string, number>;
}

const TOKEN_KEY = 'nd_admin_token';

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

// Isolated dashboard at #/nodb-admin. Login first, stats after.
export const AdminPage: React.FC<AdminPageProps> = ({ history, templatesEdited }) => {
  const [token, setToken] = useState(readToken);

  const saveToken = (t: string) => {
    setToken(t);
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // noop
    }
  };

  if (!convexClient) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <LogoMark className="w-12 h-12 mx-auto mb-4" />
          <h1 className="font-display font-black tracking-tight text-2xl text-ink-900">
            Backend offline
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed mt-2">
            Set <span className="font-mono">VITE_CONVEX_URL</span> to light up this dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <LogoMark className="w-12 h-12 mx-auto mb-4" />
            <h1 className="font-display font-black tracking-tight text-2xl text-ink-900">
              Admin login
            </h1>
            <p className="text-[13px] text-ink-500 mt-1.5">
              Aggregates only. No room content, ever.
            </p>
          </div>
          <LoginForm onToken={saveToken} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-10">
          <div className="flex items-center justify-between mb-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Private · Aggregates only
            </p>
            <button
              onClick={() => {
                sound.tap();
                saveToken('');
              }}
              className="text-[12px] font-bold text-white/50 hover:text-white"
            >
              Log out
            </button>
          </div>
          <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-tight">
            Usage overview
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-3">
        <LiveBackendPanels token={token} onInvalid={() => saveToken('')} />

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

function LoginForm({ onToken }: { onToken: (t: string) => void }) {
  const login = useMutation('admins:login' as any);
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !passcode || busy) return;
    sound.click();
    setBusy(true);
    setError('');
    try {
      const res = (await login({ email: email.trim(), passcode })) as { token: string } | null;
      if (!res) {
        setError('Wrong email or passcode.');
      } else {
        onToken(res.token);
      }
    } catch {
      setError('Could not reach the backend. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 space-y-3">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Admin email"
        autoComplete="email"
        className="w-full bg-canvas text-sm font-bold rounded-xl px-4 py-3 border border-ink-200 focus:border-ink-900 focus:outline-none"
      />
      <div className="relative">
        <input
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="Passcode"
          type={showPass ? 'text' : 'password'}
          autoComplete="current-password"
          className="w-full bg-canvas text-sm font-bold rounded-xl px-4 py-3 pr-11 border border-ink-200 focus:border-ink-900 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            sound.tap();
            setShowPass((s) => !s);
          }}
          aria-label={showPass ? 'Hide passcode' : 'Show passcode'}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors"
        >
          {showPass ? (
            <EyeSlashIcon className="w-[18px] h-[18px]" />
          ) : (
            <EyeIcon className="w-[18px] h-[18px]" />
          )}
        </button>
      </div>
      {error && <p className="text-[12px] font-bold text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={!email.trim() || !passcode || busy}
        className="btn-primary w-full h-11 text-sm disabled:opacity-40"
      >
        {busy ? 'Checking…' : 'Unlock dashboard'}
      </button>
    </div>
  );
}

function LiveBackendPanels({ token, onInvalid }: { token: string; onInvalid: () => void }) {
  const data = useQuery('analytics:overview' as any, { token }) as Overview | null | undefined;

  if (data === undefined) {
    return (
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-bold text-ink-400">Loading backend stats…</p>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="bg-white rounded-2xl p-5">
        <p className="text-[13px] font-bold text-ink-600 mb-3">
          Session expired. Log in again.
        </p>
        <button
          onClick={() => {
            sound.tap();
            onInvalid();
          }}
          className="btn-primary h-10 px-5 text-[13px]"
        >
          Back to login
        </button>
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
