import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whispr - Talk to Strangers, Stay Anonymous",
  description:
    "Dive into anonymous conversations with random strangers worldwide. No sign-up, no identity, no judgment — just raw, real human connection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
