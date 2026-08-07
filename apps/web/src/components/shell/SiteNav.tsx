import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { NAV_LINKS, SITE } from "@/data/site";
import { MobileNavMenu } from "./MobileNavMenu";

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav__bar">
        <Link href="/" className="site-nav__logo">
          <img
            src="/brand/svb-nav-logo.png"
            alt={SITE.name}
            className="site-nav__logo-mark"
            width={310}
            height={265}
            decoding="async"
          />
        </Link>

        <nav className="site-nav__desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__desktop-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav__actions">
          <MobileNavMenu />
          <CtaButton href="/amazing-race" variant="byte" size="sm" showArrow={false}>
            Race
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
