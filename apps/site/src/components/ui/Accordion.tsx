"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Minus } from "lucide-react";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  variant?: "default" | "card";
}

export function AccordionItem({
  question,
  answer,
  defaultOpen = false,
  variant = "default",
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isCard = variant === "card";

  const content = (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left group cursor-pointer ${
          isCard ? "py-5 px-5 md:px-6" : "py-5 px-1"
        }`}
      >
        <span
          className={`text-base md:text-lg font-medium text-white pr-4 ${
            isCard ? "" : "group-hover:text-solana-purple transition-colors"
          }`}
        >
          {question}
        </span>
        <span className="shrink-0">
          {isCard ? (
            isOpen ? (
              <Minus className="w-5 h-5 text-white/70" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/70" />
            )
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted" />
            </motion.div>
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p
              className={`leading-relaxed ${
                isCard
                  ? "pb-5 px-5 md:px-6 pt-0 text-white/70"
                  : "pb-5 px-1 text-muted"
              }`}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (isCard) {
    return (
      <div className="rounded-xl bg-transparent border border-white/20 shadow-sm mb-4 last:mb-0">
        {content}
      </div>
    );
  }

  return (
    <div className="border-b border-white/5 last:border-b-0">{content}</div>
  );
}
