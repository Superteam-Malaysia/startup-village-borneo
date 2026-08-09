import { PRIZE_TRACKS } from "@/data/prize-tracks";
import { PRIZE_ROWS, PRIZE_TOTAL } from "@/data/prizes";
import { withBasePath } from "@/lib/base-path";

const KITTEN = withBasePath("/brand/summit-tracks/kitten.webp");
const KNOT = withBasePath("/brand/summit-tracks/knot-symbol.svg");

const MARQUEE_ITEMS = 12;

function PrizeTracksMarquee() {
  const items = Array.from({ length: MARQUEE_ITEMS }, (_, index) => (
    <span key={index} className="prize-tracks__marquee-item">
      <img className="prize-tracks__knot" src={KNOT} alt="" width={59} height={54} decoding="async" />
      <img className="prize-tracks__kitten" src={KITTEN} alt="" width={209} height={119} decoding="async" />
    </span>
  ));

  return (
    <div className="prize-tracks__marquee" aria-hidden>
      <div className="prize-tracks__marquee-track">{items}</div>
      <div className="prize-tracks__marquee-track">{items}</div>
    </div>
  );
}

export function PrizeTracksPanel() {
  return (
    <div className="prize-tracks">
      <div className="prize-tracks__intro">
        <h2 className="prize-tracks__title">
          Four prize tracks.
          <br />
          <span className="prize-tracks__title-highlight">
            <span className="prize-tracks__title-highlight-bg" aria-hidden />
            {PRIZE_TOTAL} USD
          </span>
        </h2>
      </div>

      <PrizeTracksMarquee />

      <div className="prize-tracks__panels">
        {PRIZE_TRACKS.map((track) => (
          <article key={track.id} className="prize-tracks__panel is-entered">
            <span className="prize-tracks__panel-line" aria-hidden />
            <div className="prize-tracks__panel-head">
              <h3 className="prize-tracks__panel-title">{track.title}</h3>
              {track.amount ? (
                <p className="prize-tracks__panel-amount">{track.amount}</p>
              ) : null}
            </div>
            <p className="prize-tracks__panel-desc">{track.description}</p>
          </article>
        ))}
      </div>

      <div className="prize-tracks__breakdown">
        <p className="prize-tracks__breakdown-label">Full breakdown</p>
        <ul className="prize-tracks__breakdown-list">
          {PRIZE_ROWS.map((row) => (
            <li key={row.label} className="prize-tracks__breakdown-row">
              <span>{row.label}</span>
              <span>{row.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
