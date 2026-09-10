import React, { useState } from 'react';
import { ArrowRightIcon, PencilIcon, CheckIcon, XMarkIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { DecisionPreset } from '../types';
import { PRESETS } from '../utils/presets';
import { sound } from '../audio/sound';
import { getDiceBearAvatar } from '../utils/dicebear';

interface PresetExplorerProps {
  presets?: DecisionPreset[];
  onSelectPreset: (preset: DecisionPreset) => void;
  onSavePreset?: (id: string, data: { question: string; options: string[] }) => void;
  onResetPreset?: (id: string) => void;
  isEdited?: (id: string) => boolean;
}

export const PresetExplorer: React.FC<PresetExplorerProps> = ({
  presets = PRESETS,
  onSelectPreset,
  onSavePreset,
  onResetPreset,
  isEdited,
}) => {
  const canEdit = !!onSavePreset;
  const checkEdited = isEdited || (() => false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section id="scenarios" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-ink-100 gap-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent font-mono mb-1">
            Everyday Templates
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900">
            Real Scenarios, Zero Hassle
          </h2>
        </div>
        <div className="text-xs text-ink-500 font-medium">
          Click a card to load it, or edit it to make it yours
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((p) => (
          <PresetCard
            key={p.id}
            preset={p}
            edited={checkEdited(p.id)}
            canEdit={canEdit}
            editing={editingId === p.id}
            onEdit={() => {
              sound.tap();
              setEditingId(p.id);
            }}
            onCancel={() => setEditingId(null)}
            onLoad={() => {
              sound.click();
              onSelectPreset(p);
            }}
            onSave={(data) => {
              sound.click();
              onSavePreset?.(p.id, data);
              setEditingId(null);
            }}
            onReset={() => {
              sound.tap();
              onResetPreset?.(p.id);
            }}
          />
        ))}
      </div>
    </section>
  );
};

// One template card, view + edit modes
function PresetCard({
  preset: p,
  edited,
  editing,
  canEdit,
  onEdit,
  onCancel,
  onLoad,
  onSave,
  onReset,
}: {
  preset: DecisionPreset;
  edited: boolean;
  editing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onLoad: () => void;
  onSave: (data: { question: string; options: string[] }) => void;
  onReset: () => void;
}) {
  const [question, setQuestion] = useState(p.question);
  const [options, setOptions] = useState<string[]>(p.options);
  const [draft, setDraft] = useState('');

  // Reset local state whenever a different card opens
  React.useEffect(() => {
    if (editing) {
      setQuestion(p.question);
      setOptions([...p.options]);
      setDraft('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const canSave = question.trim().length > 0 && options.length >= 2;

  const addDraft = () => {
    const t = draft.trim();
    if (!t || options.length >= 12 || options.includes(t)) return;
    sound.tap();
    setOptions([...options, t]);
    setDraft('');
  };

  if (editing) {
    return (
      <div className="bg-white rounded-2xl p-5 flex flex-col space-y-3 active:scale-[0.99]">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Scenario question"
          className="w-full text-sm font-bold text-ink-900 border-b border-ink-200 focus:border-ink-900 focus:outline-none pb-1.5"
        />

        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {options.map((opt, i) => (
            <div key={`${opt}-${i}`} className="flex items-center gap-2 bg-canvas rounded-lg px-2.5 py-1.5">
              <span className="flex-1 text-[12px] font-semibold text-ink-800 truncate">{opt}</span>
              <button
                onClick={() => {
                  if (options.length <= 2) return;
                  sound.tap();
                  setOptions(options.filter((_, idx) => idx !== i));
                }}
                className="text-ink-400 hover:text-ink-900 disabled:opacity-30"
                disabled={options.length <= 2}
                aria-label={`Remove ${opt}`}
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {options.length < 12 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addDraft();
            }}
            className="flex items-center gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add choice..."
              className="flex-1 text-[12px] font-semibold border border-ink-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-ink-900"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="text-[12px] font-bold text-ink-900 disabled:opacity-30"
            >
              Add
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-ink-100 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-bold text-ink-400 hover:text-ink-900"
          >
            <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-[12px] font-bold text-ink-500 px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={() => canSave && onSave({ question: question.trim(), options })}
              disabled={!canSave}
              className="flex items-center gap-1 text-[12px] font-bold text-white bg-ink-900 rounded-full px-3.5 py-1.5 disabled:opacity-40"
            >
              <CheckIcon className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onLoad}
      className="bg-white rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-4 active:scale-[0.99]"
    >
      <div className="flex items-center space-x-3.5">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-ink-100">
                <img
                  src={p.imageUrl}
                  alt={p.tag}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider flex items-center gap-1.5">
            {p.tag}
            {edited && (
              <span className="text-accent normal-case tracking-normal">· edited</span>
            )}
          </span>
          <h3 className="text-sm font-bold text-ink-900 truncate group-hover:text-accent transition-colors">
            {p.question}
          </h3>
        </div>

        {canEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-ink-300 hover:text-ink-900 hover:bg-ink-50"
            title="Edit template"
            aria-label={`Edit ${p.tag}`}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {p.options.slice(0, 3).map((opt, i) => (
          <span
            key={i}
            className="inline-flex items-center space-x-1.5 bg-canvas text-ink-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-ink-100"
          >
            <img
              src={getDiceBearAvatar(opt, 'bottts', 20)}
              alt=""
              className="w-3.5 h-3.5 rounded-full"
            />
            <span>{opt}</span>
          </span>
        ))}
        {p.options.length > 3 && (
          <span className="text-[11px] text-ink-400 font-semibold self-center pl-1">
            +{p.options.length - 3} more
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-ink-50 flex items-center justify-between text-xs">
        <span className="text-ink-400 font-medium">{p.options.length} choices ready</span>
        <span className="text-ink-900 font-bold flex items-center space-x-1 group-hover:text-accent transition-colors">
          <span>Load Scenario</span>
          <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
}
