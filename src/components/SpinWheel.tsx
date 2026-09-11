import React, { useEffect, useRef } from 'react';

interface SpinRequest {
  winnerIndex: number;
  nonce: number;
}

interface SpinWheelProps {
  options: string[];
  verdict: string | null;
  request: SpinRequest | null;
  onTick: () => void;
  onSettled: (winnerIndex: number) => void;
  onClip?: (blob: Blob, ext: string) => void;
}

const TAU = Math.PI * 2;
const SIZE = 320;

// Canvas prize wheel, pointer fixed at top
export const SpinWheel: React.FC<SpinWheelProps> = ({
  options,
  verdict,
  request,
  onTick,
  onSettled,
  onClip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  const draw = (rotation: number, highlight: number | null) => {
    const canvas = canvasRef.current;
    if (!canvas || options.length < 2) return;
    const dpr = window.devicePixelRatio || 1;
    const k = Math.min(2.5, 2 * dpr);
    const px = Math.round(SIZE * k);
    if (canvas.width !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const r = SIZE / 2 - 12;
    const seg = TAU / options.length;

    options.forEach((opt, i) => {
      const a0 = rotation + i * seg;
      const a1 = a0 + seg;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1);
      ctx.closePath();
      ctx.fillStyle = highlight === i ? '#FF4A1C' : i % 2 === 0 ? '#FFFFFF' : '#F3EFE7';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E2DCCC';
      ctx.stroke();

      const label = opt.length > 14 ? `${opt.slice(0, 13)}…` : opt;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a0 + seg / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = highlight === i ? '#FFFFFF' : '#141312';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(label, r - 10, 0);
      ctx.restore();
    });

    // Rim with accent pinstripe and studs
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, TAU);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#141312';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, TAU);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FF4A1C';
    ctx.stroke();
    ctx.fillStyle = '#F6F1E7';
    for (let s = 0; s < options.length; s++) {
      const a = rotation + (s + 0.5) * seg;
      ctx.beginPath();
      ctx.arc(cx + (r + 5) * Math.cos(a), cy + (r + 5) * Math.sin(a), 2, 0, TAU);
      ctx.fill();
    }

    // Hub with the decider mark: broken ring, center node, orbit dot
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, TAU);
    ctx.fillStyle = '#141312';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, TAU);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#F6F1E7';
    ctx.stroke();
    // Broken ring (gap at lower right, caught mid-spin)
    ctx.beginPath();
    ctx.arc(cx, cy, 14, Math.PI * 0.35, Math.PI * 1.95);
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FF4A1C';
    ctx.stroke();
    // Orbit dot sitting in the gap
    const dotA = Math.PI * 0.15;
    ctx.beginPath();
    ctx.arc(cx + 14 * Math.cos(dotA), cy + 14 * Math.sin(dotA), 2.6, 0, TAU);
    ctx.fillStyle = '#FAF8F5';
    ctx.fill();
    // Center node
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, TAU);
    ctx.fillStyle = '#FF4A1C';
    ctx.fill();

    // Pointer needle with pivot
    ctx.beginPath();
    ctx.moveTo(cx - 10, 0);
    ctx.lineTo(cx + 10, 0);
    ctx.lineTo(cx, 24);
    ctx.closePath();
    ctx.fillStyle = '#FF4A1C';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#141312';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, 6, 4, 0, TAU);
    ctx.fillStyle = '#141312';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, 6, 1.6, 0, TAU);
    ctx.fillStyle = '#FAF8F5';
    ctx.fill();
  };

  // Redraw on content change
  const verdictIndex = verdict ? options.indexOf(verdict) : -1;
  useEffect(() => {
    draw(rotationRef.current, verdictIndex >= 0 ? verdictIndex : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, verdict]);

  // Records each spin for clip export
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onClipRef = useRef(onClip);
  onClipRef.current = onClip;

  const stopRecording = () => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (!rec) return;
    if (rec.state !== 'inactive') {
      try {
        rec.stop();
      } catch {
      }
    }
  };

  // Animate to the requested winner
  useEffect(() => {
    if (!request || options.length < 2) return;
    const seg = TAU / options.length;
    const center = (request.winnerIndex + 0.5) * seg;
    const base = -Math.PI / 2 - center;
    const cur = rotationRef.current;
    const delta = (((base - cur) % TAU) + TAU) % TAU;
    const target = cur + delta + TAU * 6;
    const duration = 4200;
    const t0 = performance.now();
    let raf = 0;
    let lastSeg = -1;
    let lastTick = 0;

    // Start clip capture, handlers attached before recording
    try {
      const canvas = canvasRef.current;
      if (canvas && typeof canvas.captureStream === 'function' && typeof MediaRecorder !== 'undefined') {
        const mime = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
        const stream = canvas.captureStream(30);
        const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
        chunksRef.current = [];
        rec.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
        };
        rec.onstop = () => {
          const ext = rec.mimeType.includes('mp4') ? 'mp4' : 'webm';
          if (chunksRef.current.length > 0) {
            onClipRef.current?.(new Blob(chunksRef.current, { type: rec.mimeType }), ext);
          }
          chunksRef.current = [];
        };
        rec.start(250);
        recorderRef.current = rec;
      }
    } catch {
    }

    const frame = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 5);
      const rot = cur + (target - cur) * eased;
      rotationRef.current = rot;
      const under = Math.floor((((-Math.PI / 2 - rot) % TAU) + TAU) % TAU / seg);
      if (under !== lastSeg) {
        lastSeg = under;
        if (t - lastTick > 70) {
          lastTick = t;
          onTickRef.current();
        }
      }
      draw(rot, null);
      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        draw(target, request.winnerIndex);
        stopRecording();
        onSettledRef.current(request.winnerIndex);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: 320, aspectRatio: '1 / 1' }}
      role="img"
      aria-label={verdict ? `Winner: ${verdict}` : 'Decision wheel'}
    />
  );
};
