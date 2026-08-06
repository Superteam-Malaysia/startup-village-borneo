import Link from "next/link";
import { CtaButton } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-8">
      <p className="text-eyebrow">Startup Village Borneo</p>
      <h1
        className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-tight tracking-tight text-[var(--color-wisp)] max-w-3xl"
      >
        UI library — Breakpoint layout + Halftone data surfaces
      </h1>
      <p className="text-[var(--color-wisp)]/70 max-w-lg">
        Breakpoint-derived chrome (CTAs, cards, map) plus Halftone UI for leaderboard meters and charts.
      </p>
      <CtaButton href="/design-system" variant="byte" size="lg">
        Open design system
      </CtaButton>
    </main>
  );
}
