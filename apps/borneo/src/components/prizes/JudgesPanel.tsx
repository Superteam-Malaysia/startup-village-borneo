import Image from "next/image";
import { SectionIntro } from "@/components/ui";
import { DEMO_DAY_JUDGES, type Judge } from "@/data/judges";

function JudgeCard({ judge }: { judge: Judge }) {
  return (
    <li className="judges-panel__card">
      <div className="judges-panel__photo">
        {judge.photo ? (
          <Image
            src={judge.photo}
            alt=""
            fill
            className="judges-panel__photo-image"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ) : null}
      </div>
      <h3 className="judges-panel__name">{judge.name}</h3>
      <p className="judges-panel__org">{judge.role}</p>
    </li>
  );
}

/** Summit Serbia–style judges grid — square photo, name + org below. */
export function JudgesPanel() {
  return (
    <section className="judges-panel" aria-labelledby="judges-heading">
      <div className="judges-panel__inner">
        <div id="judges-heading" className="judges-panel__title">
          <SectionIntro title="Judges" accent="byte" />
        </div>
        <ul className="judges-panel__grid list-none">
          {DEMO_DAY_JUDGES.map((judge) => (
            <JudgeCard key={judge.id} judge={judge} />
          ))}
        </ul>
      </div>
    </section>
  );
}
