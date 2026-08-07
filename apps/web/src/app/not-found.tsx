import Link from "next/link";
import { PageHeader } from "@/components/shell";
import { CtaButton } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-24 md:py-32 flex flex-col items-start gap-8">
      <PageHeader meta="404" title="Page not found" lead="This route isn't on the program map. Head home or jump to the schedule." />
      <div className="flex flex-wrap gap-4">
        <CtaButton href="/" variant="byte" size="md">Home</CtaButton>
        <CtaButton href="/schedule" variant="ghost-wisp" size="md" showArrow={false}>Schedule</CtaButton>
      </div>
      <Link
        href="/amazing-race"
        className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-wisp)]/50 hover:text-[var(--color-byte)] transition-colors"
      >
        Amazing Race →
      </Link>
    </main>
  );
}
