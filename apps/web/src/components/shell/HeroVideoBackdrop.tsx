/** Full-bleed hero video from the Superteam MY launch post on X. */
export function HeroVideoBackdrop({
  src,
  poster,
  tweetUrl,
}: {
  src: string;
  poster?: string;
  tweetUrl: string;
}) {
  return (
    <div className="home-hero__backdrop" aria-hidden="true">
      <video
        className="home-hero__video"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="home-hero__backdrop-overlay" />
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="home-hero__tweet-link sr-only"
      >
        Watch the Superteam Malaysia announcement on X
      </a>
    </div>
  );
}
