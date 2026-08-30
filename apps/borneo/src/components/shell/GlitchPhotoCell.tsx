"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto, GalleryTint } from "@/data/gallery";

const TINT_RGB: Record<GalleryTint, [number, number, number]> = {
  green: [20, 241, 149],
  purple: [171, 102, 253],
  blue: [89, 184, 254],
};

type GlitchSlice = {
  y: number;
  h: number;
  dx: number;
  targetDx: number;
  speed: number;
};

function coverFit(img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh };
}

function applyDuotone(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tint: [number, number, number],
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    const t = Math.pow(lum, 0.88);
    d[i] = tint[0] * t;
    d[i + 1] = tint[1] * t;
    d[i + 2] = tint[2] * t;
    d[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
}

function randomSlices(height: number, count: number): GlitchSlice[] {
  return Array.from({ length: count }, () => ({
    y: Math.random() * height,
    h: 6 + Math.random() * 28,
    dx: 0,
    targetDx: (Math.random() - 0.5) * 36,
    speed: 0.25 + Math.random() * 0.45,
  }));
}

/** Breakpoint-style tinted photo cell — duotone + slice glitch + flicker. */
export function GlitchPhotoCell({
  src,
  alt,
  tint,
  className,
}: Pick<GalleryPhoto, "src" | "alt" | "tint"> & { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const slicesRef = useRef<GlitchSlice[]>([]);
  const flickerRef = useRef(1);
  const frameRef = useRef(0);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setReady(true);
    };
    img.onerror = () => setReady(false);
    img.src = src.startsWith("/") && !src.startsWith("/borneo")
      ? `/borneo${src}`
      : src;
    return () => {
      imgRef.current = null;
      setReady(false);
    };
  }, [src]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return undefined;

    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tintRgb = TINT_RGB[tint];
    let raf = 0;

    const renderFrame = (animate: boolean) => {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      let w = canvas.clientWidth;
      let h = canvas.clientHeight;
      if (w <= 0 || h <= 0) return;

      const maxSide = 800;
      if (w > maxSide || h > maxSide) {
        const scale = maxSide / Math.max(w, h);
        w = Math.max(1, Math.floor(w * scale));
        h = Math.max(1, Math.floor(h * scale));
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!bufferRef.current) bufferRef.current = document.createElement("canvas");
      const buffer = bufferRef.current;
      buffer.width = w;
      buffer.height = h;
      const bctx = buffer.getContext("2d", { willReadFrequently: true });
      if (!bctx) return;

      const fit = coverFit(img, w, h);
      bctx.fillStyle = "#141519";
      bctx.fillRect(0, 0, w, h);
      bctx.drawImage(img, fit.dx, fit.dy, fit.dw, fit.dh);
      applyDuotone(bctx, w, h, tintRgb);

      if (animate) {
        frameRef.current += 1;

        if (frameRef.current % 36 === 0) {
          slicesRef.current = randomSlices(h, 2 + Math.floor(Math.random() * 3));
        }

        if (Math.random() < 0.025) {
          flickerRef.current = 0.62 + Math.random() * 0.25;
        } else {
          flickerRef.current = Math.min(1, flickerRef.current + 0.06);
        }
      } else {
        flickerRef.current = 1;
        slicesRef.current = [];
      }

      ctx.globalAlpha = flickerRef.current;
      ctx.drawImage(buffer, 0, 0);

      if (animate) {
        for (const slice of slicesRef.current) {
          slice.dx += (slice.targetDx - slice.dx) * slice.speed * 0.12;
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, slice.y, w, slice.h);
          ctx.clip();
          ctx.drawImage(buffer, slice.dx, 0);
          ctx.restore();
        }

        ctx.globalAlpha = 0.08;
        ctx.fillStyle = "#ffffff";
        for (let y = 0; y < h; y += 3) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      ctx.globalAlpha = 1;
    };

    const draw = () => {
      renderFrame(active && !reduced);
      if (active && !reduced) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [ready, active, tint]);

  return (
    <figure
      ref={rootRef}
      className={["glitch-photo", className].filter(Boolean).join(" ")}
    >
      <span className="sr-only">{alt}</span>
      <canvas ref={canvasRef} className="glitch-photo__canvas" aria-hidden="true" />
    </figure>
  );
}
