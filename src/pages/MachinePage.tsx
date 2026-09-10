import React from 'react';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useDecisionMachine } from '../hooks/useDecisionMachine';
import { DecisionMachine } from '../components/DecisionMachine';
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
}

// Product screen: slim bar, machine first, nothing else
export const MachinePage: React.FC<MachinePageProps> = ({
  onSaveRecord,
  initialData,
  presets = PRESETS,
  historyCount,
  onBack,
  onOpenHistory,
}) => {
  const machine = useDecisionMachine({ onSaveRecord, initialData, presets });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
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
          <span className="text-[13px] font-extrabold tracking-tight">
            Decision Machine
          </span>
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

      <div className="px-4 py-4 pb-4">
        <DecisionMachine api={machine} />
      </div>
    </div>
  );
};
