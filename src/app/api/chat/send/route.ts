import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRoom } from "@/lib/matchmaker";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId, message, participantId } = await req.json();

  if (!roomId || !message || !participantId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const room = getRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (!room.participants.includes(participantId)) {
    return NextResponse.json({ error: "Not in room" }, { status: 403 });
  }

  await pusherServer.trigger(`room-${roomId}`, "new-message", {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: message,
    from: participantId,
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
