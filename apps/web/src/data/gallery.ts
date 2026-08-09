import { withBasePath } from "@/lib/base-path";

export type GalleryTint = "green" | "purple" | "blue";

export type GalleryPhoto = {
  src: string;
  alt: string;
  tint: GalleryTint;
  /** Optional md width utility on the cell */
  widthClass?: string;
};

/** Pre-footer photo strip — Superteam MY community & event photos. */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: withBasePath("/gallery/stmy-01.jpg"),
    alt: "Community builders at a hackathon group photo",
    tint: "blue",
    widthClass: "photo-strip__cell--wide",
  },
  {
    src: withBasePath("/gallery/stmy-02.jpg"),
    alt: "Workshop participants with painted miniatures",
    tint: "green",
    widthClass: "photo-strip__cell--lg",
  },
  {
    src: withBasePath("/gallery/stmy-03.jpg"),
    alt: "Panel on stage at a blockchain week event",
    tint: "purple",
    widthClass: "photo-strip__cell--wide",
  },
  {
    src: withBasePath("/gallery/stmy-04.jpg"),
    alt: "Speaker presenting at a community workshop",
    tint: "blue",
    widthClass: "photo-strip__cell--lg",
  },
  {
    src: withBasePath("/gallery/stmy-05.jpg"),
    alt: "Team photo at an AWS office event",
    tint: "green",
    widthClass: "photo-strip__cell--md",
  },
  {
    src: withBasePath("/gallery/stmy-06.jpg"),
    alt: "Developers collaborating at a vibecoding session",
    tint: "purple",
    widthClass: "photo-strip__cell--wide",
  },
  {
    src: withBasePath("/gallery/stmy-07.jpg"),
    alt: "Community members at a badminton court",
    tint: "blue",
    widthClass: "photo-strip__cell--md",
  },
  {
    src: withBasePath("/gallery/stmy-08.jpg"),
    alt: "Superteam at Network School for Solana Day",
    tint: "green",
    widthClass: "photo-strip__cell--wide",
  },
  {
    src: withBasePath("/gallery/stmy-09.jpg"),
    alt: "Superteam MY community group photo",
    tint: "purple",
    widthClass: "photo-strip__cell--md",
  },
];
