import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supreme Labs",
  description:
    "The world's most powerful AI platform for Chat, Image, Video, Code, Voice, PDF, and Productivity.",
  keywords: [
    "AI Chat",
    "AI Image Generator",
    "AI Video",
    "AI Code Assistant",
    "AI Tools",
    "Supreme Labs",
  ],
  authors: [{ name: "Supreme Labs" }],
  creator: "Supreme Labs",
  openGraph: {
    title: "Supreme Labs",
    description:
      "One powerful AI platform for Chat, Image, Video, Code, Voice, PDF and Productivity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}