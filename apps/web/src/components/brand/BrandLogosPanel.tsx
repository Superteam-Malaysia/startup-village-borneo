import { BRAND_LOGOS, type BrandLogoPreview } from "@/data/brand-assets";
import { SectionIntro } from "@/components/ui";

function previewClass(tone: BrandLogoPreview) {
  if (tone === "light") return "brand-logos__preview--light";
  if (tone === "azure") return "brand-logos__preview--azure";
  return "brand-logos__preview--dark";
}

function downloadName(src: string) {
  return src.split("/").pop() ?? "svb-asset";
}

export function BrandLogosPanel() {
  return (
    <section className="brand-logos" aria-labelledby="brand-logos-heading">
      <div id="brand-logos-heading">
        <SectionIntro
          title="Logos"
          lead="Download official Startup Village Borneo marks. Use on dark backgrounds unless noted."
          accent="byte"
        />
      </div>

      <ul className="brand-logos__grid list-none">
        {BRAND_LOGOS.map((logo) => (
          <li key={logo.id} className="brand-logos__card">
            <div className={["brand-logos__preview", previewClass(logo.preview)].join(" ")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                className="brand-logos__image"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="brand-logos__meta">
              <h3 className="brand-logos__name">{logo.name}</h3>
              <p className="brand-logos__usage">{logo.usage}</p>
              <a
                href={logo.src}
                download={downloadName(logo.src)}
                className="brand-logos__download"
              >
                Download ↓
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
