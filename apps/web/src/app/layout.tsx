import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Village Borneo",
  description: "Event companion dApp — design system and UI library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
