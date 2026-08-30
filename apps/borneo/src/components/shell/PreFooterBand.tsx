"use client";

import { FooterScrambleTicker } from "./FooterScrambleTicker";
import { PhotoStripCarousel } from "./PhotoStripCarousel";

/** Pre-footer band — photo carousel + scramble divider (Breakpoint stats section pattern). */
export function PreFooterBand() {
  return (
    <section className="pre-footer-band" aria-label="Event gallery">
      <PhotoStripCarousel />
      <FooterScrambleTicker className="footer-scramble--divider" />
    </section>
  );
}
