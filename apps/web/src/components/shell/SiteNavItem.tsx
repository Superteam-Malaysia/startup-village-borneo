import Link from "next/link";
import type { NAV_LINKS } from "@/data/site";
import { NavLinkLabel } from "./NavLinkLabel";

export type NavLink = (typeof NAV_LINKS)[number];

export function isNavComingSoon(link: NavLink): boolean {
  return "comingSoon" in link && link.comingSoon === true;
}

export function SiteNavDesktopItem({ link }: { link: NavLink }) {
  const comingSoon = isNavComingSoon(link);
  const label = <NavLinkLabel label={link.label} comingSoon={comingSoon} />;

  if (comingSoon) {
    return (
      <span className="site-nav__desktop-link site-nav__desktop-link--soon" aria-disabled="true">
        {label}
      </span>
    );
  }

  return (
    <Link href={link.href} className="site-nav__desktop-link">
      {label}
    </Link>
  );
}

export function SiteNavMobileItem({
  link,
  onNavigate,
}: {
  link: NavLink;
  onNavigate?: () => void;
}) {
  const comingSoon = isNavComingSoon(link);
  const label = <NavLinkLabel label={link.label} comingSoon={comingSoon} />;

  if (comingSoon) {
    return (
      <span className="site-nav__mobile-link site-nav__mobile-link--soon" aria-disabled="true">
        {label}
      </span>
    );
  }

  return (
    <Link href={link.href} className="site-nav__mobile-link" onClick={onNavigate}>
      {label}
    </Link>
  );
}
