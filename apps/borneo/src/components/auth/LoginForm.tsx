"use client";

import { FormEvent, useState } from "react";
import { withBasePath } from "@/lib/base-path";

type LoginFormProps = {
  error?: string | null;
};

export function LoginForm({ error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [devPreviewUrl, setDevPreviewUrl] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    setDevPreviewUrl(null);

    const res = await fetch(withBasePath("/api/auth/request-link"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json()) as {
      message?: string;
      devPreviewUrl?: string;
      error?: string;
    };

    if (!res.ok) {
      setStatus("idle");
      setMessage(data.error ?? "Something went wrong.");
      return;
    }

    setStatus("sent");
    setMessage(data.message ?? "Check your email for a sign-in link.");
    if (data.devPreviewUrl) setDevPreviewUrl(data.devPreviewUrl);
  }

  return (
    <div className="max-w-md">
      {error ? (
        <p className="mb-4 text-sm text-[var(--color-byte)]">{error}</p>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
            Registration email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 px-4 bg-transparent border border-[color:var(--color-transparent-wisp-10)] text-[var(--color-wisp)] font-mono text-sm outline-none focus:border-[var(--color-wisp)]"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading" || status === "sent"}
          className="cta cta--azure cta--md disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {message ? (
        <p className="mt-6 text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_80%,transparent)]">
          {message}
        </p>
      ) : null}

      {devPreviewUrl ? (
        <p className="mt-4 text-xs font-mono break-all text-[color:color-mix(in_srgb,var(--color-wisp)_60%,transparent)]">
          Dev preview:{" "}
          <a href={devPreviewUrl} className="underline">
            {devPreviewUrl}
          </a>
        </p>
      ) : null}
    </div>
  );
}
