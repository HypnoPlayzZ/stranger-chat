import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ChatApp from "@/components/ChatApp";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-[#09090b]">
      <ChatApp />
    </div>
  );
}
