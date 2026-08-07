const TICKER_TEXT = "STARTUP VILLAGE BORNEO · KUCHING · 5–9 SEPT 2026 · BUILD · RACE · DEMO DAY · ";

export function TextTicker() {
  return (
    <div
      className="overflow-hidden border-b border-[color:var(--color-transparent-wisp-10)] py-2"
      aria-hidden="true"
    >
      <div className="ticker-track font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.35em] text-[var(--color-byte)]">
        {TICKER_TEXT.repeat(4)}
      </div>
    </div>
  );
}
