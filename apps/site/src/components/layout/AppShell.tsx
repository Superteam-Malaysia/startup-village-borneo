"use client";

import { HeroLogoRefProvider } from "@/contexts/HeroLogoRefContext";
import { LenisProvider } from "@/contexts/LenisContext";
// import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
// import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

function AppShellContent({ children }: { children: React.ReactNode }) {
  // const { loading, setLoading } = useLoading();

  return (
    <LenisProvider>
      {/* <LoadingScreen onComplete={() => setLoading(false)} /> */}
      <SmoothScroll enabled>
        <div
          style={{
            opacity: 1,
            transition: "opacity 0.3s ease-out",
            pointerEvents: "auto",
          }}
        >
          {children}
        </div>
      </SmoothScroll>
    </LenisProvider>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    // <LoadingProvider>
    <HeroLogoRefProvider>
      <AppShellContent>{children}</AppShellContent>
    </HeroLogoRefProvider>
    // </LoadingProvider>
  );
}
