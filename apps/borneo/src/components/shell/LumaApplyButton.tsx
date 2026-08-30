"use client";

import Script from "next/script";
import { HalftonePressable } from "@/components/halftone/HalftonePressable";
import { SITE } from "@/data/site";

declare global {
  interface Window {
    luma?: { initCheckout: () => void };
  }
}

function initLumaCheckout() {
  window.luma?.initCheckout();
}

/** Hero apply CTA — opens Luma registration overlay in-page. */
export function LumaApplyButton() {
  return (
    <>
      <Script
        id="luma-checkout"
        src="https://embed.lu.ma/checkout-button.js"
        strategy="lazyOnload"
        onLoad={initLumaCheckout}
      />
      <HalftonePressable
        lumaEventId={SITE.lumaEventId}
        color="blue"
        className="cta cta--azure cta--sm"
      >
        Apply
      </HalftonePressable>
    </>
  );
}
