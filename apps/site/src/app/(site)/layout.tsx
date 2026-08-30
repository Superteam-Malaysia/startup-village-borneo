import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { AppShell } from "@/components/layout/AppShell";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Navbar />
      <main>{children}</main>
      <ConditionalFooter />
    </AppShell>
  );
}
