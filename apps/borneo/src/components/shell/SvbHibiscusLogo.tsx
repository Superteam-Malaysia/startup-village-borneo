/**
 * Hibiscus mark for the navbar — five petals, diagonal stamen, left glitch streaks,
 * halftone dot texture. Vector silhouette so it stays readable at ~36px.
 */
export function SvbHibiscusLogo({
  className,
  title = "Startup Village Borneo",
}: {
  className?: string;
  title?: string;
}) {
  const id = "svb-hibiscus";

  return (
    <svg
      className={className}
      viewBox="0 0 56 44"
      width="56"
      height="44"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={`${id}-grad`} x1="8%" y1="10%" x2="92%" y2="92%">
          <stop offset="0%" stopColor="#2450e6" />
          <stop offset="45%" stopColor="#b91c2e" />
          <stop offset="100%" stopColor="#d4a82a" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="2.4" height="2.4" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="0.55" fill="#ffffff" opacity="0.45" />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <path d="M28 7 C21 12 17 18 20 24 C14 22 10 28 14 34 C18 38 24 36 28 33 C32 36 38 38 42 34 C46 28 42 22 36 24 C39 18 35 12 28 7 Z" />
        </clipPath>
      </defs>

      {/* Left glitch streaks */}
      <g stroke={`url(#${id}-grad)`} strokeWidth="0.65" strokeLinecap="round" opacity="0.42">
        <line x1="0" y1="36.5" x2="11" y2="36.5" />
        <line x1="0" y1="38.5" x2="14" y2="38.5" />
        <line x1="0" y1="40.5" x2="17" y2="40.5" />
        <line x1="0" y1="42.5" x2="12" y2="42.5" />
        <line x1="2" y1="34.5" x2="9" y2="34.5" opacity="0.6" />
      </g>

      {/* Five-petal hibiscus body */}
      <path
        fill={`url(#${id}-grad)`}
        d="M28 7 C21 12 17 18 20 24 C14 22 10 28 14 34 C18 38 24 36 28 33 C32 36 38 38 42 34 C46 28 42 22 36 24 C39 18 35 12 28 7 Z"
      />

      {/* Halftone grain inside the flower */}
      <rect
        x="8"
        y="4"
        width="40"
        height="36"
        fill={`url(#${id}-dots)`}
        clipPath={`url(#${id}-clip)`}
        opacity="0.9"
      />

      {/* Stamen — diagonal stem + anther cluster (top-right) */}
      <g stroke={`url(#${id}-grad)`} strokeWidth="1.15" strokeLinecap="round">
        <line x1="27.5" y1="22" x2="40.5" y2="7.5" />
        <line x1="40.5" y1="7.5" x2="43.5" y2="4.5" />
        <line x1="40.5" y1="7.5" x2="42" y2="10" opacity="0.85" />
      </g>
      <g fill={`url(#${id}-grad)`}>
        <circle cx="43.8" cy="4.2" r="2.1" />
        <circle cx="41.8" cy="7.2" r="1.15" opacity="0.9" />
        <circle cx="42.4" cy="10.2" r="0.75" opacity="0.75" />
      </g>

      {/* Center cup */}
      <circle cx="28" cy="24" r="2.4" fill="var(--svb-color-midnight)" opacity="0.55" />
      <circle cx="28" cy="24" r="1.1" fill="#d4a82a" opacity="0.9" />
    </svg>
  );
}
