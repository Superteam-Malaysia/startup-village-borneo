"use client";

import { createContext, useContext, useRef, type RefObject } from "react";
import type Lenis from "lenis";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}

export function useLenisRef() {
  return useContext(LenisContext);
}
