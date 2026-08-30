import type { ReactNode } from "react";

/**
 * Subtle scanline + jitter glitch for the home hero accent word only.
 * Styles live in experience.css (.hero-glitch-*); respects prefers-reduced-motion.
 */
export function HeroGlitch({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={["hero-glitch", className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}
