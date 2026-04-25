import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRoom } from "@/lib/matchmaker";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId, participantId, isTyping } = await req.json();

  if (!roomId || !participantId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const room = getRoom(roomId);
  if (!room || !room.participants.includes(participantId)) {
    return NextResponse.json({ error: "Not in room" }, { status: 403 });
  }

  await pusherServer.trigger(`room-${roomId}`, "typing", {
    from: participantId,
    isTyping: !!isTyping,
  });

  return NextResponse.json({ ok: true });
}
