export type GalleryTint = "green" | "purple" | "blue";

export type GalleryPhoto = {
  src: string;
  alt: string;
  tint: GalleryTint;
  /** Optional md width utility on the cell */
  widthClass?: string;
};

/** Breakpoint-style gallery strip — replace with SVB event photos when available. */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/gallery/photo-1.jpg",
    alt: "Attendees at a conference session",
    tint: "blue",
    widthClass: "photo-strip__cell--wide",
  },
  {
    src: "/gallery/photo-2.jpg",
    alt: "Community members at an event",
    tint: "green",
  },
  {
    src: "/gallery/photo-3.jpg",
    alt: "Workshop participants",
    tint: "purple",
    widthClass: "photo-strip__cell--md",
  },
  {
    src: "/gallery/photo-4.jpg",
    alt: "Main stage presentation",
    tint: "blue",
    widthClass: "photo-strip__cell--lg",
  },
  {
    src: "/gallery/photo-5.jpg",
    alt: "Networking at the venue",
    tint: "green",
    widthClass: "photo-strip__cell--md",
  },
  {
    src: "/gallery/photo-6.jpg",
    alt: "Event crowd",
    tint: "purple",
    widthClass: "photo-strip__cell--lg",
  },
];
