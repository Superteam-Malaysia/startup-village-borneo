"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

const POLL_STORAGE_KEY = "svb_telegram_poll_token";

type TelegramConfig = {
  configured: boolean;
  botUsername?: string;
  error?: string;
};

type AppLoginStart = {
  deepLink: string;
  desktopDeepLink: string;
  pollToken: string;
};

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

function openTelegramDeepLink(webDeepLink: string, desktopDeepLink: string) {
  if (isMobileDevice()) {
    window.location.assign(webDeepLink);
    return;
  }

  // tg:// triggers Telegram Desktop; https://t.me/ in a new tab only opens the website.
  const link = document.createElement("a");
  link.href = desktopDeepLink;
  link.rel = "noopener noreferrer";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function TelegramLoginButton() {
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [appMessage, setAppMessage] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<number | null>(null);

  const stopPolling = useCallback((clearStored = true) => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPolling(false);
    if (clearStored) sessionStorage.removeItem(POLL_STORAGE_KEY);
  }, []);

  const startPolling = useCallback(
    (pollToken: string) => {
      stopPolling(false);
      sessionStorage.setItem(POLL_STORAGE_KEY, pollToken);
      setPolling(true);
      setAppMessage("Waiting in Telegram… tap Start in the bot. This tab will sign you in automatically.");

      pollRef.current = window.setInterval(async () => {
        try {
          const res = await fetch(
            `${withBasePath("/api/auth/telegram/status")}?token=${encodeURIComponent(pollToken)}`,
          );
          const data = (await res.json()) as {
            status: string;
            finishUrl?: string;
            reason?: string;
          };

          if (data.status === "complete") {
            const completeRes = await fetch(withBasePath("/api/auth/telegram/complete"), {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ pollToken }),
            });

            if (completeRes.ok) {
              stopPolling();
              const complete = (await completeRes.json()) as { redirect?: string };
              window.location.assign(complete.redirect ?? withBasePath("/profile"));
            }
          } else if (data.status === "rejected") {
            stopPolling();
            setAppMessage(
              data.reason === "missing_telegram"
                ? "Your Telegram account has no @username. Set one in settings and try again."
                : "That Telegram @username is not on the guest list.",
            );
          } else if (data.status === "expired") {
            stopPolling();
            setAppMessage("Sign-in timed out. Tap the button to try again.");
          }
        } catch {
          /* keep polling */
        }
      }, 2000);
    },
    [stopPolling],
  );

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

    const savedPoll = sessionStorage.getItem(POLL_STORAGE_KEY);
    if (savedPoll) startPolling(savedPoll);

    return () => {
      cancelled = true;
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [startPolling]);

  async function logInWithTelegram() {
    if (!config?.botUsername) return;

    setAppMessage(null);
    try {
      const res = await fetch(withBasePath("/api/auth/telegram/start"), { method: "POST" });
      if (!res.ok) throw new Error("start failed");
      const data = (await res.json()) as AppLoginStart;
      startPolling(data.pollToken);
      openTelegramDeepLink(data.deepLink, data.desktopDeepLink);
    } catch {
      setAppMessage("Could not start Telegram sign-in. Try again in a moment.");
    }
  }

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
      <button type="button" className="telegram-login-button" onClick={() => void logInWithTelegram()}>
        <TelegramIcon />
        Log in with Telegram
      </button>

      {appMessage ? (
        <p className="mt-4 text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
          {appMessage}
        </p>
      ) : (
        <p className="mt-4 text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
          Keep this tab open while you tap Start in @superteamalaysiabot. Your @username must match Luma.
        </p>
      )}

      {polling ? (
        <p className="mt-2 text-xs font-mono text-[color:color-mix(in_srgb,var(--color-wisp)_55%,transparent)]">
          Checking for sign-in…
        </p>
      ) : null}
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
