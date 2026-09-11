import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FullWidthHero } from './components/FullWidthHero';
import { ChatShowcase } from './components/ChatShowcase';
import { BentoShowcase } from './components/BentoShowcase';
import { PresetExplorer } from './components/PresetExplorer';
import { SectionDivider } from './components/SectionDivider';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { ProductBottomNav, type BottomTab } from './components/ProductBottomNav';
import { MachinePage } from './pages/MachinePage';
import { AdminPage } from './pages/AdminPage';
import { SquadScreen } from './pages/SquadPage';
import { ReceiptPage, type SharedVerdict } from './pages/ReceiptPage';
import { HistoryPage } from './pages/HistoryPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { Logo } from './components/Logo';
import { MotionConfig } from 'motion/react';
import { sound } from './audio/sound';
import { decodeDecisionFromHash, encodeDecisionToHash } from './utils/shareUrl';
import { PRESETS } from './utils/presets';
import { DecisionRecord, DecisionPreset } from './types';

const STORAGE_KEY = 'nodebates_history_v5';
const PRESETS_KEY = 'nodebates_presets_v1';

type Route = 'home' | 'machine' | 'receipt' | 'history' | 'terms' | 'privacy' | 'squad' | 'nodb-admin';

function parseRoute(): Route {
  const h = window.location.hash;
  if (h === '#/machine') return 'machine';
  if (h === '#/history') return 'history';
  if (h === '#/terms') return 'terms';
  if (h === '#/privacy') return 'privacy';
  if (h === '#/squad' || h.startsWith('#/squad/')) return 'squad';
  if (h === '#/nodb-admin') return 'nodb-admin';
  return 'home';
}

function parseSquadId(): string | null {
  const m = window.location.hash.match(/^#\/squad\/([^/\s]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

// User-edited templates persist here, built-ins stay untouched
function loadPresets(): DecisionPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return PRESETS;
    const overrides = JSON.parse(raw) as Record<string, { question?: string; options?: string[] }>;
    return PRESETS.map((p) => ({ ...p, ...(overrides[p.id] || {}) }));
  } catch {
    return PRESETS;
  }
}

export function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [presets, setPresets] = useState<DecisionPreset[]>(() => loadPresets());
  const [editedIds, setEditedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(PRESETS_KEY);
      return new Set(Object.keys(raw ? JSON.parse(raw) : {}));
    } catch {
      return new Set();
    }
  });
  const [initialData, setInitialData] = useState<Partial<DecisionRecord> | null>(null);
  const [route, setRoute] = useState<Route>(() => initialLocation().route);
  const [sharedData, setSharedData] = useState<SharedVerdict | null>(() => initialLocation().shared);
  const [activeTab, setActiveTab] = useState<BottomTab>('machine');
  const [activeSection, setActiveSection] = useState('');
  const [squadId, setSquadId] = useState<string | null>(() => parseSquadId());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Reads the URL before first paint so refresh + shared links land correctly
  function initialLocation(): { route: Route; shared: SharedVerdict | null } {
    const toShared = (decoded: Partial<DecisionRecord>): { route: Route; shared: SharedVerdict } => ({
      route: 'receipt',
      shared: {
        question: decoded.question || 'Decision',
        options: decoded.options || [],
        verdict: decoded.verdict || '',
        timestamp: decoded.timestamp || Date.now(),
        hash: decoded.shareCode || '',
      },
    });

    // Preview links: /v/<payload> (edge serves bots, app handles humans)
    const pathMatch = window.location.pathname.match(/^\/v\/([A-Za-z0-9\-_]+)\/?$/);
    if (pathMatch) {
      const decoded = decodeDecisionFromHash(`#${pathMatch[1]}`);
      if (decoded) return toShared(decoded);
    }

    // Legacy hash links: #<payload>
    const hash = window.location.hash;
    if (hash && hash.length > 2 && !hash.startsWith('#/')) {
      const decoded = decodeDecisionFromHash(hash);
      if (decoded) return toShared(decoded);
    }
    return { route: parseRoute(), shared: null };
  }

  // Back/forward buttons + auto scroll to top on page change
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash;
      if (h.startsWith('#/') || h === '') setRoute(parseRoute());
      setSquadId(parseSquadId());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (route === 'history') setActiveTab('history');
    if (route === 'home') setActiveTab('home');
    if (route === 'machine') setActiveTab('machine');
  }, [route]);

  // Highlights the nav link for the section in view
  useEffect(() => {
    if (route !== 'home') {
      setActiveSection('');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    ['ledger', 'scenarios', 'group-chat', 'faq'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [route]);

  const go = (r: Route) => {
    window.location.hash = r === 'home' ? '#/' : `#/${r}`;
  };

  const goSection = (id: string) => {
    if (parseRoute() !== 'home') {
      window.location.hash = '#/';
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveRecord = (record: DecisionRecord) => {
    setHistory(prev => {
      const updated = [record, ...prev.slice(0, 19)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const persistPresetOverrides = (ids: Set<string>, list: DecisionPreset[]) => {
    const overrides: Record<string, { question: string; options: string[] }> = {};
    ids.forEach((id) => {
      const found = list.find((p) => p.id === id);
      if (found) overrides[id] = { question: found.question, options: found.options };
    });
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(overrides));
    } catch {
      // Ignore
    }
  };

  const handleSavePreset = (id: string, data: { question: string; options: string[] }) => {
    setPresets((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      const ids = new Set(editedIds);
      ids.add(id);
      setEditedIds(ids);
      persistPresetOverrides(ids, updated);
      return updated;
    });
  };

  const handleResetPreset = (id: string) => {
    const original = PRESETS.find((p) => p.id === id);
    if (!original) return;
    setPresets((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, question: original.question, options: [...original.options] } : p
      );
      const ids = new Set(editedIds);
      ids.delete(id);
      setEditedIds(ids);
      persistPresetOverrides(ids, updated);
      return updated;
    });
  };

  const scrollToMachine = () => {
    go('machine');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Any verdict opens as a receipt with its proof URL in place
  const openReceiptData = (question: string, options: string[], verdict: string, timestamp: number) => {
    const hash = encodeDecisionToHash({ question, options, verdict, timestamp });
    try {
      window.location.hash = hash;
    } catch {
      // noop
    }
    setSharedData({ question, options, verdict, timestamp, hash });
    setRoute('receipt');
  };

  // History entries open as receipts, with the proof URL in place
  const openReceiptFor = (rec: DecisionRecord) => {
    if (!rec.shareCode) {
      setInitialData(rec);
      go('machine');
      return;
    }
    try {
      window.location.hash = rec.shareCode;
    } catch {
      // noop
    }
    setSharedData({
      question: rec.question,
      options: rec.options,
      verdict: rec.verdict,
      timestamp: rec.timestamp,
      hash: rec.shareCode,
    });
    setRoute('receipt');
  };

  const handleSelectPreset = (preset: DecisionPreset) => {
    setInitialData({
      question: preset.question,
      options: [...preset.options],
      verdict: preset.options[0]
    });
    go('machine');
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-canvas text-ink-900 flex flex-col font-sans selection:bg-accent selection:text-white">
      <Navbar
        isMuted={isMuted}
        onToggleMute={() => {
          sound.enabled = isMuted;
          setIsMuted(!isMuted);
        }}
        onOpenHistory={() => {
          setActiveTab('history');
          go('history');
        }}
        historyCount={history.length}
        onGoHome={() => go('home')}
        onGoSection={goSection}
        onGoMachine={() => {
          setActiveTab('machine');
          go('machine');
        }}
        activeSection={activeSection}
      />

      {route === 'home' && (
        <main className="flex-1 w-full overflow-x-hidden">
          <div>
            <FullWidthHero
              presets={presets}
              onLaunchMachine={() => go('machine')}
              onSelectPreset={handleSelectPreset}
              onSquad={() => go('squad')}
            />
          </div>

          <ChatShowcase onTryIt={scrollToMachine} />

          <SectionDivider label="Features & Architecture" />
          <BentoShowcase />

          <SectionDivider label="Everyday Templates" />
          <PresetExplorer
            presets={presets}
            onSelectPreset={handleSelectPreset}
            onSavePreset={handleSavePreset}
            onResetPreset={handleResetPreset}
            isEdited={(id) => editedIds.has(id)}
          />

          <SectionDivider label="FAQ" />
          <FaqSection />

          <CtaSection onScrollToApp={scrollToMachine} />
        </main>
      )}

      {route === 'machine' && (
        <main className="flex-1 w-full">
          <MachinePage
            onSaveRecord={handleSaveRecord}
            initialData={initialData}
            presets={presets}
            historyCount={history.length}
            onBack={() => go('home')}
            onOpenHistory={() => go('history')}
          />
        </main>
      )}

      {route === 'squad' && (
        <main className="flex-1 w-full">
          <SquadScreen
            key={squadId || 'lobby'}
            roomId={squadId}
            onOpenRoom={(id) => {
              setSquadId(id);
              window.location.hash = `#/squad/${id}`;
            }}
            onViewReceipt={(question, options, verdict) => {
              openReceiptData(question, options, verdict, Date.now());
            }}
            onBack={() => go('home')}
          />
        </main>
      )}

      {route === 'nodb-admin' && (
        <main className="flex-1 w-full">
          <AdminPage
            history={history}
            templatesEdited={editedIds.size}
            onBack={() => go('home')}
          />
        </main>
      )}

      {route === 'receipt' && sharedData && (
        <main className="flex-1 w-full">
          <ReceiptPage
            data={sharedData}
            onOpenInMachine={() => {
              setInitialData(sharedData);
              go('machine');
            }}
            onBack={() => go('home')}
          />
        </main>
      )}

      {route === 'history' && (
        <main className="flex-1 w-full">
          <HistoryPage
            history={history}
            onSelectRecord={openReceiptFor}
            onClearHistory={handleClearHistory}
            onBack={() => go('home')}
          />
        </main>
      )}

      {route === 'terms' && (
        <main className="flex-1 w-full">
          <TermsPage onBack={() => go('home')} />
        </main>
      )}

      {route === 'privacy' && (
        <main className="flex-1 w-full">
          <PrivacyPage onBack={() => go('home')} />
        </main>
      )}

      {route === 'home' && (
        <footer className="border-t border-ink-100 py-6 px-4 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-ink-500">
            <Logo size="sm" />

            <div className="text-[11px] text-ink-400">
              No accounts • No cookies • 100% private
            </div>

            <div className="flex items-center gap-5">
              <button onClick={() => go('terms')} className="font-semibold hover:text-ink-900">
                Terms
              </button>
              <button onClick={() => go('privacy')} className="font-semibold hover:text-ink-900">
                Privacy
              </button>
              <div className="text-ink-600 font-semibold">
                Made for real group chats
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Spacer so the bottom nav never covers content */}
      <div className="lg:hidden" style={{ height: 66, paddingBottom: 'env(safe-area-inset-bottom)' }} />

      {/* Bottom product nav (mobile) */}
      <ProductBottomNav
        active={activeTab}
        onGoHome={() => {
          setActiveTab('home');
          if (route === 'home') {
            scrollToTop();
          } else {
            go('home');
          }
        }}
        onOpenMachine={() => {
          setActiveTab('machine');
          scrollToMachine();
        }}
        onOpenHistory={() => {
          setActiveTab('history');
          go('history');
        }}
        onScrollTop={() => {
          setActiveTab('top');
          scrollToTop();
        }}
        historyCount={history.length}
      />

    </div>
    </MotionConfig>
  );
}

export default App;
