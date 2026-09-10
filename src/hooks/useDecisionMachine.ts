import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/sound';
import { DecisionRecord, DecisionPreset } from '../types';
import { encodeDecisionToHash, generateChatSummary } from '../utils/shareUrl';
import { PRESETS } from '../utils/presets';

interface UseDecisionMachineOptions {
  onSaveRecord: (record: DecisionRecord) => void;
  initialData?: Partial<DecisionRecord> | null;
  presets?: DecisionPreset[];
}

// All decider state + logic in one place
export function useDecisionMachine({
  onSaveRecord,
  initialData,
  presets = PRESETS,
}: UseDecisionMachineOptions) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dinner');
  const [question, setQuestion] = useState<string>("Where are we eating tonight?");
  const [options, setOptions] = useState<string[]>([
    'Ramen Bowl',
    'Street Tacos',
    'Smash Burgers',
    'Woodfire Pizza',
    'Thai Curry'
  ]);
  const [newOptionInput, setNewOptionInput] = useState<string>('');
  const [verdict, setVerdict] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinRequest, setSpinRequest] = useState<{ winnerIndex: number; nonce: number } | null>(null);
  const [clip, setClip] = useState<{ blob: Blob; ext: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.question) setQuestion(initialData.question);
      if (initialData.options && initialData.options.length > 0) setOptions(initialData.options);
      if (initialData.verdict) setVerdict(initialData.verdict);
    }
  }, [initialData]);

  const applyPreset = (presetId: string) => {
    const found = presets.find(p => p.id === presetId);
    if (!found) return;
    sound.tap();
    setSelectedPresetId(presetId);
    setQuestion(found.question);
    setOptions([...found.options]);
    setVerdict(null);
  };

  const addOption = () => {
    const trimmed = newOptionInput.trim();
    if (!trimmed || options.length >= 12 || options.includes(trimmed)) return;
    sound.tap();
    setOptions([...options, trimmed]);
    setNewOptionInput('');
  };

  const removeOption = (indexToRemove: number) => {
    if (options.length <= 2) return;
    sound.tap();
    setOptions(options.filter((_, idx) => idx !== indexToRemove));
  };

  const shuffleOptions = () => {
    if (isSpinning || options.length < 2) return;
    sound.tap();
    setOptions([...options].sort(() => Math.random() - 0.5));
    setVerdict(null);
  };

  const spinDecision = () => {
    if (isSpinning || options.length < 2) return;

    sound.coin();
    setIsSpinning(true);
    setVerdict(null);
    setCopied(false);
    setCopiedLink(false);
    setClip(null);

    const winnerIndex = Math.floor(Math.random() * options.length);
    setSpinRequest({ winnerIndex, nonce: Date.now() });
  };

  const handleSpinTick = () => {
    sound.tick();
  };

  const handleSpinSettled = (winnerIndex: number) => {
    const winner = options[winnerIndex];
    setIsSpinning(false);
    setVerdict(winner);
    sound.win();

    try {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#FF4A1C', '#141312', '#FEECE2', '#FFFFFF']
      });
    } catch {
    }

    const record: DecisionRecord = {
      id: Math.random().toString(36).substring(2, 9),
      question: question.trim() || 'Quick Choice',
      options: [...options],
      verdict: winner,
      timestamp: Date.now(),
      shareCode: '',
      coinCount: 1
    };
    record.shareCode = encodeDecisionToHash(record);
    onSaveRecord(record);
  };

  // Spacebar spins
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpinning) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          spinDecision();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, isSpinning, question]);

  const handleClipReady = (blob: Blob, ext: string) => {
    setClip({ blob, ext });
  };

  const handleClipDownload = () => {
    if (!clip) return;
    sound.click();
    const url = URL.createObjectURL(clip.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `no-debates-spin.${clip.ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleCopyChat = () => {
    if (!verdict) return;
    sound.tap();
    const timestamp = Date.now();
    const hash = encodeDecisionToHash({
      question,
      options,
      verdict,
      timestamp
    });
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    const chatText = generateChatSummary({
      id: 'shared',
      question: question || 'Decision',
      options,
      verdict,
      timestamp,
      shareCode: hash,
      coinCount: 1,
      url
    });
    navigator.clipboard.writeText(chatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyLink = () => {
    if (!verdict) return;
    sound.tap();
    const hash = encodeDecisionToHash({
      question,
      options,
      verdict,
      timestamp: Date.now()
    });
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return {
    selectedPresetId,
    question,
    setQuestion,
    options,
    newOptionInput,
    setNewOptionInput,
    verdict,
    isSpinning,
    spinRequest,
    clip,
    copied,
    copiedLink,
    presets,
    applyPreset,
    addOption,
    removeOption,
    shuffleOptions,
    spinDecision,
    handleSpinTick,
    handleSpinSettled,
    handleClipReady,
    handleClipDownload,
    handleCopyChat,
    handleCopyLink,
  };
}

export type DecisionMachineApi = ReturnType<typeof useDecisionMachine>;
