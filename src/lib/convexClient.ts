import { ConvexReactClient } from "convex/react";

// Null until VITE_CONVEX_URL is set (run `npx convex dev` once to get one)
const url = (import.meta as any).env?.VITE_CONVEX_URL as string | undefined;

export const convexClient = url ? new ConvexReactClient(url) : null;
