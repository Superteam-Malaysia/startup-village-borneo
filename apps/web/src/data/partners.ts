import type { Partner } from "@/types/event";

/** Local assets under /public/partners — served from repo, no external requests. */
export const PARTNERS: Partner[] = [
  {
    name: "Solana Foundation",
    role: "anchor",
    workshops: true,
    logo: "/partners/solana-foundation.svg",
    logoStyle: "light",
  },
  {
    name: "SOCOE",
    role: "anchor",
    workshops: true,
    logo: "/partners/socoe.png",
    logoStyle: "light",
  },
  {
    name: "BESarawak",
    role: "confirmed",
    workshops: false,
    logo: "/partners/besarawak.png",
    logoStyle: "color",
  },
  {
    name: "Solana ID / Ecosystem Call",
    role: "confirmed",
    workshops: true,
    logo: "/partners/solana-id-ecosystem-call.svg",
    logoStyle: "color",
    logoFit: "icon",
  },
  {
    name: "Superscrypt",
    role: "confirmed",
    workshops: true,
    logo: "/partners/superscrypt.svg",
    logoStyle: "light",
  },
  {
    name: "Impossible Finance",
    role: "confirmed",
    workshops: true,
    logo: "/partners/impossible-finance.png",
    logoStyle: "invert",
  },
  {
    name: "Rarible",
    role: "confirmed",
    workshops: true,
    logo: "/partners/rarible.svg",
    logoStyle: "light",
  },
  {
    name: "MonkeDAO / MonkeFoundry",
    role: "confirmed",
    workshops: true,
    logo: "/partners/monkedao.png",
    logoStyle: "light",
  },
  {
    name: "Elfa AI",
    role: "confirmed",
    workshops: true,
    logo: "/partners/elfa-ai.png",
    logoStyle: "light",
  },
  {
    name: "MagicBlock",
    role: "confirmed",
    workshops: true,
    logo: "/partners/magicblock.svg",
    logoStyle: "light",
  },
  {
    name: "TankDAO",
    role: "confirmed",
    workshops: false,
    logo: "/partners/tankdao.png",
    logoStyle: "light",
  },
  {
    name: "Virtuals",
    role: "confirmed",
    workshops: true,
    logo: "/partners/virtuals.svg",
    logoStyle: "color",
  },
  { name: "RedotPay", role: "pending", logo: "/partners/redotpay.svg", logoStyle: "color" },
  { name: "DWFLabs", role: "pending", logo: "/partners/dwflabs.svg", logoStyle: "light" },
];

export const ANCHOR_PARTNERS = PARTNERS.filter((p) => p.role === "anchor");
export const SUPPORTING_PARTNERS = PARTNERS.filter((p) => p.role === "confirmed");
export const PENDING_PARTNERS = PARTNERS.filter((p) => p.role === "pending");
