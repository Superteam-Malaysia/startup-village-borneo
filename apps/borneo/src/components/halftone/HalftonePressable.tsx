"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { Surface } from "@/halftone/react/index.js";

const SOLID = () => 1;
const PRESS_MS = 700;

type PressRef = {
  pressIn: (ms?: number) => void;
  pressOut: (ms?: number) => void;
} | null;

type HalftonePressableProps = {
  children: ReactNode;
  className?: string;
  color: "red" | "blue" | "green" | "orange" | "purple";
  href?: string;
  external?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Opens Luma checkout overlay instead of navigating. */
  lumaEventId?: string;
};

function usesDesktopHover() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function pressDurationMs() {
  if (typeof window === "undefined") return PRESS_MS;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return PRESS_MS;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Halftone ink fill + pressIn animation on hover (resting frame is un-pressed for legibility). */
export function HalftonePressable({
  children,
  className,
  color,
  href,
  external,
  disabled,
  onClick,
  lumaEventId,
}: HalftonePressableProps) {
  const router = useRouter();
  const press = useRef<PressRef>(null);
  const navigating = useRef(false);

  const handlePointerEnter = () => {
    if (disabled || !usesDesktopHover()) return;
    press.current?.pressIn();
  };

  const handlePointerLeave = () => {
    if (disabled || !usesDesktopHover()) return;
    press.current?.pressOut();
  };

  const runMobilePressThen = async (action: () => void) => {
    if (navigating.current) return;
    navigating.current = true;

    const ms = pressDurationMs();
    press.current?.pressIn(ms);
    if (ms > 0) await wait(ms);

    try {
      action();
    } finally {
      navigating.current = false;
    }
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, isExternal: boolean) => {
    if (disabled || !href || usesDesktopHover()) return;

    event.preventDefault();

    void runMobilePressThen(() => {
      if (onClick) {
        onClick();
        return;
      }
      if (isExternal) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(href);
    });
  };

  const inner = (
    <>
      <Surface
        pressRef={press}
        field={SOLID}
        color={color}
        animate
        pressMs={PRESS_MS}
        style={{ position: "absolute", inset: 0, height: "100%", zIndex: 0 }}
      />
      <span className="cta__halftone-label">{children}</span>
    </>
  );

  const shared = {
    className,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };

  if (lumaEventId && !disabled) {
    return (
      <button
        type="button"
        data-luma-action="checkout"
        data-luma-event-id={lumaEventId}
        {...shared}
      >
        {inner}
      </button>
    );
  }

  if (href && !disabled) {
    const isExternal = external ?? href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...shared}
          onClick={(event) => handleLinkClick(event, true)}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} {...shared} onClick={(event) => handleLinkClick(event, false)}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} {...shared}>
      {inner}
    </button>
  );
}
