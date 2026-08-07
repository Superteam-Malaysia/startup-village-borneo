import Link from "next/link";
import { SITE } from "@/data/site";
import { FooterCountdown } from "./FooterCountdown";
import { FooterSocialIcons } from "./FooterSocialIcons";
import { KuchingSkyline } from "./KuchingSkyline";

function FooterStepEdge() {
  return (
    <div className="bp-footer__steps" aria-hidden>
      <svg viewBox="0 0 1440 28" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#9945ff"
          d="M0 28V0h80v12h64V4h96v16h80V8h112v20h72V0h88v14h104V6h96v22h80V10h112v18h64V2h96v26h80V8h112v20h72V0h88v12h104V4h96v24h80V14h112v14h64V0H1440v28H0Z"
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
            © SOLANA FOUNDATION · SOCOE | 2026
          </p>
          <div className="bp-footer__links">
            <a href={`mailto:${SITE.email}`} className="bp-footer__link">
              Contact us ↗
            </a>
            <Link href="/code-of-conduct" className="bp-footer__link">
              Code of conduct ↗
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
