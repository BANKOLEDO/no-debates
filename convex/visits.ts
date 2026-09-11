import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Content-blind traffic counter. One doc per day + route.
// No IPs, no device ids, no question text. Purely aggregate.
export const trackPageView = mutation({
  args: { route: v.string() },
  handler: async (ctx, args) => {
    const day = new Date().toISOString().slice(0, 10);
    const existing = await ctx.db
      .query("visits")
      .withIndex("by_day", (q) => q.eq("day", day))
      .filter((q) => q.eq(q.field("route"), args.route))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert("visits", { day, route: args.route, count: 1 });
    }
  },
});