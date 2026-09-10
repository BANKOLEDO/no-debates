import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowDownTrayIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';
import { generateChatSummary, shortReceiptCode } from '../utils/shareUrl';
import { downloadReceiptImage } from '../utils/receiptImage';

export interface SharedVerdict {
  question: string;
  options: string[];
  verdict: string;
  timestamp: number;
  hash: string;
}

interface ReceiptPageProps {
  data: SharedVerdict;
  onOpenInMachine: () => void;
  onBack: () => void;
}

// What a shared link opens: the sealed receipt, nothing else
export const ReceiptPage: React.FC<ReceiptPageProps> = ({ data, onOpenInMachine, onBack }) => {
  const [copied, setCopied] = useState(false);

  const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const date = new Date(data.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleCopy = async () => {
    sound.tap();
    const text = generateChatSummary({
      question: data.question,
      options: data.options,
      verdict: data.verdict,
      timestamp: data.timestamp,
      shareCode: data.hash,
      url: window.location.href,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[300px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 pt-5 pb-10 relative">
          <button
            onClick={() => {
              sound.tap();
              onBack();
            }}
            className="flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors mb-7"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Shared verdict
            </p>
            <span className="rotate-[-4deg] border border-accent rounded-md px-2 py-0.5 text-accent text-[10px] font-black tracking-[0.2em]">
              SEALED
            </span>
          </div>
          <p className="text-[15px] text-white/60 leading-relaxed">
            {data.question}
          </p>
          <h1 className="font-display font-black tracking-tight text-4xl sm:text-5xl leading-[1.02] break-words mt-3">
            {data.verdict}
            <span className="text-accent">.</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-[11px] font-bold text-white/70 bg-white/10 rounded-full px-3 py-1.5">
              {date} · {time}
            </span>
            <span className="font-mono text-[11px] font-bold text-white/70 bg-white/10 rounded-full px-3 py-1.5">
              #nd-{shortReceiptCode(data.hash)}
            </span>
            <span className="text-[11px] font-bold text-white/70 bg-white/10 rounded-full px-3 py-1.5">
              {data.options.length} options weighed
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
        {/* Receipt */}
        <div className="bg-white rounded-2xl p-5 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-ink-200 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-ink-900 text-white font-bold flex items-center justify-center text-[9px]">
                ND
              </div>
              <span className="font-extrabold text-ink-900 text-xs tracking-wider uppercase">
                No debates verdict
              </span>
            </div>
            <span className="text-[10px] text-ink-400 uppercase">
              {date} // {time}
            </span>
          </div>

          <div className="bg-canvas p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-ink-400 block leading-none">
                Verdict
              </span>
              <span className="text-sm font-extrabold uppercase text-accent leading-tight font-sans">
                {data.verdict}
              </span>
            </div>
            <span className="bg-accent-soft text-accent text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-accent/20 font-sans">
              Sealed
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-ink-500">Question:</span>
            <span className="font-bold text-ink-900 text-right ml-3">“{data.question}”</span>
          </div>

          <div className="text-[11px] text-ink-500 font-sans leading-relaxed">
            Also considered: {data.options.filter((o) => o !== data.verdict).join(', ') || 'None'}
          </div>

          <div className="pt-2 border-t border-dashed border-ink-200 flex items-center justify-between text-[10px] text-ink-400">
            <span>HASH: #nd-{shortReceiptCode(data.hash)}</span>
            <span className="text-emerald-600 font-bold">100% Unbiased</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={() => {
              sound.click();
              onOpenInMachine();
            }}
            className="btn-accent h-12 text-sm flex items-center justify-center gap-2"
          >
            <span>Open in the machine</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="h-12 rounded-full bg-ink-900 text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-emerald-400" />
            ) : (
              <DocumentDuplicateIcon className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy receipt'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.click();
            downloadReceiptImage(data);
          }}
          className="mt-2.5 w-full h-12 rounded-full bg-white text-ink-900 border border-ink-200 text-sm font-bold flex items-center justify-center gap-2"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span>Download receipt image</span>
        </button>
      </div>
    </div>
  );
};
