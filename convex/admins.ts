import { mutation } from "./_generated/server";
import { v } from "convex/values";

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function validToken(ctx: any, token: string): Promise<boolean> {
  if (!token) return false;
  const session = await ctx.db
    .query("adminSessions")
    .filter((q: any) => q.eq(q.field("token"), token))
    .first();
  return !!session;
}

// One-time bootstrap from your terminal:
//   npx convex run admins:seed '{"email":"you@mail.com","passcode":"long-secret-code"}' --prod
// Refuses once an admin exists.
export const seed = mutation({
  args: { email: v.string(), passcode: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("admins").take(1);
    if (existing.length > 0) throw new Error("Admin already seeded");
    const email = args.email.trim().toLowerCase();
    if (!email || args.passcode.length < 8) {
      throw new Error("Email and 8+ character passcode required");
    }
    await ctx.db.insert("admins", {
      email,
      passHash: await sha256Hex(`${email}:${args.passcode}`),
      createdAt: Date.now(),
    });
    return { ok: true };
  },
});

export const login = mutation({
  args: { email: v.string(), passcode: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const admin = await ctx.db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    if (!admin) return null;
    const hash = await sha256Hex(`${email}:${args.passcode}`);
    if (hash !== admin.passHash) return null;
    const token = crypto.randomUUID();
    await ctx.db.insert("adminSessions", { token, email, createdAt: Date.now() });
    return { token };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return { ok: true };
  },
});
