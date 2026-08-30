import type { PrizeRow } from "@/types/event";

export const PRIZE_TOTAL = "$10,000";

export const PRIZE_ROWS: PrizeRow[] = [
  { label: "1st place", amount: "$3,000" },
  { label: "2nd place", amount: "$2,000" },
  { label: "3rd place", amount: "$1,000" },
  { label: "Honourable mentions (2 × $500)", amount: "$1,000" },
  { label: "Sustainability track (2 × $500)", amount: "$1,000", note: "Criteria announced Day 2" },
  { label: "Content prizes (10 × $100)", amount: "$1,000", note: "Judged after event" },
  { label: "Amazing Race (2 × $500)", amount: "$1,000" },
];
