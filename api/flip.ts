export const config = { runtime: "edge" };

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

// Binary base64 hash, same format the app uses for receipts.
function encodeHash(q: string, o: string[], verdict: string, ts: number): string {
  const payload = JSON.stringify({
    q,
    o,
    v: o.indexOf(verdict),
    t: Math.floor(ts / 1000),
  });
  const bytes = new TextEncoder().encode(payload);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: JSON_HEADERS,
  });
}

// Fair random verdict for integrations: POST /api/flip
// Body: { "question": "Who's on call?", "options": ["Sam","Alex","Rae"] }
// Response: { index, verdict, question, timestamp, hash, receiptUrl }
export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }
  if (req.method !== "POST") {
    return fail(405, "Use POST with a JSON body.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Body must be valid JSON.");
  }

  const obj = (body ?? {}) as Record<string, unknown>;
  const question =
    typeof obj.question === "string" ? obj.question.trim().slice(0, 80) : "";
  const options = Array.isArray(obj.options)
    ? obj.options.map((o) => String(o).trim()).filter(Boolean).slice(0, 12)
    : [];

  if (options.length < 2) {
    return fail(400, "Provide at least 2 non-empty options.");
  }

  const rand = crypto.getRandomValues(new Uint32Array(1))[0];
  const index = Math.floor((rand / 2 ** 32) * options.length);
  const verdict = options[index];
  const timestamp = Date.now();
  const hash = encodeHash(question || "Quick Choice", options, verdict, timestamp);
  const receiptUrl = `${new URL(req.url).origin}/v/${hash}`;

  return new Response(
    JSON.stringify({
      index,
      verdict,
      options,
      question,
      timestamp,
      hash,
      receiptUrl,
    }),
    { headers: JSON_HEADERS }
  );
}