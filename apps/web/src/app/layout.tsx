import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/shell/SiteNav";
import { SiteFooter } from "@/components/shell/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Startup Village Borneo 2026",
    template: "%s · Startup Village Borneo",
  },
  description:
    "Solana-first hackathon in Kuching, Sarawak — 5–9 September 2026. Schedule, Amazing Race, prizes, and the full builder experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-null)] text-[var(--color-wisp)]">
        <SiteNav />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
