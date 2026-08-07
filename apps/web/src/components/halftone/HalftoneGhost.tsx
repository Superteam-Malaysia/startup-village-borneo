type GhostVariant = "tile" | "chart" | "meter" | "title";

export function HalftoneGhost({ variant }: { variant: GhostVariant }) {
  return (
    <div
      className={["halftone-ghost", `halftone-ghost--${variant}`].join(" ")}
      aria-hidden="true"
    />
  );
}
