import Image from "next/image";
import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { MERCH_IMAGE, MERCH_ITEMS, MERCH_TWEET_URL } from "@/data/merch";

export function MerchDrop() {
  return (
    <SectionArticle>
      <SectionIntro title="What's in the bag" accent="lime" />
      <div className="merch-drop">
        <a
          className="merch-drop__media"
          href={MERCH_TWEET_URL}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={MERCH_IMAGE.src}
            alt={MERCH_IMAGE.alt}
            width={MERCH_IMAGE.width}
            height={MERCH_IMAGE.height}
            className="merch-drop__image"
            sizes="(min-width: 768px) 52vw, 100vw"
          />
        </a>
        <ol className="merch-drop__kit">
          {MERCH_ITEMS.map((item, index) => (
            <li key={item.id} className="merch-drop__item">
              <span className="merch-drop__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="merch-drop__copy">
                <span className="merch-drop__name">{item.name}</span>
                <span className="merch-drop__note">{item.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-10">
        <CtaButton href={MERCH_TWEET_URL} variant="ghost-wisp" size="md" external>
          Sneak peek on X
        </CtaButton>
      </div>
    </SectionArticle>
  );
}
