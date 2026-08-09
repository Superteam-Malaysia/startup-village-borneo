import Link from "next/link";
import { NAV_LINKS, SITE } from "@/data/site";
import { withBasePath } from "@/lib/base-path";
import { MobileNavMenu } from "./MobileNavMenu";
import { SiteNavDesktopItem } from "./SiteNavItem";

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav__bar">
        <Link href="/" className="site-nav__logo">
          <img
            src={withBasePath("/brand/svb-nav-logo.png")}
            alt={SITE.name}
            className="site-nav__logo-mark"
            width={310}
            height={265}
            decoding="async"
          />
        </Link>

        <nav className="site-nav__desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <SiteNavDesktopItem key={link.href} link={link} />
          ))}
        </nav>

        <div className="site-nav__actions">
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
