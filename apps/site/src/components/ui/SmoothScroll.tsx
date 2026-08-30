"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useLenisRef } from "@/contexts/LenisContext";

interface SmoothScrollProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SmoothScroll({ children, enabled = true }: SmoothScrollProps) {
  const lenisRef = useLenisRef();

  useEffect(() => {
    if (!lenisRef || !enabled) {
      lenisRef?.current?.destroy();
      if (lenisRef) lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
      allowNestedScroll: true,
      prevent: (node) =>
        node instanceof HTMLElement &&
        (node.hasAttribute("data-lenis-prevent") ||
          !!node.closest("[data-lenis-prevent]")),
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, lenisRef]);

  return <>{children}</>;
}
