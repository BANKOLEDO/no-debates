import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

interface VerdictPayload {
  q: string;
  o: string[];
  v: number;
}

function decodePayload(p: string): VerdictPayload | null {
  try {
    let b64 = p.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (parsed.q && Array.isArray(parsed.o)) {
      const v = typeof parsed.v === "number" ? parsed.v : parsed.o.indexOf(parsed.v);
      return { q: parsed.q, o: parsed.o, v };
    }
    const legacy = JSON.parse(decodeURIComponent(atob(b64)));
    if (!legacy.q || !Array.isArray(legacy.o)) return null;
    const v = typeof legacy.v === "number" ? legacy.v : legacy.o.indexOf(legacy.v);
    return { q: legacy.q, o: legacy.o, v };
  } catch {
    return null;
  }
}

let cachedFont: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }
  ).then((r) => r.text());
  const urls = [...css.matchAll(/url\((https:[^)]+?\.woff2)\)/g)].map((m) => m[1]);
  const latin = urls[urls.length - 1];
  if (!latin) throw new Error("font css parse failed");
  const buf: ArrayBuffer = await fetch(latin).then((r) => r.arrayBuffer());
  cachedFont = buf;
  return buf;
}

// Ticket image for link unfurls: /api/og-image?p=<payload>
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = decodePayload(searchParams.get("p") || "");
  const verdict =
    data && data.v >= 0 && data.v < data.o.length ? data.o[data.v] : "Unknown";
  const question = data?.q ?? "A group decision";

  const font = await getFont();

  const svg = await satori(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#141312",
        color: "#ffffff",
        padding: 80,
        fontFamily: "Inter",
      }}
    >
      <div style={{ fontSize: 28, color: "#FF4A1C", fontWeight: 800, letterSpacing: 6 }}>
        SEALED VERDICT
      </div>
      <div style={{ fontSize: 88, fontWeight: 900, marginTop: 20, lineHeight: 1 }}>
        {verdict}
      </div>
      <div style={{ fontSize: 32, color: "rgba(255,255,255,0.6)", marginTop: 24 }}>
        {question}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: font, weight: 900, style: "normal" },
        { name: "Inter", data: font, weight: 800, style: "normal" },
      ],
    }
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();

  return new Response(png as unknown as BodyInit, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
