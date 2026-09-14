import React, { useState } from 'react';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useDecisionMachine } from '../hooks/useDecisionMachine';
import { DecisionMachine } from '../components/DecisionMachine';
import { SpeedRoundPage } from '../pages/SpeedRoundPage';
import { DecisionRecord, DecisionPreset } from '../types';
import { PRESETS } from '../utils/presets';
import { sound } from '../audio/sound';

interface MachinePageProps {
  onSaveRecord: (record: DecisionRecord) => void;
  initialData: Partial<DecisionRecord> | null;
  presets?: DecisionPreset[];
  historyCount: number;
  onBack: () => void;
  onOpenHistory: () => void;
  onOpenReceipt: (question: string, options: string[], verdict: string, timestamp: number) => void;
}

// Product screen: slim bar, machine first, speed round one tap away
export const MachinePage: React.FC<MachinePageProps> = ({
  onSaveRecord,
  initialData,
  presets = PRESETS,
  historyCount,
  onBack,
  onOpenHistory,
  onOpenReceipt,
}) => {
  const machine = useDecisionMachine({ onSaveRecord, initialData, presets });
  const [view, setView] = useState<'machine' | 'speed'>('machine');

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.tap();
              onBack();
            }}
            className="flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <div className="flex items-center justify-center rounded-full bg-white/10 p-1">
            <button
              onClick={() => {
                sound.tap();
                setView('machine');
              }}
              className={`text-[12px] font-extrabold rounded-full px-4 py-1.5 transition-colors ${
                view === 'machine' ? 'bg-accent text-ink-900' : 'text-white/60 hover:text-white'
              }`}
            >
              Spin
            </button>
            <button
              onClick={() => {
                sound.tap();
                setView('speed');
              }}
              className={`text-[12px] font-extrabold rounded-full px-4 py-1.5 transition-colors ${
                view === 'speed' ? 'bg-accent text-ink-900' : 'text-white/60 hover:text-white'
              }`}
            >
              Speed
            </button>
          </div>
          <button
            onClick={() => {
              sound.tap();
              onOpenHistory();
            }}
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors"
          >
            <ClockIcon className="w-4 h-4" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="bg-white text-ink-900 text-[11px] font-extrabold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {view === 'machine' ? (
        <div className="px-4 pb-4">
          <DecisionMachine api={machine} />
        </div>
      ) : (
        <SpeedRoundPage
          embedded
          onSaveRecord={onSaveRecord}
          onOpenReceipt={onOpenReceipt}
          onBack={onBack}
        />
      )}
    </div>
  );
};
