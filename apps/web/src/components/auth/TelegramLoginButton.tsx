"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

type TelegramConfig = {
  configured: boolean;
  botUsername?: string;
  error?: string;
};

function mountTelegramWidget(container: HTMLDivElement, botUsername: string) {
  container.replaceChildren();
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;
  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute(
    "data-auth-url",
    `${window.location.origin}${withBasePath("/api/auth/telegram/callback")}`,
  );
  script.setAttribute("data-request-access", "write");
  container.appendChild(script);
}

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<TelegramConfig | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const res = await fetch(withBasePath("/api/auth/telegram/config"));
        const data = (await res.json()) as TelegramConfig;
        if (!cancelled) setConfig(data);
      } catch {
        if (!cancelled) {
          setConfig({ configured: false, error: "Could not load Telegram sign-in." });
        }
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !config?.configured || !config.botUsername) return;
    mountTelegramWidget(container, config.botUsername);
  }, [config]);

  if (!config) {
    return (
      <p className="text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
        Loading Telegram sign-in…
      </p>
    );
  }

  if (!config.configured || !config.botUsername) {
    return (
      <p className="text-sm text-[var(--color-byte)]">
        Telegram sign-in is not configured yet. Set{" "}
        <code className="font-mono">TELEGRAM_BOT_TOKEN</code> on the server and redeploy.
        {config.error ? ` (${config.error})` : ""}
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
