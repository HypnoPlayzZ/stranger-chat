import { NextResponse } from "next/server";
import { auth } from "@/auth";

// In production, store reports in a database for moderation review
const reports: Array<{
  reporterEmail: string;
  roomId: string;
  reason: string;
  timestamp: number;
}> = [];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId, reason } = await req.json();

  if (!roomId || !reason) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  reports.push({
    reporterEmail: session.user.email,
    roomId,
    reason,
    timestamp: Date.now(),
  });

  // In production: flag user, auto-ban repeated offenders, notify moderators
  console.log(`[REPORT] Room: ${roomId}, Reason: ${reason}`);

  return NextResponse.json({ ok: true });
}
