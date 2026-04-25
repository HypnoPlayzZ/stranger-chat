import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addToQueue, removeFromQueue, getOnlineCount } from "@/lib/matchmaker";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const interests: string[] = body.interests || [];

  const result = addToQueue(session.user.email, interests);

  if (result.status === "matched") {
    // Notify the waiting partner that they've been matched
    await pusherServer.trigger(
      `user-${result.partnerId}`,
      "matched",
      { roomId: result.roomId, sharedInterests: result.sharedInterests }
    );

    return NextResponse.json({
      status: "matched",
      roomId: result.roomId,
      participantId: result.participantId,
      sharedInterests: result.sharedInterests,
      onlineCount: getOnlineCount(),
    });
  }

  return NextResponse.json({
    status: "waiting",
    participantId: result.participantId,
    onlineCount: getOnlineCount(),
  });
}

// Cancel searching
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const participantId = searchParams.get("participantId");

  if (participantId) {
    removeFromQueue(participantId);
  }

  return NextResponse.json({ ok: true });
}
