import { withBasePath } from "@/lib/base-path";
import type { Partner } from "@/types/event";

/** Local assets under /public/partners — served from repo, no external requests. */
export const PARTNERS: Partner[] = [
  {
    name: "Solana Foundation",
    role: "anchor",
    workshops: true,
    logo: withBasePath("/partners/solana-foundation.svg"),
    logoStyle: "light",
  },
  {
    name: "SOCOE",
    role: "anchor",
    workshops: true,
    logo: withBasePath("/partners/socoe.png"),
    logoStyle: "light",
  },
  {
    name: "BESarawak",
    role: "confirmed",
    workshops: false,
    logo: withBasePath("/partners/besarawak.png"),
    logoStyle: "color",
  },
  {
    name: "Solana ID / Ecosystem Call",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/solana-id-ecosystem-call.svg"),
    logoStyle: "color",
    logoFit: "icon",
  },
  {
    name: "Superscrypt",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/superscrypt.svg"),
    logoStyle: "light",
  },
  {
    name: "Impossible Finance",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/impossible-finance.png"),
    logoStyle: "invert",
  },
  {
    name: "Rarible",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/rarible.svg"),
    logoStyle: "light",
  },
  {
    name: "MonkeDAO / MonkeFoundry",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/monkedao.png"),
    logoStyle: "light",
  },
  {
    name: "Elfa AI",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/elfa-ai.png"),
    logoStyle: "light",
  },
  {
    name: "GetBlock",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/magicblock.svg"),
    logoStyle: "light",
  },
  // MagicBlock — replaced on stage by GetBlock (Aug 2026 agenda).
  // {
  //   name: "MagicBlock",
  //   role: "confirmed",
  //   workshops: true,
  //   logo: withBasePath("/partners/magicblock.svg"),
  //   logoStyle: "light",
  // },
  {
    name: "TankDAO",
    role: "confirmed",
    workshops: false,
    logo: withBasePath("/partners/tankdao.png"),
    logoStyle: "light",
  },
  {
    name: "Virtuals",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/virtuals.svg"),
    logoStyle: "color",
  },
  {
    name: "Sanctum",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/sanctum.png"),
    logoStyle: "color",
  },
  {
    name: "Kyzzen",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/kyzzen.png"),
    logoStyle: "color",
    logoFit: "icon",
  },
  {
    name: "Meteora",
    role: "confirmed",
    workshops: true,
    logo: withBasePath("/partners/meteora.svg"),
    logoStyle: "light",
  },
  {
    name: "RedotPay",
    role: "confirmed",
    workshops: false,
    logo: withBasePath("/partners/redotpay.svg"),
    logoStyle: "color",
  },
  {
    name: "No Limit Holdings",
    role: "confirmed",
    workshops: true,
    logoStyle: "light",
  },
  // DWFLabs — no longer pending on the Aug 2026 agenda. Do not show until re-confirmed.
  // {
  //   name: "DWFLabs",
  //   role: "pending",
  //   logo: withBasePath("/partners/dwflabs.svg"),
  //   logoStyle: "light",
  // },
];

export const ANCHOR_PARTNERS = PARTNERS.filter((p) => p.role === "anchor");
export const SUPPORTING_PARTNERS = PARTNERS.filter((p) => p.role === "confirmed");
export const PENDING_PARTNERS = PARTNERS.filter((p) => p.role === "pending");
