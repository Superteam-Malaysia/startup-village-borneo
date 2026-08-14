import Image from "next/image";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { MERCH_IMAGE, MERCH_ITEMS } from "@/data/merch";

export function MerchDrop() {
  return (
    <SectionArticle>
      <SectionIntro
        title="Gear"
        lead="Every accepted builder gets a Startup Village kit for the week — jersey, carry, hydration, and the basics for five days in Kuching."
        accent="lime"
      />
      <div className="merch-drop">
        <figure className="merch-drop__figure">
          <div className="merch-drop__frame">
            <Image
              src={MERCH_IMAGE.src}
              alt={MERCH_IMAGE.alt}
              width={MERCH_IMAGE.width}
              height={MERCH_IMAGE.height}
              className="merch-drop__image"
              sizes="(min-width: 768px) min(52vw, 640px), 100vw"
              priority={false}
            />
          </div>
          <figcaption className="merch-drop__caption">Startup Village Borneo kit</figcaption>
        </figure>

        <div className="merch-drop__manifest">
          <p className="merch-drop__manifest-label">Kit manifest</p>
          <ul className="merch-drop__kit">
            {MERCH_ITEMS.map((item) => (
              <li key={item.id} className="merch-drop__item">
                <span className="merch-drop__name">{item.name}</span>
                <span className="merch-drop__note">{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionArticle>
  );
}
