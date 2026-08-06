export const WALLET_ONBOARDING = {
  summary:
    "SVB is Solana-first — wallet onboarding is both an Amazing Race station and a product research moment for your build.",
  ethos:
    "Teach someone to use a real crypto product. Document what confused them. Never pressure anyone about money, investments, or token purchases.",
};

export const WALLET_PRODUCTS = [
  {
    name: "Solana wallet",
    detail: "Create a wallet, receive a small amount, and send a test transaction.",
  },
  {
    name: "Jupiter",
    detail: "Walk through a swap — slippage, confirmation, and what the UI hides.",
  },
  {
    name: "RedotPay",
    detail: "Card or payment flow onboarding — note friction for non-crypto natives.",
  },
] as const;

export const WALLET_RULES = [
  "Teach, don't sell — no pitching investments or asking for money.",
  "Use a real product with a real learner — not a teammate who already has a wallet.",
  "Document confusion in your race thread; that's product research, not a conversion metric.",
  "Companion dApp wallet connect ships at the event — this page is the rulebook for now.",
] as const;

export const WALLET_STEPS = [
  { step: "Find a learner", detail: "Someone new to crypto — hotel staff, a friend, a fellow traveler." },
  { step: "Pick a product", detail: "Wallet setup, Jupiter swap, or RedotPay — whatever fits their context." },
  { step: "Guide patiently", detail: "Let them tap; note every question and moment of hesitation." },
  { step: "Log in your thread", detail: "Post photos or a short recap in your team Amazing Race thread." },
] as const;
