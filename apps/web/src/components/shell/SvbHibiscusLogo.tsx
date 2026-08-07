/**
 * ASCII hibiscus mark — purple→magenta gradient, glitch streaks on the left.
 * Recreated as SVG monospace text for crisp scaling in the navbar.
 */
export function SvbHibiscusLogo({
  className,
  title = "Startup Village Borneo",
}: {
  className?: string;
  title?: string;
}) {
  const rows = [
    "                 ++++****",
    "              ***///||||***",
    "           *##@@@@@@@@@@@##*",
    "         .*#%@@@@@@@@@@@@@%#*.",
    "       ..--##%@@@@@@@@@@%##--..",
    "         *##@@@@@@@@@@@@@##*",
    "           **############**",
    "             *::*****::*",
    "               ..:::..",
    "    ____------------------____",
    "  ----::::::::::::::::::::----",
    "--::::::::::::::::::::::::::--",
  ];

  const charW = 3.05;
  const charH = 3.5;
  const fontSize = 2.6;
  const gradId = "svb-hibiscus-grad";

  return (
    <svg
      className={className}
      viewBox="0 0 88 46"
      width="88"
      height="46"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="8%" y1="6%" x2="92%" y2="94%">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="38%" stopColor="#ab66fd" />
          <stop offset="72%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <g
        fill={`url(#${gradId})`}
        fontFamily="ui-monospace, 'IBM Plex Mono', monospace"
        fontSize={fontSize}
        fontWeight="500"
      >
        {rows.map((row, rowIndex) =>
          [...row].map((char, colIndex) => {
            if (char === " ") return null;
            const isGlitch = colIndex < 8 && (char === "-" || char === "_" || char === ":");
            const isStamen = char === "/" || char === "|" || char === "+";
            return (
              <text
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * charW}
                y={(rowIndex + 1) * charH}
                opacity={isGlitch ? 0.5 : isStamen ? 0.92 : 1}
              >
                {char}
              </text>
            );
          }),
        )}
      </g>
    </svg>
  );
}
