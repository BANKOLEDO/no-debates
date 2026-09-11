import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

interface VerdictPayload {
  q: string;
  o: string[];
  v: number;
  t?: number;
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
      return { q: parsed.q, o: parsed.o, v, t: parsed.t };
    }
    const legacy = JSON.parse(decodeURIComponent(atob(b64)));
    if (!legacy.q || !Array.isArray(legacy.o)) return null;
    const v = typeof legacy.v === "number" ? legacy.v : legacy.o.indexOf(legacy.v);
    return { q: legacy.q, o: legacy.o, v, t: legacy.t };
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

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function receiptCode(p: string): string {
  return (p.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase() + "00000").slice(0, 5);
}

function stamp(ts: number): string {
  const d = new Date((ts > 1e12 ? ts : ts * 1000) || Date.now());
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}

// Ticket image for link unfurls: /api/og-image?p=<payload>
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const p = searchParams.get("p") || "";
  const data = decodePayload(p);
  const verdict =
    data && data.v >= 0 && data.v < data.o.length ? data.o[data.v] : "Unknown";
  const question = data?.q ?? "A group decision";
  const options = (data?.o ?? []).filter((o) => o !== verdict).slice(0, 3);

  const font = await getFont();

  const svg = await satori(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#141312",
        color: "#ffffff",
        padding: "64px 72px",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              background: "#FF4A1C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: "#141312",
              }}
            />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1 }}>
            NO DEBATES
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontWeight: 800,
            color: "#8C8A86",
            letterSpacing: 3,
          }}
        >
          {data?.t ? (
            <span
              style={{
                color: "#141312",
                background: "#FF4A1C",
                borderRadius: 999,
                padding: "10px 22px",
                letterSpacing: 1,
              }}
            >
              FAIR SELECTOR
            </span>
          ) : null}
          SEALED VERDICT
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1, marginTop: 6 }}>
          {truncate(verdict, 22)}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.6)",
            marginTop: 20,
            fontWeight: 800,
          }}
        >
          {truncate(question, 70)}
        </div>

        {options.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 34,
            }}
          >
            {options.map((o) => (
              <div
                key={o}
                style={{
                  border: "2px dashed rgba(255,255,255,0.22)",
                  borderRadius: 999,
                  padding: "14px 26px",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {truncate(o, 26)}
              </div>
            ))}
            <div
              style={{
                borderRadius: 999,
                padding: "14px 26px",
                fontSize: 24,
                fontWeight: 800,
                color: "#141312",
                background: "#FF4A1C",
              }}
            >
              {truncate(verdict, 26)}
            </div>
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px dashed rgba(255,255,255,0.28)",
          paddingTop: 26,
          fontSize: 22,
          fontWeight: 800,
          color: "#8C8A86",
        }}
      >
        <span>
          {stamp(data?.t ?? 0)} · {options.length + 1} weighed
        </span>
        <span style={{ fontFamily: "monospace" }}>HASH #ND-{receiptCode(p)}</span>
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
