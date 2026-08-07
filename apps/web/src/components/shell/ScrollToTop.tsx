"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reset scroll on route change so page headers don't sit under the fixed nav. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
