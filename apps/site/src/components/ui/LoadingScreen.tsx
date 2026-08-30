"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useScrambleText } from "@/hooks/useScrambleText";
import { useHeroLogoRef } from "@/contexts/HeroLogoRefContext";

// Video sources: WebM (smallest) → MP4 (universal) → MOV (fallback before running optimize script)
const LOADING_VIDEO_SOURCES = [
  { src: "/videos/loading.webm", type: "video/webm" },
  { src: "/videos/loading.mp4", type: "video/mp4" },
  { src: "/videos/0302.mov", type: "video/quicktime" },
];

const LOGO_ANIM_MS = 700;
const SCRAMBLE_DURATION_MS = 700;
const HOLD_AFTER_MS = 400;
const ZOOM_DURATION_MS = 800;
const BAR_DURATION_S =
  (LOGO_ANIM_MS + SCRAMBLE_DURATION_MS + HOLD_AFTER_MS) / 1000;

const LOADING_LOGO_W = 80;
const LOADING_LOGO_H = 68;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    "logo" | "scramble" | "hold" | "zoom" | "exit"
  >("logo");
  const scrambleStarted = useRef(false);
  const heroLogoRef = useHeroLogoRef();
  const [targetPosition, setTargetPosition] = useState<{
    x: number;
    y: number;
    scale: number;
  } | null>(null);

  const { display: scrambleDisplay, replay } = useScrambleText(
    "SUPERTEAM\nMALAYSIA",
    { iterationsPerLetter: 1 }
  );

  // Phase 1 → 2: logo finishes, start scramble
  useEffect(() => {
    const t = setTimeout(() => setPhase("scramble"), LOGO_ANIM_MS);
    return () => clearTimeout(t);
  }, []);

  // Trigger scramble replay when entering scramble phase
  useEffect(() => {
    if (phase === "scramble" && !scrambleStarted.current) {
      scrambleStarted.current = true;
      replay();
    }
  }, [phase, replay]);

  // Phase 2 → 3: scramble duration ends, hold
  useEffect(() => {
    if (phase !== "scramble") return;
    const t = setTimeout(() => setPhase("hold"), SCRAMBLE_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3 → 4: hold ends, start zoom — capture hero logo position
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => {
      const el = heroLogoRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth / 2;
        const vh = window.innerHeight / 2;
        const heroCenterX = rect.left + rect.width / 2;
        const heroCenterY = rect.top + rect.height / 2;
        setTargetPosition({
          x: heroCenterX - vw,
          y: heroCenterY - vh,
          scale: rect.width / LOADING_LOGO_W,
        });
      } else {
        setTargetPosition({ x: 0, y: 0, scale: 1 });
      }
      setPhase("zoom");
    }, HOLD_AFTER_MS);
    return () => clearTimeout(t);
  }, [phase, heroLogoRef]);

  // Phase 4 → 5: zoom completes, start exit — trigger hero fade-in as logo lands
  useEffect(() => {
    if (phase !== "zoom") return;
    const t = setTimeout(() => {
      onComplete(); // Hero starts fading in while loading fades out
      setPhase("exit");
    }, ZOOM_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const showText = phase !== "logo";
  const isZooming = phase === "zoom";

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/loading-poster.jpg"
            preload="auto"
          >
            {LOADING_VIDEO_SOURCES.map(({ src, type }) => (
              <source key={type} src={src} type={type} />
            ))}
          </video>
          <motion.div
            className="absolute inset-0 bg-black/20"
            animate={{ opacity: isZooming ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative flex flex-col items-center justify-center gap-4">
            {isZooming ? (
              <div
                className="fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2"
                style={{ pointerEvents: "none" }}
              >
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  animate={{
                    scale: targetPosition?.scale ?? 1,
                    x: targetPosition?.x ?? 0,
                    y: targetPosition?.y ?? 0,
                  }}
                  transition={{
                    duration: ZOOM_DURATION_MS / 1000,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Image
                    src="/stmy-mark.svg"
                    alt="Superteam Malaysia"
                    width={LOADING_LOGO_W}
                    height={LOADING_LOGO_H}
                    className="w-[80px] h-auto"
                    priority
                  />
                </motion.div>
              </div>
            ) : null}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ visibility: isZooming ? "hidden" : "visible" }}
            >
              <Image
                src="/stmy-mark.svg"
                alt="Superteam Malaysia"
                width={LOADING_LOGO_W}
                height={LOADING_LOGO_H}
                className="w-[80px] h-auto"
                priority
              />
            </motion.div>

            <motion.div
              className="h-12 flex items-center justify-center"
              animate={{ opacity: isZooming ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className="font-[family-name:var(--font-orbitron)] font-bold text-lg text-white/90 text-center whitespace-pre-line transition-opacity duration-300"
                style={{ opacity: showText ? 1 : 0 }}
              >
                {scrambleDisplay}
              </p>
            </motion.div>
          </div>

          {/* Loading bar — fills over the total duration, completes before zoom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10"
            animate={{ opacity: isZooming ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="h-full bg-linear-to-r from-solana-purple to-solana-green"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: BAR_DURATION_S, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
