import type { Metadata } from "next";
import "./globals.css";
import { HalftoneShell } from "@/components/halftone";
import { SiteNav } from "@/components/shell/SiteNav";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { ScrollToTop } from "@/components/shell/ScrollToTop";
import { navAuthLink } from "@/lib/auth/nav-auth-link";
import { getParticipantForSession } from "@/lib/auth/participant";
import { rootMetadata } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const participant = await getParticipantForSession();
  const authLink = navAuthLink(participant);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-[var(--color-wisp)]">
        <HalftoneShell>
          <ScrollToTop />
          <SiteNav authLink={authLink} />
          <div className="site-content">{children}</div>
          <SiteFooter />
        </HalftoneShell>
      </body>
    </html>
  );
}
