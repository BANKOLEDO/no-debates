import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface SquadRoom {
  _id: Id<"rooms">;
  question: string;
  options: string[];
  members: string[];
  status: "open" | "locked";
  verdict?: string;
  createdAt: number;
}

export function useRoom(roomId: string | null) {
  return useQuery(
    api.rooms.getRoom,
    roomId ? { roomId: roomId as Id<"rooms"> } : "skip"
  );
}

export function useSquadActions() {
  const createRoom = useMutation(api.rooms.createRoom);
  const addOption = useMutation(api.rooms.addOption);
  const spinRoom = useMutation(api.rooms.spinRoom);

  return {
    createRoom: (args: { question: string; name: string; option: string }) =>
      createRoom(args),
    addOption: (args: { roomId: string; name: string; option: string }) =>
      addOption({ ...args, roomId: args.roomId as Id<"rooms"> }),
    spinRoom: (roomId: string) =>
      spinRoom({ roomId: roomId as Id<"rooms"> }),
  };
}
