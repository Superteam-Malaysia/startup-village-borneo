"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { HalftonePressable } from "@/components/halftone/HalftonePressable";
import { IconArrowExternal } from "./icons";

type CtaVariant = "byte" | "azure" | "ghost-wisp" | "ghost-null";
type CtaSize = "sm" | "md" | "lg";

export type CtaButtonProps = {
  children: ReactNode;
  variant?: CtaVariant;
  size?: CtaSize;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  showArrow?: boolean;
};

const variantClass: Record<CtaVariant, string> = {
  byte: "cta--byte",
  azure: "cta--azure",
  "ghost-wisp": "cta--ghost-wisp",
  "ghost-null": "cta--ghost-null",
};

const sizeClass: Record<CtaSize, string> = {
  sm: "cta--sm",
  md: "cta--md",
  lg: "cta--lg",
};

const halftoneColor: Record<"byte" | "azure", "red" | "blue"> = {
  byte: "red",
  azure: "blue",
};

function classes({
  variant = "byte",
  size = "md",
  fullWidth,
  className,
}: Pick<CtaButtonProps, "variant" | "size" | "fullWidth" | "className">) {
  return [
    "cta",
    variantClass[variant],
    sizeClass[size],
    fullWidth ? "cta--full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function isFilledVariant(variant: CtaVariant): variant is "byte" | "azure" {
  return variant === "byte" || variant === "azure";
}

/** EL-28 — Breakpoint `.cta` button (reverse-engineered from archive HTML). */
export function CtaButton({
  children,
  variant = "byte",
  size = "md",
  href,
  external,
  fullWidth,
  className,
  onClick,
  disabled,
  showArrow = true,
}: CtaButtonProps) {
  const content = (
    <>
      {children}
      {showArrow && <IconArrowExternal />}
    </>
  );

  if (isFilledVariant(variant)) {
    return (
      <HalftonePressable
        href={href}
        external={external}
        disabled={disabled}
        onClick={onClick}
        color={halftoneColor[variant]}
        className={classes({ variant, size, fullWidth, className })}
      >
        {content}
      </HalftonePressable>
    );
  }

  if (href) {
    const isExternal = external ?? href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes({ variant, size, fullWidth, className })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes({ variant, size, fullWidth, className })}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes({ variant, size, fullWidth, className })}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
