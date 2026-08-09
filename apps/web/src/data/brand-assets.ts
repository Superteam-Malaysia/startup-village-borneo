import { withBasePath } from "@/lib/base-path";

export type BrandLogoPreview = "dark" | "light" | "azure";

export type BrandLogo = {
  id: string;
  name: string;
  src: string;
  usage: string;
  preview: BrandLogoPreview;
};

/** Official SVB marks — served from public/brand/. */
export const BRAND_LOGOS: BrandLogo[] = [
  {
    id: "poster-lockup",
    name: "Poster lockup",
    src: withBasePath("/brand/startup-village-borneo.svg"),
    usage: "Hero wordmark, event posters, social headers.",
    preview: "dark",
  },
  {
    id: "wordmark",
    name: "Horizontal wordmark",
    src: withBasePath("/brand/svb-wordmark.svg"),
    usage: "Footer skyline, print, and wide layouts.",
    preview: "light",
  },
  {
    id: "nav-mark",
    name: "Nav mark",
    src: withBasePath("/brand/svb-nav-logo.png"),
    usage: "Site navigation and compact placements.",
    preview: "dark",
  },
  {
    id: "logo-png",
    name: "Logo PNG",
    src: withBasePath("/brand/svb-logo.png"),
    usage: "Raster fallback for decks and email.",
    preview: "dark",
  },
  {
    id: "hibiscus",
    name: "Hibiscus mark",
    src: withBasePath("/brand/svb-hibiscus-logo.svg"),
    usage: "Accent mark, favicons, and small badges.",
    preview: "dark",
  },
  {
    id: "footer-skyline",
    name: "Footer skyline",
    src: withBasePath("/brand/footer-skyline.svg"),
    usage: "Footer illustration above the countdown.",
    preview: "azure",
  },
  {
    id: "knot-symbol",
    name: "Summit knot",
    src: withBasePath("/brand/summit-tracks/knot-symbol.svg"),
    usage: "Prize track marquee divider.",
    preview: "dark",
  },
  {
    id: "kitten",
    name: "Summit kitten",
    src: withBasePath("/brand/summit-tracks/kitten.webp"),
    usage: "Prize track marquee accent.",
    preview: "dark",
  },
];
