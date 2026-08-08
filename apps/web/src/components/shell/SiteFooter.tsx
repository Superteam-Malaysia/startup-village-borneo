import Link from "next/link";
import { SITE } from "@/data/site";
import { FooterCountdown } from "./FooterCountdown";
import { FooterSocialIcons } from "./FooterSocialIcons";
import { KuchingSkyline } from "./KuchingSkyline";

/** Breakpoint footer top edge — exact path from solana.com/breakpoint (1440×200, cropped to 50px). */
function FooterStepEdge() {
  return (
    <div className="bp-footer__steps" aria-hidden>
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bp-footer__steps-svg"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1440 23.1202V200H0V14.114H91.5512V1.12952H351.685V14.114H524.223V21.1111H704.724V13.1145H818.864V0.629734L992.729 0.309869L1166.59 0V14.124H1222.34V23.1202H1440Z"
        />
      </svg>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bp-footer">
      <FooterStepEdge />
      <div className="bp-footer__inner">
        <div className="bp-footer__top">
          <FooterSocialIcons />
          <p className="bp-footer__copyright">
            Twenty'26 Superteam Malaysia
          </p>
          <div className="bp-footer__links">
            <a
              href={SITE.telegram}
              className="bp-footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us ↗
            </a>
            <Link href="/design-system" className="bp-footer__link">
              Brand assets ↗
            </Link>
          </div>
        </div>

        <FooterCountdown />

        <div className="bp-footer__skyline-wrap">
          <KuchingSkyline className="bp-footer__skyline" />
        </div>
      </div>
    </footer>
  );
}
