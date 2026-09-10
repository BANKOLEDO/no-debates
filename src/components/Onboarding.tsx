import { useState, useRef, useCallback } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { getDiceBearAvatar } from '../utils/dicebear';
import { Logo } from './Logo';

// Curated DiceBear avatar styles & seeds
const AVATARS = [
  { src: getDiceBearAvatar('Alex', 'lorelei', 120), alt: 'Alex' },
  { src: getDiceBearAvatar('Sarah', 'adventurer', 120), alt: 'Sarah' },
  { src: getDiceBearAvatar('Jordan', 'notionists', 120), alt: 'Jordan' },
  { src: getDiceBearAvatar('Liam', 'bottts', 120), alt: 'Liam' },
  { src: getDiceBearAvatar('Chloe', 'micah', 120), alt: 'Chloe' },
  { src: getDiceBearAvatar('Sam', 'fun-emoji', 120), alt: 'Sam' },
];

// Floating avatar cluster positions (relative to center, for the arc/cluster layout)
const CLUSTER_POSITIONS = [
  { x: -110, y: -60, size: 52, delay: 0,    rotate: -8  },
  { x:  -55, y: -110, size: 60, delay: 0.1, rotate:  4  },
  { x:   20, y: -130, size: 68, delay: 0.2, rotate: -3  },
  { x:   95, y: -100, size: 56, delay: 0.3, rotate:  7  },
  { x:  130, y: -30,  size: 48, delay: 0.4, rotate: -5  },
  { x: -140, y:  30,  size: 44, delay: 0.5, rotate:  6  },
];

const STEPS = [
  {
    id: 'welcome',
    badge: 'No more group chat chaos',
    headline: ['Stop debating.', 'Start deciding.'],
    sub: 'Paste a question, spin the wheel, share the result. Done.',
    cta: 'How it works',
  },
  {
    id: 'how',
    badge: 'Three steps',
    headline: ['Type it.', 'Spin it.', 'Done.'],
    sub: 'Add your options, hit spin, and let No Debates pick for you. No voting, no hurt feelings.',
    cta: 'Real examples',
  },
  {
    id: 'scenarios',
    badge: 'Made for real life',
    headline: ['From dinner to', 'dream trips.'],
    sub: '"Where should we eat?" "Who pays?" "What movie?" All settled in one tap.',
    cta: "Let's go",
  },
];

// Floating pill labels that orbit around the cluster
const FLOAT_PILLS = [
  { text: 'Pizza or Sushi?', x: -160, y: 50,  delay: 0    },
  { text: 'Who drives?',     x:  80,  y: 60,  delay: 0.15 },
  { text: 'Movie night',     x: -50,  y: 105, delay: 0.3  },
];

interface OnboardingProps {
  onFinish: () => void;
}

export function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [direction, setDirection] = useState<'fwd' | 'back'>('fwd');

  // Touch / swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback((nextStep: number, dir: 'fwd' | 'back') => {
    if (exiting) return;
    setDirection(dir);
    setExiting(true);
    setTimeout(() => {
      setStep(nextStep);
      setExiting(false);
    }, 260);
  }, [exiting]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      goTo(step + 1, 'fwd');
    } else {
      // Persist dismissal so onboarding doesn't show again
      try { localStorage.setItem('nd_onboarded', '1'); } catch { /* noop */ }
      onFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1, 'back');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) handleNext();
      else handleBack();
    }
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Slide animation classes
  const slideClass = exiting
    ? direction === 'fwd'
      ? 'opacity-0 translate-x-[-24px]'
      : 'opacity-0 translate-x-[24px]'
    : 'opacity-100 translate-x-0';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden select-none bg-[#100C08] sm:justify-center sm:p-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mini-app device frame on desktop, full-bleed on mobile */}
      <div
        className="relative w-full flex-1 flex flex-col justify-between overflow-hidden sm:flex-none sm:w-[400px] sm:h-[812px] sm:max-h-[94vh] sm:rounded-[32px] sm:border-[10px] sm:border-black"
        style={{ background: 'linear-gradient(160deg, #FDECD8 0%, #FBE0CB 35%, #F5D5C0 70%, #EDD0BC 100%)' }}
      >
        {/* Noise grain overlay for warmth */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px',
          }}
        />

        {/* Mini-app drag handle (mobile) */}
        <div className="sm:hidden relative z-10 mx-auto mt-3 w-10 h-1 rounded-full bg-[#1A1108]/15" />

        {/* Top bar */}
        <div className="relative z-10 w-full flex items-center justify-between px-6 pt-4 sm:pt-6">
          <Logo size="sm" />

          {/* Skip */}
          <button
            onClick={onFinish}
            className="text-xs text-[#7A6352] font-semibold hover:text-[#1A1108] transition-colors px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Avatar cluster */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full" style={{ minHeight: 260 }}>
          <div className="relative" style={{ width: 240, height: 240 }}>
            {/* Center glow blob */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 180,
                height: 180,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,180,130,0.35) 0%, transparent 70%)',
              }}
            />

            {/* Orbiting avatars */}
            {CLUSTER_POSITIONS.map((pos, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.rotate}deg)`,
                  animationDelay: `${pos.delay}s`,
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden border-2 border-white/60"
                  style={{
                    width: pos.size,
                    height: pos.size,
                    animation: `float ${3.5 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${pos.delay * 2}s`,
                  }}
                >
                  <img
                    src={AVATARS[i].src}
                    alt={AVATARS[i].alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </div>
            ))}

            {/* Center pill badge */}
            <div
              className="absolute z-10"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-white"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs font-semibold text-[#1A1108] whitespace-nowrap">
                  {step === 0 ? 'Pick for us' : step === 1 ? 'Pizza wins!' : 'Sushi it is'}
                </span>
              </div>
            </div>

            {/* Floating pill labels */}
            {step === 0 && FLOAT_PILLS.map((pill, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${pill.x}px), calc(-50% + ${pill.y}px))`,
                  animation: `floatPill ${4 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${pill.delay + 0.5}s`,
                  opacity: 0.85,
                }}
              >
                <div className="bg-[#1A1108] text-white text-[11px] font-medium rounded-full px-3 py-1 whitespace-nowrap">
                  {pill.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="relative z-10 w-full px-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          {/* Badge */}
          <div
            className={`transition-all duration-[260ms] ease-out ${slideClass}`}
          >
            <span className="inline-block text-[11px] font-semibold text-[#7A6352] tracking-widest uppercase mb-3">
              {current.badge}
            </span>

            {/* Big headline */}
            <div className="mb-3">
              {current.headline.map((line, i) => (
                <h1
                  key={i}
                  className="text-[2.6rem] leading-[1.1] font-black text-[#1A1108] tracking-tight"
                  style={{ fontFamily: '"Syne", "Inter", sans-serif' }}
                >
                  {line}
                </h1>
              ))}
            </div>

            {/* Sub */}
            <p className="text-[15px] text-[#5A4535] leading-relaxed mb-8">
              {current.sub}
            </p>

            {/* Progress dots + buttons */}
            <div className="flex items-center justify-between">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > step ? 'fwd' : 'back')}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 20 : 6,
                      height: 6,
                      background: i === step ? '#1A1108' : 'rgba(26,17,8,0.25)',
                    }}
                  />
                ))}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="w-11 h-11 rounded-full border border-[#1A1108]/20 flex items-center justify-center text-[#1A1108] hover:bg-[#1A1108]/5 transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 h-11 rounded-full font-semibold text-sm text-white transition-all active:scale-95"
                style={{
                  background: '#1A1108',
                }}
                >
                  {isLast ? "Open the app" : current.cta}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
