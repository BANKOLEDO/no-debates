import { shortReceiptCode } from './shareUrl';

interface ReceiptData {
  question: string;
  options: string[];
  verdict: string;
  timestamp: number;
  hash: string;
}

const INK = '#141312';
const ACCENT = '#FF4A1C';
const GREEN = '#2FD180';
const FONT = '"Plus Jakarta Sans", Arial, sans-serif';

// Dark ticket render of the sealed verdict
export async function downloadReceiptImage(data: ReceiptData): Promise<void> {
  const S = 2;
  const W = 600;
  const P = 48;

  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) return;

  const wrap = (text: string, font: string, maxW: number, maxLines: number): string[] => {
    measure.font = font;
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (measure.measureText(test).width > maxW && line) {
        lines.push(line);
        line = word;
        if (lines.length === maxLines) {
          lines[maxLines - 1] = `${lines[maxLines - 1].replace(/…?$/, '')}…`;
          return lines;
        }
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines.slice(0, maxLines);
  };

  const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const date = new Date(data.timestamp)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();

  const vFont = `800 54px ${FONT}`;
  const qFont = `400 20px ${FONT}`;
  const oFont = `400 15px ${FONT}`;

  const vLines = wrap(data.verdict.toUpperCase(), vFont, W - P * 2, 3);
  const qLines = wrap(`"${data.question}"`, qFont, W - P * 2, 2);
  const others = data.options.filter((o) => o !== data.verdict);
  const oLines = wrap(
    others.length > 0 ? `Also considered: ${others.join('  ·  ')}` : 'The only option that mattered.',
    oFont,
    W - P * 2,
    2
  );

  const H =
    P + 36 + 30 + 18 + 18 +
    qLines.length * 38 + 28 +
    vLines.length * 72 + 18 +
    34 + 46 +
    oLines.length * 21 + 26 +
    20 + 32 + 18 + P;

  const cv = document.createElement('canvas');
  cv.width = W * S;
  cv.height = Math.ceil(H) * S;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.scale(S, S);

  const white = (a: number) => `rgba(255, 255, 255, ${a})`;

  // Ticket base
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  let y = P;

  // Header: mark + title + time
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.arc(P + 18, y + 18, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(P + 18, y + 18, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.arc(P + 18, y + 18, 3.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 17px ${FONT}`;
  ctx.fillText('NO DEBATES VERDICT', P + 48, y + 24);
  ctx.fillStyle = white(0.55);
  ctx.font = `600 14px ${FONT}`;
  const stamp = `${date} // ${time.toUpperCase()}`;
  ctx.fillText(stamp, W - P - measure.measureText(stamp).width, y + 23);
  y += 36 + 30;

  // Eyebrow
  ctx.fillStyle = ACCENT;
  ctx.font = `800 13px ${FONT}`;
  ctx.fillText('S E A L E D   V E R D I C T', P, y);
  y += 18 + 30;

  // Question first
  ctx.fillStyle = white(0.65);
  ctx.font = qFont;
  qLines.forEach((line) => {
    ctx.fillText(line, P, y);
    y += 38;
  });
  y += 28;

  // Verdict, huge
  ctx.fillStyle = '#FFFFFF';
  ctx.font = vFont;
  vLines.forEach((line, i) => {
    ctx.fillText(line, P, y);
    if (i === vLines.length - 1) {
      const wline = measure.measureText(line).width;
      ctx.fillStyle = ACCENT;
      ctx.fillText('.', P + wline + 4, y);
      ctx.fillStyle = '#FFFFFF';
    }
    y += 72;
  });
  y += 18;

  // Meta pills
  const pills = [`${date} · ${time}`, `#nd-${shortReceiptCode(data.hash)}`, `${data.options.length} options weighed`];
  ctx.font = `700 14px ${FONT}`;
  let px = P;
  pills.forEach((pill) => {
    const pw = measure.measureText(pill).width + 32;
    ctx.fillStyle = white(0.1);
    ctx.beginPath();
    ctx.roundRect(px, y - 24, pw, 34, 17);
    ctx.fill();
    ctx.fillStyle = white(0.85);
    ctx.fillText(pill, px + 16, y);
    px += pw + 10;
  });
  y += 46;

  // Perforation
  ctx.strokeStyle = white(0.28);
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 8]);
  ctx.beginPath();
  ctx.moveTo(P, y);
  ctx.lineTo(W - P, y);
  ctx.stroke();
  ctx.setLineDash([]);
  const perfY = y;
  y += 26;

  // Stub: options
  ctx.fillStyle = white(0.55);
  ctx.font = oFont;
  oLines.forEach((line) => {
    ctx.fillText(line, P, y);
    y += 21;
  });
  y += 20;

  // Stub footer
  ctx.fillStyle = white(0.7);
  ctx.font = `600 14px ui-monospace, monospace`;
  ctx.fillText(`HASH: #nd-${shortReceiptCode(data.hash)}`, P, y);
  ctx.fillStyle = GREEN;
  ctx.font = `800 14px ${FONT}`;
  const unbiased = '100% UNBIASED';
  ctx.fillText(unbiased, W - P - measure.measureText(unbiased).width, y);
  y += 32;

  // Brand
  const host = (typeof window !== 'undefined' && window.location.hostname) || 'nodebates.app';
  ctx.fillStyle = white(0.45);
  ctx.font = `600 14px ${FONT}`;
  const brand = `${host} · No debates allowed.`;
  ctx.fillText(brand, (W - measure.measureText(brand).width) / 2, y);

  // Punch the perforation notches
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, perfY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W, perfY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Round the ticket corners (destination-in keeps the inside)
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 28);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Edge
  ctx.strokeStyle = white(0.14);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(2, 2, W - 4, H - 4, 26);
  ctx.stroke();

  const blob = await new Promise<Blob | null>((resolve) => cv.toBlob(resolve, 'image/png'));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = data.verdict.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'verdict';
  a.download = `no-debates-${slug}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
