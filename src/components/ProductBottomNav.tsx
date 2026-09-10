import React, { useEffect, useRef, useState } from 'react';
import {
  HomeIcon,
  BoltIcon,
  ClockIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/solid';
import { sound } from '../audio/sound';

export type BottomTab = 'home' | 'machine' | 'history' | 'top';

interface ProductBottomNavProps {
  active: BottomTab;
  onGoHome: () => void;
  onOpenMachine: () => void;
  onOpenHistory: () => void;
  onScrollTop: () => void;
  historyCount: number;
}

const TABS: { id: BottomTab; label: string; Icon: typeof BoltIcon }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'machine', label: 'Machine', Icon: BoltIcon },
  { id: 'history', label: 'History', Icon: ClockIcon },
  { id: 'top', label: 'Top', Icon: ArrowUpIcon },
];

const BAR_H = 66;
const NOTCH_R = 40;

// Full-width bar with a concave cutout under the active tab
export const ProductBottomNav: React.FC<ProductBottomNavProps> = ({
  active,
  onGoHome,
  onOpenMachine,
  onOpenHistory,
  onScrollTop,
  historyCount,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const index = Math.max(0, TABS.findIndex((t) => t.id === active));
  const tabW = w > 0 ? w / TABS.length : 0;
  const cx = tabW * (index + 0.5);

  // Cutout + bubble glide writes straight to the DOM, no per-frame renders
  const posRef = useRef(0);
  const animRef = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [shownCx, setShownCx] = useState(0);

  const paint = (v: number) => {
    posRef.current = v;
    if (pathRef.current) pathRef.current.setAttribute('d', shape(v));
    if (bubbleRef.current) {
      bubbleRef.current.style.transform = `translateX(${v - 28}px) translateZ(0)`;
    }
  };

  useEffect(() => {
    if (cx <= 0 || w <= 0) return;
    const from = posRef.current;
    if (from === 0) {
      paint(cx);
      setShownCx(cx);
      return;
    }
    if (from === cx) return;
    const t0 = performance.now();
    const steps = tabW > 0 ? Math.max(1, Math.round(Math.abs(cx - from) / tabW)) : 1;
    const dur = Math.min(620, 220 + steps * 110);
    cancelAnimationFrame(animRef.current);
    const frame = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      paint(from + (cx - from) * eased);
      if (p < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        setShownCx(cx);
      }
    };
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cx, w]);

  const rcx = shownCx > 0 ? shownCx : cx;

  const shape = (c: number) => {
    if (w === 0) return '';
    const l = Math.max(c - NOTCH_R, 8);
    const r = Math.min(c + NOTCH_R, w - 8);
    return [
      `M 0 14`,
      `Q 0 0 14 0`,
      `H ${l}`,
      `A ${NOTCH_R} ${NOTCH_R} 0 0 1 ${r} 0`,
      `H ${w - 14}`,
      `Q ${w} 0, ${w} 14`,
      `V ${BAR_H}`,
      `H 0`,
      `Z`,
    ].join(' ');
  };

  const press = (tab: BottomTab) => () => {
    sound.tap();
    if (tab === 'home') onGoHome();
    if (tab === 'machine') onOpenMachine();
    if (tab === 'history') onOpenHistory();
    if (tab === 'top') onScrollTop();
  };

  const ActiveIcon = TABS[index].Icon;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      aria-label="Product"
    >
      <div ref={barRef} className="relative" style={{ height: BAR_H }}>
        {/* Bar shape with cutout */}
        {w > 0 && (
          <svg
            className="absolute inset-0"
            width={w}
            height={BAR_H}
            viewBox={`0 0 ${w} ${BAR_H}`}
            aria-hidden
          >
            <path ref={pathRef} d={shape(rcx)} fill="#141312" />
          </svg>
        )}
        {w === 0 && <div className="absolute inset-0 bg-ink-900" />}

        {/* Raised bubble for the active tab */}
        {w > 0 && (
          <span
            ref={bubbleRef}
            className="absolute flex items-center justify-center rounded-full border-4 border-[#FAF8F5] active:scale-95"
            style={{
              width: 56,
              height: 56,
              left: 0,
              top: -28,
              transform: `translateX(${rcx - 28}px) translateZ(0)`,
              willChange: 'transform',
              backgroundColor: '#FF4A1C',
            }}
          >
            <ActiveIcon className="w-6 h-6 text-white" />
          </span>
        )}

        {/* Tab buttons */}
        <div className="absolute inset-0 grid grid-cols-4">
          {TABS.map((t) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={press(t.id)}
                className="relative flex flex-col items-center justify-end pb-2.5"
                aria-label={t.label}
              >
                {!isActive ? (
                  <>
                    <t.Icon className="w-[22px] h-[22px] text-white/45" />
                    <span className="text-[9px] font-bold text-white/45 mt-0.5">
                      {t.label}
                    </span>
                  </>
                ) : (
                  <span className="text-[9px] font-black text-white">
                    {t.label}
                  </span>
                )}
                {t.id === 'history' && historyCount > 0 && !isActive && (
                  <span className="absolute top-2 right-1/2 translate-x-7 bg-white text-ink-900 text-[9px] font-extrabold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    {historyCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
