"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/base-path";

type TelegramConfig = {
  configured: boolean;
  botId?: number;
  botUsername?: string;
  error?: string;
};

type TelegramAuthUser = Record<string, string | number>;

function parseTgAuthResultHash(): TelegramAuthUser | null {
  if (typeof window === "undefined") return null;

  const match = window.location.hash.match(/[#?&]tgAuthResult=([A-Za-z0-9\-_=]*)$/);
  if (!match?.[1]) return null;

  try {
    let data = match[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = data.length % 4;
    if (pad > 1) data += "=".repeat(4 - pad);
    const parsed = JSON.parse(window.atob(data)) as TelegramAuthUser;
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    return parsed;
  } catch {
    return null;
  }
}

function redirectToCallback(user: TelegramAuthUser) {
  const callback = `${window.location.origin}${withBasePath("/api/auth/telegram/callback")}`;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(user)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  window.location.assign(`${callback}?${params.toString()}`);
}

function buildTelegramOAuthUrl(botId: number, returnTo: string): string {
  const origin = window.location.origin;
  const params = new URLSearchParams({
    bot_id: String(botId),
    origin,
    request_access: "write",
    return_to: returnTo,
  });
  return `https://oauth.telegram.org/auth?${params.toString()}`;
}

export function TelegramLoginButton() {
  const [config, setConfig] = useState<TelegramConfig | null>(null);

  useEffect(() => {
    const authResult = parseTgAuthResultHash();
    if (authResult?.hash) {
      redirectToCallback(authResult);
      return;
    }

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

  if (!config) {
    return (
      <p className="text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
        Loading Telegram sign-in…
      </p>
    );
  }

  if (!config.configured || !config.botId || !config.botUsername) {
    return (
      <p className="text-sm text-[var(--color-byte)]">
        Telegram sign-in is not configured yet. Set{" "}
        <code className="font-mono">TELEGRAM_BOT_TOKEN</code> on the server and redeploy.
        {config.error ? ` (${config.error})` : ""}
      </p>
    );
  }

  const returnTo = `${window.location.origin}${withBasePath("/login")}`;
  const oauthUrl = buildTelegramOAuthUrl(config.botId, returnTo);

  return (
    <div className="telegram-login-wrap">
      <a
        href={oauthUrl}
        className="telegram-login-button"
        onClick={(event) => {
          event.preventDefault();
          window.location.assign(oauthUrl);
        }}
      >
        <TelegramIcon />
        Log in with Telegram
      </a>
      <p className="mt-4 text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
        Use the Telegram account you registered with on Luma (@username must match). On mobile this
        should open the Telegram app — not an in-browser popup.
      </p>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.5 2.8 1.9 10.4c-1.2.5-1.2 1.2-.2 1.5l5.2 1.6 2 6.1c.3.8.6 1.1 1.2 1.1.6 0 .9-.3 1.2-.9l2.9-4.7 5.4 4c1 .6 1.7.3 2-1.1L23.8 4.5c.4-1.4-.5-2-1.7-1.7ZM9.4 13.8l9.9-6.2c.5-.3.9-.1.5.2L11.2 15l-.4 3.8-1.4-5Z"
      />
    </svg>
  );
}
