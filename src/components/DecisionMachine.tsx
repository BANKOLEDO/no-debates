import React from 'react';
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PlusIcon,
  XMarkIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/solid';
import { Logo } from './Logo';
import { Rise } from './Reveal';
import { SpinWheel } from './SpinWheel';
import { getDiceBearAvatar } from '../utils/dicebear';
import { sound } from '../audio/sound';
import { encodeDecisionToHash } from '../utils/shareUrl';
import { downloadReceiptImage } from '../utils/receiptImage';
import { DecisionMachineApi } from '../hooks/useDecisionMachine';

// The decider card: presets, question, options, wheel, spin, share
export const DecisionMachine: React.FC<{ api: DecisionMachineApi }> = ({ api }) => {
  const {
    selectedPresetId,
    question,
    setQuestion,
    options,
    newOptionInput,
    setNewOptionInput,
    verdict,
    isSpinning,
    spinRequest,
    copiedLink,
    presets,
    applyPreset,
    addOption,
    removeOption,
    shuffleOptions,
    spinDecision,
    handleSpinTick,
    handleSpinSettled,
    handleCopyLink,
  } = api;

  const handleDownload = () => {
    if (!verdict) return;
    sound.click();
    const timestamp = Date.now();
    const hash = encodeDecisionToHash({ question, options, verdict, timestamp });
    downloadReceiptImage({ question, options, verdict, timestamp, hash });
  };

  return (
    <Rise y={32}>
      <div id="machine" className="w-full max-w-2xl mx-auto pt-4 scroll-mt-24">
        <div className="bg-white rounded-3xl p-6 sm:p-10 relative">

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-ink-200">
            <Logo size="sm" />

            <span className="bg-accent-soft text-accent text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-accent/20">
              Live Tool
            </span>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                Preset Scenarios
              </label>
              <span className="text-[10px] text-ink-400 font-semibold">Click to load</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {presets.map((p) => {
                const isActive = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-ink-900 text-white'
                        : 'bg-canvas text-ink-600 hover:bg-ink-100 border border-ink-200'
                    }`}
                  >
                    <span>{p.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question */}
          <div className="mb-5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-ink-400 mb-1.5">
              The Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What are you deciding?"
              className="w-full bg-canvas focus:bg-white text-ink-900 font-extrabold text-lg sm:text-xl rounded-xl px-4 py-3 border border-ink-200 focus:border-ink-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Options */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                Candidates ({options.length}/12)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ink-400 font-semibold">Min 2 choices</span>
                <button
                  onClick={shuffleOptions}
                  disabled={isSpinning || options.length < 2}
                  className="w-7 h-7 rounded-lg border border-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 hover:border-ink-900 disabled:opacity-30 transition-colors"
                  title="Shuffle order"
                  aria-label="Shuffle options"
                >
                  <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {options.map((opt, idx) => {
                const isWinner = verdict === opt;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isWinner
                        ? 'bg-accent text-white ring-2 ring-accent'
                        : 'bg-canvas border border-ink-200 text-ink-800 hover:border-ink-400'
                    }`}
                  >
                    <img
                      src={getDiceBearAvatar(opt, 'bottts', 40)}
                      alt=""
                      className="w-5 h-5 rounded-full bg-white"
                    />
                    <span>{opt}</span>
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(idx)}
                        disabled={isSpinning}
                        className="text-ink-400 hover:text-ink-900 disabled:opacity-30 ml-0.5"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add option */}
            {options.length < 12 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addOption();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={newOptionInput}
                  onChange={(e) => setNewOptionInput(e.target.value)}
                  placeholder="Add custom choice (e.g. Dim Sum, In-N-Out)..."
                  className="flex-1 bg-white border border-ink-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ink-800 placeholder-ink-400 focus:outline-none focus:border-ink-900"
                />
                <button
                  type="submit"
                  disabled={!newOptionInput.trim() || isSpinning}
                  className="bg-ink-900 hover:bg-ink-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1 disabled:opacity-40 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            )}
          </div>

          {/* Spin wheel */}
          <div className="mb-6 flex flex-col items-center">
            <SpinWheel
              options={options}
              verdict={verdict}
              request={spinRequest}
              onTick={handleSpinTick}
              onSettled={handleSpinSettled}
            />
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-ink-400">
              {isSpinning ? 'Spinning…' : verdict ? 'Official verdict locked' : 'Ready to spin'}
            </p>
            {verdict && !isSpinning && (
              <p className="font-display font-black tracking-tight text-2xl sm:text-3xl text-accent">
                {verdict}
              </p>
            )}
          </div>

          {/* Spin button */}
          <div className="space-y-3">
            <button
              onClick={spinDecision}
              disabled={isSpinning || options.length < 2}
              className={`w-full py-4 px-6 rounded-2xl text-base font-black flex items-center justify-center space-x-2.5 transition-colors ${
                isSpinning
                  ? 'bg-ink-300 text-ink-600 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-hover text-white'
              }`}
            >
              <ArrowPathIcon className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING…' : 'SPIN FOR THE VERDICT'}</span>
              <span className="hidden sm:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                SPACE
              </span>
            </button>

            {/* Share actions */}
            {verdict && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDownload}
                  className="w-full bg-ink-900 hover:bg-ink-800 text-white py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-colors border border-ink-900"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 text-emerald-400" />
                  <span>Download Receipt</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full bg-white hover:bg-ink-50 border border-ink-200 text-ink-800 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-colors"
                >
                  <ShareIcon className="w-4 h-4 text-ink-500" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Proof Link'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </Rise>
  );
};
