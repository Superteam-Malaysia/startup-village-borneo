import Link from "next/link";
import { NAV_LINKS, SITE } from "@/data/site";
import type { NavAuthLink } from "@/lib/auth/nav-auth-link";
import { withBasePath } from "@/lib/base-path";
import { MobileNavMenu } from "./MobileNavMenu";
import { SiteNavDesktopItem } from "./SiteNavItem";

type SiteNavProps = {
  authLink: NavAuthLink;
};

export function SiteNav({ authLink }: SiteNavProps) {
  const signedIn = authLink.href === "/profile";

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
          <Link
            href={authLink.href}
            className={`site-nav__auth-link${signedIn ? " site-nav__auth-link--signed-in" : ""}`}
          >
            {authLink.label}
          </Link>
          <MobileNavMenu authLink={authLink} />
        </div>
      </div>
    </header>
  );
}
