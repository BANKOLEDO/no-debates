import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

type ToastKind = 'success' | 'error' | 'info';

interface ToastInput {
  title: string;
  message?: string;
}

interface Toast extends ToastInput {
  id: number;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: Record<ToastKind, (t: ToastInput) => void>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const KIND_META: Record<ToastKind, { Icon: typeof CheckCircleIcon; iconClass: string }> = {
  success: { Icon: CheckCircleIcon, iconClass: 'text-emerald-400' },
  error: { Icon: XCircleIcon, iconClass: 'text-accent' },
  info: { Icon: InformationCircleIcon, iconClass: 'text-sky-400' },
};

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const push = useCallback((kind: ToastKind, input: ToastInput) => {
    const id = nextId++;
    setToasts((prev) => [...prev.slice(-2), { id, kind, ...input }]);
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, input.title.length > 42 ? 5000 : 3600);
  }, []);

  const dismiss = useCallback((id: number) => {
    const timer = timers.current[id];
    if (timer) clearTimeout(timer);
    setToasts((prev) => prev.filter((t) => t.id !== id));
    delete timers.current[id];
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: {
        success: (t) => push('success', t),
        error: (t) => push('error', t),
        info: (t) => push('info', t),
      },
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[100] flex flex-col items-center gap-2 px-4 sm:px-6 lg:bottom-6 lg:items-end lg:inset-x-auto lg:right-6"
        aria-live="polite"
        role="status"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const { Icon, iconClass } = KIND_META[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="pointer-events-auto flex items-start gap-2.5 bg-ink-900 text-white rounded-2xl py-3 pl-3.5 pr-2 max-w-[min(92vw,380px)] shadow-[0_12px_32px_-12px_rgba(20,19,18,0.4)]"
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-none ${iconClass}`} />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-snug">{t.title}</p>
                  {t.message && (
                    <p className="text-[12px] text-white/60 leading-snug mt-0.5">{t.message}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                  className="flex-none w-7 h-7 -my-1 -mr-0.5 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};