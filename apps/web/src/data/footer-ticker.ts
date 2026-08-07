/** Breakpoint-style glitch charset (solana.com/breakpoint footer band). */
export const GLITCH_CHARS =
  "?∑≈≠~{!@%≈±~≠?≈~/{~≈#/*∑!≈}*|^∆#@/∞#]#&!÷%?%@*#^∞!%6±^/*∞∑∞?±?÷?&/{÷∆∞6∑÷±/±%%!?÷}÷&{?|&≈%{≈6&≈∑";

export const FOOTER_SCRAMBLE_READABLE = "SVB · KUCHING · BUILD · RACE · DEMO DAY";

/** One cycle — purple keywords + static noise blobs (Breakpoint pattern). */
export const FOOTER_SCRAMBLE_SEGMENTS = [
  { type: "word" as const, text: "SVB" },
  {
    type: "noise" as const,
    text: "?∑≈≠~{!@%≈±~≠?≈~/{~≈#/*∑!≈}*|^∆#@/∞#]#&!÷%?%@*#^",
  },
  { type: "word" as const, text: "KUCHING" },
  {
    type: "noise" as const,
    text: "∞!%6±^/*∞∑∞?±?÷?&/{÷∆∞6∑÷±/±%%!?÷}÷&{?|&≈%{≈6&≈∑",
  },
  { type: "word" as const, text: "BUILD" },
  {
    type: "noise" as const,
    text: "≈|{^±!&6?±{≠]±^||%∑@≈∞/2|?#?±^%/∑÷≠|∆/^&∑±~|∑^≈%",
  },
  { type: "word" as const, text: "RACE" },
  {
    type: "noise" as const,
    text: "≈%~∆{/@~≈*|!≈!÷]±%!%/%!#[^∞^!{]#%!*]≈61&{≠&]±≠#&",
  },
  { type: "word" as const, text: "DEMO DAY" },
  {
    type: "noise" as const,
    text: "±?[∞@~*]±!≈/∆!!{∆~]%#~∞{±*{∆∞∆±6%≠|/±∞±≠?^*/?#&2",
  },
] as const;
