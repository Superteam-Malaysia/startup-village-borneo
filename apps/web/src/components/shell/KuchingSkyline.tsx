import { withBasePath } from "@/lib/base-path";

/**
 * Footer skyline silhouette — designer vector SVG (588×147).
 * Source: public/brand/footer-skyline.svg
 */
const SKYLINE_WIDTH = 588;
const SKYLINE_HEIGHT = 147;

export function KuchingSkyline({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath("/brand/footer-skyline.svg")}
        alt=""
        width={SKYLINE_WIDTH}
        height={SKYLINE_HEIGHT}
        decoding="async"
        className="kuching-skyline__svg"
      />
    </div>
  );
}
