import Link from "next/link";
import { FOOTER_LINKS, SITE } from "@/data/site";
import { TextTicker } from "./TextTicker";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[color:var(--color-transparent-wisp-10)] bg-[var(--color-null)]">
      <TextTicker />
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-16 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-[var(--color-byte)] mb-4">
            {SITE.shortName} 2026
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[var(--color-wisp)] leading-tight max-w-md">
            {SITE.dates}
            <br />
            <span className="text-[var(--color-wisp)]/60">{SITE.venue}</span>
          </p>
          <p className="mt-4 text-sm text-[var(--color-wisp)]/50 max-w-md leading-relaxed">
            {SITE.rhythm}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="text-label">Navigate</h3>
          <ul className="grid grid-cols-2 gap-3 list-none">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-label text-label-muted hover:text-[var(--color-byte)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--color-wisp)]/40 font-[family-name:var(--font-mono)]">
            Anchor partners: {SITE.anchors.join(" · ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
