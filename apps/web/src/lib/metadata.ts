import type { Metadata } from "next";

const SITE_NAME = "Startup Village Borneo";
const DEFAULT_DESCRIPTION =
  "Solana-first hackathon in Kuching, Sarawak — 5–9 September 2026. Schedule, Amazing Race, prizes, and the full builder experience.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://startup-village-borneo.superteam.my";

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_MY",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} 2026`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Startup Village Borneo",
    "SVB",
    "Solana",
    "hackathon",
    "Kuching",
    "Sarawak",
    "Amazing Race",
    "Superteam Malaysia",
  ],
  openGraph: {
    title: `${SITE_NAME} 2026`,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} 2026`,
    description: DEFAULT_DESCRIPTION,
  },
};
