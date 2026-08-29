"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/base-path";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, "");

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !BOT_USERNAME) return;

    container.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute(
      "data-auth-url",
      `${window.location.origin}${withBasePath("/api/auth/telegram/callback")}`,
    );
    script.setAttribute("data-request-access", "write");
    container.appendChild(script);
  }, []);

  if (!BOT_USERNAME) {
    return (
      <p className="text-sm text-[var(--color-byte)]">
        Telegram sign-in is not configured yet. Set{" "}
        <code className="font-mono">NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code> and{" "}
        <code className="font-mono">TELEGRAM_BOT_TOKEN</code> on the server.
      </p>
    );
  }

  return (
    <div className="telegram-login-wrap">
      <div ref={containerRef} />
      <p className="mt-4 text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
        Use the Telegram account you registered with on Luma. Your @username must match
        your registration.
      </p>
    </div>
  );
}
