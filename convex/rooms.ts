import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const clean = (s: string) => s.trim().slice(0, 80);

export const createRoom = mutation({
  args: { question: v.string(), name: v.string(), option: v.string() },
  handler: async (ctx, args) => {
    const question = clean(args.question) || "What are we deciding?";
    const name = clean(args.name) || "Player 1";
    const option = clean(args.option);
    return await ctx.db.insert("rooms", {
      question,
      options: option ? [option] : [],
      members: [name],
      status: "open",
      verdict: undefined,
      createdBy: name,
      createdAt: Date.now(),
    });
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const addOption = mutation({
  args: { roomId: v.id("rooms"), name: v.string(), option: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room || room.status !== "open") return;
    const name = clean(args.name);
    const option = clean(args.option);
    if (!option || room.options.length >= 12 || room.options.includes(option)) return;
    await ctx.db.patch(args.roomId, {
      options: [...room.options, option],
      members: name && !room.members.includes(name) ? [...room.members, name] : room.members,
    });
  },
});

// Only the creator who opened the room may seal the verdict.
export const spinRoom = mutation({
  args: { roomId: v.id("rooms"), spinner: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room || room.status !== "open" || room.options.length < 2) return;
    if (room.createdBy && clean(args.spinner) !== room.createdBy) return;
    const winner = room.options[Math.floor(Math.random() * room.options.length)];
    await ctx.db.patch(args.roomId, { status: "locked", verdict: winner });
  },
});
