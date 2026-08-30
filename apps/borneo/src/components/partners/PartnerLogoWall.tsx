import type { Partner } from "@/types/event";

function logoClass(partner: Partner): string {
  const base = "partner-logo-wall__img";
  if (partner.logoStyle === "invert") return `${base} partner-logo-wall__img--invert`;
  return base;
}

function markClass(partner: Partner): string {
  return [
    "partner-logo-wall__mark",
    partner.logoFit === "icon" ? "partner-logo-wall__mark--icon" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function PartnerLogoCell({ partner }: { partner: Partner }) {
  const pending = partner.role === "pending";

  return (
    <li
      className={[
        "partner-logo-wall__cell",
        pending ? "partner-logo-wall__cell--pending" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={markClass(partner)}>
        {partner.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo}
            alt={partner.name}
            className={logoClass(partner)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="partner-logo-wall__fallback">{partner.name}</span>
        )}
      </span>
    </li>
  );
}

type PartnerLogoWallProps = {
  anchors: Partner[];
  supporting: Partner[];
  pending?: Partner[];
  showTierLabels?: boolean;
};

/**
 * Breakpoint-style sponsor logo grid (EL-43).
 * @see docs/design/04-breakpoint-2025-archive-pixels.md §N
 */
export function PartnerLogoWall({
  anchors,
  supporting,
  pending = [],
  showTierLabels = true,
}: PartnerLogoWallProps) {
  return (
    <div className="partner-logo-wall">
      {anchors.length > 0 && (
        <div className="partner-logo-wall__tier">
          {showTierLabels ? (
            <h3 className="partner-logo-wall__tier-label">Anchor partners</h3>
          ) : null}
          <ul className="partner-logo-wall__grid partner-logo-wall__grid--anchor list-none">
            {anchors.map((p) => (
              <PartnerLogoCell key={p.name} partner={p} />
            ))}
          </ul>
        </div>
      )}

      {supporting.length > 0 && (
        <div className="partner-logo-wall__tier">
          {showTierLabels ? (
            <h3 className="partner-logo-wall__tier-label">Supporting partners</h3>
          ) : null}
          <ul className="partner-logo-wall__grid partner-logo-wall__grid--supporting list-none">
            {supporting.map((p) => (
              <PartnerLogoCell key={p.name} partner={p} />
            ))}
          </ul>
        </div>
      )}

      {pending.length > 0 && (
        <div className="partner-logo-wall__tier">
          {showTierLabels ? (
            <h3 className="partner-logo-wall__tier-label">Pending</h3>
          ) : null}
          <ul className="partner-logo-wall__grid partner-logo-wall__grid--supporting list-none">
            {pending.map((p) => (
              <PartnerLogoCell key={p.name} partner={p} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
