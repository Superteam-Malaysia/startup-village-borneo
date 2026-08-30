"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { SiteContent } from "@/lib/types";

function useElementScrollProgress(
  ref: React.RefObject<HTMLDivElement | null>,
  revealFraction = 0.15
) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = el.offsetHeight * revealFraction;
      progress.set(Math.max(0, Math.min(1, scrolled / total)));
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ref, revealFraction, progress]);

  return progress;
}

const DEFAULT_CONTENT =
  "Superteam Malaysia is a gateway for Malaysian builders to step into the global Web3 ecosystem — learning together, building real products, earning through meaningful opportunities, and growing as a community.";

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function ScrollRevealText({
  text,
  className,
  progress,
}: {
  text: string;
  className?: string;
  progress: MotionValue<number>;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <p className={className}>
      {/* <span className="inline-block w-[10vw] max-w-[340px]" aria-hidden="true" /> */}
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <span key={i}>
            <Word progress={progress} range={[start, end]}>
              {word}
            </Word>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

export function WhoWeAreSection({ content }: { content?: SiteContent | null }) {
  const text = content?.description || DEFAULT_CONTENT;
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRevealRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const scrollYProgress = useElementScrollProgress(scrollRevealRef, 0.3);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const w = window as unknown as Record<string, unknown>;
    const u = w.UnicornStudio as { init?: () => void; isInitialized?: boolean } | undefined;

    if (u?.init) {
      u.init();
      return;
    }

    if (u?.isInitialized !== undefined) return;

    w.UnicornStudio = { isInitialized: false };
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js";
    script.onload = () => {
      const us = w.UnicornStudio as { init?: () => void } | undefined;
      us?.init?.();
    };
    document.head.appendChild(script);
  }, []);

  // Snap to next section when ~85-90% scrolled past
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let snapping = false;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (snapping) return;

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      if (!scrollingDown) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom > 0 && rect.bottom < viewportHeight * 0.5) {
        snapping = true;
        const nextSection = section.nextElementSibling as HTMLElement;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
        setTimeout(() => {
          snapping = false;
        }, 1500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative">
      {/* Sticky Unicorn Studio background — stays in viewport while section scrolls */}
      <div className="sticky top-0 h-screen w-full">
        <div
          data-us-project="M4Npp8uoO33G2Wq56jtk"
          className="absolute inset-0 w-full h-full"
          data-us-production="true"
        />
      </div>

      {/* Scroll-reveal text area — taller container with sticky text inside */}
      <div ref={scrollRevealRef} className="relative -mt-[100vh] min-h-[150vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center px-6 z-10 pt-[50vh]">
          <div className="max-w-[1650px] text-center px-10">
            <ScrollRevealText
              text={text}
              progress={scrollYProgress}
              className="font-[family-name:var(--font-orbitron)] block text-base md:text-lg lg:text-3xl xl:text-5xl text-white font-black leading-tight"
            />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[45vh] bg-gradient-to-b from-transparent to-[#090C0E]"
        aria-hidden="true"
      />
    </section>
  );
}
