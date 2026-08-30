"use client";

import {
  createContext,
  useContext,
  useRef,
  type RefObject,
  type ReactNode,
} from "react";

const HeroLogoRefContext = createContext<RefObject<HTMLDivElement | null> | null>(
  null
);

export function HeroLogoRefProvider({ children }: { children: ReactNode }) {
  const heroLogoRef = useRef<HTMLDivElement | null>(null);
  return (
    <HeroLogoRefContext.Provider value={heroLogoRef}>
      {children}
    </HeroLogoRefContext.Provider>
  );
}

export function useHeroLogoRef() {
  const ctx = useContext(HeroLogoRefContext);
  return ctx ?? { current: null };
}
