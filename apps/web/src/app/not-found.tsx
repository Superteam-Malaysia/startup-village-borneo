import Link from "next/link";
import { CtaButton } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-24 md:py-32 flex flex-col items-start gap-8">
      <p className="text-eyebrow">404</p>
      <h1 className="hero-display max-w-2xl">
        Page not
        <br />
        <span className="hero-display-accent">found</span>
      </h1>
      <p className="max-w-md text-[var(--color-wisp)]/70 leading-relaxed">
        This route isn&apos;t on the program map. Head home or jump to the schedule.
      </p>
      <div className="flex flex-wrap gap-4">
        <CtaButton href="/" variant="byte" size="md">Home</CtaButton>
        <CtaButton href="/schedule" variant="ghost-wisp" size="md" showArrow={false}>Schedule</CtaButton>
      </div>
      <Link
        href="/amazing-race"
        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-wisp)]/50 hover:text-[var(--color-byte)] transition-colors"
      >
        Amazing Race →
      </Link>
    </main>
  );
}
