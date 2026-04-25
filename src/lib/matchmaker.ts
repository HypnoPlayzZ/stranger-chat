import { v4 as uuidv4 } from "uuid";

export interface WaitingUser {
  participantId: string;
  sessionUserId: string;
  interests: string[];
  joinedAt: number;
}

export interface ActiveRoom {
  roomId: string;
  participants: [string, string]; // participantIds
  createdAt: number;
}

// In-memory stores (use Redis in production for multi-instance scaling)
const waitingQueue: Map<string, WaitingUser> = new Map();
const activeRooms: Map<string, ActiveRoom> = new Map();
// Map participantId -> roomId for quick lookup
const participantRooms: Map<string, string> = new Map();

// Clean up stale waiting users (older than 2 minutes)
function cleanStaleUsers() {
  const now = Date.now();
  for (const [id, user] of waitingQueue) {
    if (now - user.joinedAt > 120_000) {
      waitingQueue.delete(id);
    }
  }
}

export function addToQueue(
  sessionUserId: string,
  interests: string[]
): { status: "waiting"; participantId: string } | { status: "matched"; roomId: string; participantId: string; partnerId: string; sharedInterests: string[] } {
  cleanStaleUsers();

  // Prevent duplicate entries for same session user
  for (const [, user] of waitingQueue) {
    if (user.sessionUserId === sessionUserId) {
      waitingQueue.delete(user.participantId);
    }
  }

  const participantId = uuidv4();
  const newUser: WaitingUser = {
    participantId,
    sessionUserId,
    interests: interests.map((i) => i.toLowerCase().trim()),
    joinedAt: Date.now(),
  };

  // Try to find a match — prioritize shared interests
  let bestMatch: WaitingUser | null = null;
  let bestScore = -1;

  for (const [, waiting] of waitingQueue) {
    // Don't match with yourself
    if (waiting.sessionUserId === sessionUserId) continue;

    // Calculate interest overlap
    const sharedInterests = newUser.interests.filter((i) =>
      waiting.interests.includes(i)
    ).length;

    if (sharedInterests > bestScore) {
      bestScore = sharedInterests;
      bestMatch = waiting;
    } else if (bestScore <= 0 && !bestMatch) {
      // No interest match yet, take first available
      bestMatch = waiting;
    }
  }

  if (bestMatch) {
    // Remove matched user from queue
    waitingQueue.delete(bestMatch.participantId);

    // Create room
    const roomId = uuidv4();
    const room: ActiveRoom = {
      roomId,
      participants: [participantId, bestMatch.participantId],
      createdAt: Date.now(),
    };
    activeRooms.set(roomId, room);
    participantRooms.set(participantId, roomId);
    participantRooms.set(bestMatch.participantId, roomId);

    const sharedInterests = newUser.interests.filter((i) =>
      bestMatch!.interests.includes(i)
    );

    return {
      status: "matched",
      roomId,
      participantId,
      partnerId: bestMatch.participantId,
      sharedInterests,
    };
  }

  // No match — add to queue
  waitingQueue.set(participantId, newUser);
  return { status: "waiting", participantId };
}

export function removeFromQueue(participantId: string): void {
  waitingQueue.delete(participantId);
}

export function getRoom(roomId: string): ActiveRoom | undefined {
  return activeRooms.get(roomId);
}

export function getRoomByParticipant(participantId: string): ActiveRoom | undefined {
  const roomId = participantRooms.get(participantId);
  if (!roomId) return undefined;
  return activeRooms.get(roomId);
}

export function destroyRoom(roomId: string): ActiveRoom | undefined {
  const room = activeRooms.get(roomId);
  if (room) {
    for (const pid of room.participants) {
      participantRooms.delete(pid);
    }
    activeRooms.delete(roomId);
  }
  return room;
}

export function getOnlineCount(): number {
  return waitingQueue.size + activeRooms.size * 2;
}

export function getQueueSize(): number {
  return waitingQueue.size;
}
