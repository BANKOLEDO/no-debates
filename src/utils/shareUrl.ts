import { DecisionRecord } from '../types';

// Encode decision data into a short URL hash (binary, not percent-encoded)
export function encodeDecisionToHash(data: {
  question: string;
  options: string[];
  verdict: string;
  timestamp: number;
}): string {
  try {
    const payload = JSON.stringify({
      q: data.question,
      o: data.options,
      v: data.options.indexOf(data.verdict),
      t: Math.floor(data.timestamp / 1000)
    });
    const bytes = new TextEncoder().encode(payload);
    let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch {
    return '';
  }
}

function normalizeRecord(parsed: any, shareCode: string): Partial<DecisionRecord> | null {
  if (!parsed || !parsed.q || !Array.isArray(parsed.o)) {
    return null;
  }
  const verdict = typeof parsed.v === 'number' ? parsed.o[parsed.v] : parsed.v;
  if (!verdict) {
    return null;
  }
  const rawT = parsed.t || 0;
  return {
    question: parsed.q,
    options: parsed.o,
    verdict,
    timestamp: rawT ? (rawT < 1e12 ? rawT * 1000 : rawT) : Date.now(),
    shareCode
  };
}

// Decode decision data from URL hash (reads current + legacy formats)
export function decodeDecisionFromHash(hash: string): Partial<DecisionRecord> | null {
  try {
    if (!hash) return null;
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!cleanHash) return null;

    let b64 = cleanHash.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';

    try {
      const bin = atob(b64);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return normalizeRecord(JSON.parse(new TextDecoder().decode(bytes)), cleanHash);
    } catch {
      return normalizeRecord(JSON.parse(decodeURIComponent(atob(b64))), cleanHash);
    }
  } catch {
    return null;
  }
}

// Share links use the /v/ path so unfurls render per-verdict previews
export function proofUrl(hash: string): string {
  return `${window.location.origin}/v/${hash}`;
}

// Short receipt code tied to the real proof hash
export function shortReceiptCode(hash: string): string {
  const clean = hash.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return (clean.slice(0, 5) + '00000').slice(0, 5);
}

// Chat receipt with WhatsApp/Telegram formatting
export function generateChatSummary(data: {
  id?: string;
  question: string;
  options: string[];
  verdict: string;
  timestamp: number;
  shareCode?: string;
  coinCount?: number;
  url?: string;
}): string {
  const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  const code = shortReceiptCode(data.shareCode || '');
  const lines = [
    `*NO DEBATES — SEALED VERDICT*`,
    ``,
    `Q: "${data.question}"`,
    ``,
    `*➡ ${data.verdict.toUpperCase()}*`,
    ``,
    `${data.options.length} options · ${time} · \`HASH #nd-${code}\``,
  ];
  if (data.url) lines.push('', data.url);
  lines.push('', `_No debates allowed._`);
  return lines.join('\n');
}

export function generateChatShareText(verdict: string, question: string, url: string): string {
  return `NO DEBATES: FINAL CALL\n\nQuestion: "${question}"\nLocked Verdict: [ ${verdict.toUpperCase()} ]\n\nOfficial receipt: ${url}\n(Decision sealed. No debates allowed.)`;
}
