import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { NAV_LINKS, SITE } from "@/data/site";

export function SiteNav() {
  return (
    <header
      className="sticky top-0 z-[var(--z-nav)] border-b border-[color:var(--color-transparent-wisp-10)] bg-[var(--color-null)]/92 backdrop-blur-md"
    >
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-sm md:text-base tracking-[0.2em] uppercase text-[var(--color-wisp)] hover:text-[var(--color-byte)] transition-colors shrink-0"
        >
          ≡ {SITE.shortName}
        </Link>

        <nav
          className="hidden lg:flex items-center gap-6 font-[family-name:var(--font-mono)] text-[0.7rem] md:text-xs uppercase tracking-[0.12em] text-[var(--color-wisp)]/80"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--color-byte)] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <CtaButton href="/amazing-race" variant="byte" size="sm" showArrow={false}>
            Race
          </CtaButton>
        </div>
      </div>

      <nav
        className="lg:hidden flex overflow-x-auto gap-4 px-4 pb-3 font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-wisp)]/70 border-t border-[color:var(--color-transparent-wisp-10)] pt-2"
        aria-label="Mobile primary"
      >
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-[var(--color-byte)]">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
