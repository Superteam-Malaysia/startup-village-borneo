"use client";

import { useState, type ReactNode } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

/** EL-44 — Radix-style FAQ accordion (Breakpoint archive pattern). */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="mt-6 pb-6 border-b border-[var(--color-transparent-wisp-10)] grid"
          >
            <button
              type="button"
              className="group flex justify-between w-full items-start gap-2 cursor-pointer text-left"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span
                className="font-[family-name:var(--font-sans)] text-xl font-normal normal-case group-hover:text-[var(--color-byte)] transition-colors duration-300"
              >
                {item.title}
              </span>
              <span
                className="relative shrink-0 size-8 border border-[var(--color-wisp)] text-center flex items-center justify-center group-hover:border-[var(--color-byte)] transition-colors duration-300"
              >
                <span
                  className={[
                    "absolute h-0.5 w-3 bg-[var(--color-wisp)] group-hover:bg-[var(--color-byte)] transition-all duration-300",
                    isOpen ? "rotate-0" : "rotate-90",
                  ].join(" ")}
                />
                <span className="absolute h-0.5 w-3 bg-[var(--color-wisp)] group-hover:bg-[var(--color-byte)] transition-colors duration-300" />
              </span>
            </button>
            {isOpen && (
              <div className="mt-4 text-[var(--color-text-secondary)] font-[family-name:var(--font-sans)] text-base leading-relaxed overflow-hidden animate-[accordion-slide-down_0.2s_linear]">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
