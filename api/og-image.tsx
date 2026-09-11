import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

interface VerdictPayload {
  q: string;
  o: string[];
  v: number;
}

function decodePayload(p: string): VerdictPayload | null {
  try {
    let b64 = p.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (parsed.q && Array.isArray(parsed.o)) {
      const v = typeof parsed.v === 'number' ? parsed.v : parsed.o.indexOf(parsed.v);
      return { q: parsed.q, o: parsed.o, v };
    }
    const legacy = JSON.parse(decodeURIComponent(atob(b64)));
    if (!legacy.q || !Array.isArray(legacy.o)) return null;
    const v = typeof legacy.v === 'number' ? legacy.v : legacy.o.indexOf(legacy.v);
    return { q: legacy.q, o: legacy.o, v };
  } catch {
    return null;
  }
}

// Ticket image for link unfurls: /api/og-image?p=<payload>
export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = decodePayload(searchParams.get('p') || '');
  const verdict =
    data && data.v >= 0 && data.v < data.o.length ? data.o[data.v] : 'Unknown';
  const question = data?.q ?? 'A group decision';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#141312',
          color: '#ffffff',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#FF4A1C', fontWeight: 800, letterSpacing: 6 }}>
          SEALED VERDICT
        </div>
        <div style={{ fontSize: 88, fontWeight: 900, marginTop: 20, lineHeight: 1 }}>
          {verdict}
        </div>
        <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.6)', marginTop: 24 }}>
          {question}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
