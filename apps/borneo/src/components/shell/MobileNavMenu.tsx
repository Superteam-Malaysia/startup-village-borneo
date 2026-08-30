"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/data/site";
import type { NavAuthLink } from "@/lib/auth/nav-auth-link";
import { SiteNavMobileItem } from "./SiteNavItem";

type MobileNavMenuProps = {
  authLink: NavAuthLink;
};

export function MobileNavMenu({ authLink }: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-nav__menu-wrap lg:hidden">
      <button
        type="button"
        className="site-nav__menu-btn"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <nav
          id="mobile-nav-panel"
          className="site-nav__mobile-panel"
          aria-label="Mobile primary"
        >
          <ul className="site-nav__mobile-list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <SiteNavMobileItem link={link} onNavigate={() => setOpen(false)} />
              </li>
            ))}
            <li>
              <Link
                href={authLink.href}
                className="site-nav__mobile-link site-nav__mobile-link--auth"
                onClick={() => setOpen(false)}
              >
                {authLink.label}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
