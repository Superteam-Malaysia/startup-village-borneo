import type { ReactNode } from "react";

export function NavLinkLabel({
  label,
  comingSoon,
}: {
  label: ReactNode;
  comingSoon?: boolean;
}) {
  return (
    <>
      {label}
      {comingSoon ? (
        <span className="site-nav__soon-tag">Coming soon</span>
      ) : null}
    </>
  );
}
