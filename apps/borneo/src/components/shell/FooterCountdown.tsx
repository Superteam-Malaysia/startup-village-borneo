"use client";

import { useEffect, useState } from "react";
import { FOOTER_EVENT_START } from "@/data/footer";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getParts(targetMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function FooterCountdown() {
  const target = new Date(FOOTER_EVENT_START).getTime();
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getParts(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <div className="bp-footer__countdown" aria-live="polite" aria-atomic="true">
      {UNITS.map(({ key, label }) => (
        <div key={key} className="bp-footer__countdown-cell">
          <span className="bp-footer__countdown-value tabular-nums">
            {parts ? (key === "days" ? parts.days : pad(parts[key])) : "—"}
          </span>
          <span className="bp-footer__countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
