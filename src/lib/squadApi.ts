import { useMutation, useQuery } from "convex/react";

export interface SquadRoom {
  _id: string;
  question: string;
  options: string[];
  members: string[];
  status: "open" | "locked";
  verdict?: string;
  createdAt: number;
}

// Function paths are strings until `npx convex dev` generates typed api
export function useRoom(roomId: string | null): SquadRoom | undefined | null {
  return useQuery(
    "rooms:getRoom" as any,
    roomId ? ({ roomId } as any) : "skip"
  ) as any;
}

export function useSquadActions() {
  const createRoom = useMutation("rooms:createRoom" as any);
  const addOption = useMutation("rooms:addOption" as any);
  const spinRoom = useMutation("rooms:spinRoom" as any);

  return {
    createRoom: (args: { question: string; name: string; option: string }) =>
      createRoom(args as any) as Promise<string>,
    addOption: (args: { roomId: string; name: string; option: string }) =>
      addOption(args as any) as Promise<void>,
    spinRoom: (roomId: string) =>
      spinRoom({ roomId } as any) as Promise<void>,
  };
}
