import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Squad rooms: friends join by link, add options, spin once
export default defineSchema({
  rooms: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    members: v.array(v.string()),
    status: v.union(v.literal("open"), v.literal("locked")),
    verdict: v.optional(v.string()),
    createdAt: v.number(),
  }),
  admins: defineTable({
    email: v.string(),
    passHash: v.string(),
    createdAt: v.number(),
  }),
  adminSessions: defineTable({
    token: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }),
  visits: defineTable({
    day: v.string(),
    route: v.string(),
    count: v.number(),
  }).index("by_day", ["day"]),
});
