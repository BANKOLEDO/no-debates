import { query } from "./_generated/server";
import { v } from "convex/values";
import { validToken } from "./admins";

// Content-blind aggregates for the admin dashboard.
// Counts and dates only. Never returns questions, options, or names.
export const overview = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!(await validToken(ctx, args.token))) return null;
    const rooms = await ctx.db.query("rooms").collect();

    let open = 0;
    let locked = 0;
    let options = 0;
    let members = 0;
    const byDay: Record<string, number> = {};

    for (const room of rooms) {
      if (room.status === "open") open += 1;
      else locked += 1;
      options += room.options.length;
      members += room.members.length;
      const day = new Date(room.createdAt).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
    }

    const visits = await ctx.db.query("visits").collect();
    const visitsByDay: Record<string, number> = {};
    const topRoutes: Record<string, number> = {};
    let totalViews = 0;
    for (const visit of visits) {
      visitsByDay[visit.day] = (visitsByDay[visit.day] ?? 0) + visit.count;
      topRoutes[visit.route] = (topRoutes[visit.route] ?? 0) + visit.count;
      totalViews += visit.count;
    }

    const allDays = new Set([...Object.keys(byDay), ...Object.keys(visitsByDay)]);
    const trend: { day: string; rooms: number; views: number }[] = [...allDays]
      .sort()
      .slice(-14)
      .map((day) => ({
        day,
        rooms: byDay[day] ?? 0,
        views: visitsByDay[day] ?? 0,
      }));

    return {
      rooms: rooms.length,
      open,
      locked,
      options,
      members,
      byDay,
      totalViews,
      visitsByDay,
      topRoutes,
      trend,
    };
  },
});
