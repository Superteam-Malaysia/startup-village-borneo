"use client";

import { GALLERY_PHOTOS } from "@/data/gallery";
import { GlitchPhotoCell } from "./GlitchPhotoCell";

function PhotoStripRow({ copyKey }: { copyKey: string }) {
  return (
    <div className="photo-strip__row">
      {GALLERY_PHOTOS.map((photo) => (
        <GlitchPhotoCell
          key={`${copyKey}-${photo.src}`}
          src={photo.src}
          alt={photo.alt}
          tint={photo.tint}
          className={photo.widthClass}
        />
      ))}
    </div>
  );
}

/** Breakpoint-style infinite gallery strip with tinted glitch photos. */
export function PhotoStripCarousel() {
  return (
    <div className="photo-strip" aria-hidden="true">
      <div className="photo-strip__track">
        <PhotoStripRow copyKey="a" />
        <PhotoStripRow copyKey="b" />
      </div>
    </div>
  );
}
