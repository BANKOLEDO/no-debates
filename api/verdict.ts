export const config = { runtime: 'edge' };

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodePayload(p: string): { q: string; o: string[]; v: number } | null {
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

// Bot-friendly verdict page: crawlers read OG tags, humans bounce to the app
export default function handler(req: Request) {
  const url = new URL(req.url);
  const p = url.searchParams.get('p') || '';
  const data = decodePayload(p);
  const verdict =
    data && data.v >= 0 && data.v < data.o.length ? data.o[data.v] : 'A verdict';
  const question = data?.q ?? 'A group decision settled with zero debate.';
  const image = `${url.origin}/api/og-image?p=${encodeURIComponent(p)}`;

  const html = `<!doctype html><html><head><meta charset="utf-8" />
<title>${esc(verdict)} wins — No Debates</title>
<meta property="og:type" content="website" />
<meta property="og:site_name" content="No Debates" />
<meta property="og:title" content="${esc(verdict)} wins the debate" />
<meta property="og:description" content="${esc(question)}" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(verdict)} wins the debate" />
<meta name="twitter:description" content="${esc(question)}" />
<meta name="twitter:image" content="${image}" />
<meta http-equiv="refresh" content="0;url=/#${p}" />
</head><body style="background:#141312;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh"><p>Opening the sealed verdict…</p><script>location.replace('/#${p}')</script></body></html>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
