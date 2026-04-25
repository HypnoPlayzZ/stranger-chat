import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { destroyRoom } from "@/lib/matchmaker";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId, participantId } = await req.json();

  if (!roomId || !participantId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const room = destroyRoom(roomId);
  if (room) {
    await pusherServer.trigger(`room-${roomId}`, "partner-disconnected", {
      from: participantId,
    });
  }

  return NextResponse.json({ ok: true });
}
