import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personae — Talk to Scaler's founders & instructors",
  description:
    "A persona-based AI chat with Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra. Built for Scaler's Prompt Engineering assignment.",
  metadataBase: new URL("https://personae.local"),
  openGraph: {
    title: "Personae",
    description:
      "Chat with Anshuman, Abhimanyu, and Kshitij — three Scaler personalities, one interface.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-bg font-sans">{children}</body>
    </html>
  );
}
