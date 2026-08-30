"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { EmbeddedTweet, TweetNotFound, TweetSkeleton, useTweet } from "react-tweet";
import type { QuotedTweet, Tweet as TweetData, TweetBase, TweetEntities } from "react-tweet/api";
import type { CommunityTweet, SiteContent } from "@/lib/types";
import "react-tweet/theme.css";

interface WallOfLoveProps {
  communityTweets: CommunityTweet[];
  content?: SiteContent | null;
}

const DEFAULT_WOL = {
  title: "Wall of Love",
  description: "Hear from our builders and leaders in the Malaysian Solana ecosystem!",
};

class TweetErrorBoundary extends Component<
  { children: ReactNode; tweetId: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Failed to render tweet ${this.props.tweetId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <TweetFallbackCard />;
    }
    return this.props.children;
  }
}

function TweetFallbackCard() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-surface/50 p-5 text-sm text-muted-foreground">
      This post is currently unavailable.
    </div>
  );
}

function normalizeEntities(entities: Partial<TweetEntities> | undefined): TweetEntities {
  return {
    ...entities,
    hashtags: Array.isArray(entities?.hashtags) ? entities.hashtags : [],
    media: Array.isArray(entities?.media) ? entities.media : undefined,
    symbols: Array.isArray(entities?.symbols) ? entities.symbols : [],
    urls: Array.isArray(entities?.urls) ? entities.urls : [],
    user_mentions: Array.isArray(entities?.user_mentions) ? entities.user_mentions : [],
  };
}

function normalizeTweetBase<T extends TweetBase>(tweet: T): T {
  return {
    ...tweet,
    entities: normalizeEntities(tweet.entities),
  };
}

function normalizeQuotedTweet(tweet: QuotedTweet): QuotedTweet {
  return normalizeTweetBase(tweet);
}

function normalizeTweetEntities(tweet: TweetData): TweetData {
  const entities = tweet.entities ?? {};
  const quotedTweet = tweet.quoted_tweet
    ? normalizeQuotedTweet(tweet.quoted_tweet)
    : undefined;

  return {
    ...normalizeTweetBase({ ...tweet, entities: normalizeEntities(entities) }),
    quoted_tweet: quotedTweet,
  } as TweetData;
}

function SafeTweet({ id }: { id: string }) {
  const { data, error, isLoading } = useTweet(id);

  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetNotFound error={error} />;

  return <EmbeddedTweet tweet={normalizeTweetEntities(data)} />;
}

export function WallOfLove({ communityTweets, content }: WallOfLoveProps) {
  const title = content?.title || DEFAULT_WOL.title;
  const description = content?.description || DEFAULT_WOL.description;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="community" className="relative py-14 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 ">
        <Image
          src="/images/wol-bg.png"
          alt=""
          fill
          className="object-cover object-center hidden lg:block"
          unoptimized
          priority={false}
        />
        <Image
          src="/images/mobile-wol-bg.png"
          alt=""
          fill
          className="object-cover object-center lg:hidden block"
          unoptimized
          priority={false}
        />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-[32px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-wide mb-4 flex flex-col items-center justify-center gap-0">
            <div className="overflow-hidden" style={{ lineHeight: 1.25 }}>
              <motion.span
                className="block text-center will-change-transform"
                style={{ lineHeight: 1.25 }}
                initial={{ y: 96 }}
                animate={inView ? { y: 0 } : { y: 96 }}
                transition={{
                  duration: 0.9,
                  ease: [0.77, 0, 0.175, 1],
                }}
              >
                {title}
              </motion.span>
            </div>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: inView ? 0.9 : 0 }}
            className="text-[10px] sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </motion.div>

        {communityTweets.length > 0 ? (
          (() => {
            const mobileCols = 2;
            const desktopCols = 3;
            const mobileChunkSize = Math.ceil(communityTweets.length / mobileCols);
            const desktopChunkSize = Math.ceil(communityTweets.length / desktopCols);
            const mobileColumns = Array.from({ length: mobileCols }, (_, i) =>
              communityTweets.slice(i * mobileChunkSize, (i + 1) * mobileChunkSize)
            );
            const desktopColumns = Array.from({ length: desktopCols }, (_, i) =>
              communityTweets.slice(i * desktopChunkSize, (i + 1) * desktopChunkSize)
            );
            return (
              <>
                {/* Mobile: 2 columns, flex-row with flex-col inside each */}
                <div className="flex flex-row gap-2 mt-4 md:hidden">
                  {mobileColumns.map((colTweets, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex flex-col gap-2 flex-1 min-w-0 max-h-[1800px]"
                    >
                      {colTweets.map((tweet, index) => (
                        <motion.div
                          key={tweet.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={inView ? { opacity: 1, y: 0 } : {}}
                          transition={{
                            duration: 0.5,
                            delay: (colIndex * mobileChunkSize + index) * 0.1,
                          }}
                          className="flex z-10 justify-center h-fit [&_.react-tweet-theme]:!my-0 [&_.react-tweet-theme]:!bg-surface/50 [&_.react-tweet-theme]:!border [&_.react-tweet-theme]:!border-white/5 [&_.react-tweet-theme]:!rounded-2xl [&_.react-tweet-theme]:!overflow-hidden"
                        >
                          <TweetErrorBoundary tweetId={tweet.tweet_id}>
                            <SafeTweet id={tweet.tweet_id} />
                          </TweetErrorBoundary>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Tablet/Desktop: 3 columns */}
                <div className="hidden md:flex flex-row gap-4 mt-4 h-fit relative">
                  {desktopColumns.map((colTweets, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex flex-col gap-2 flex-1 min-w-0 max-h-[3000px]"
                    >
                      {colTweets.map((tweet, index) => (
                        <motion.div
                          key={tweet.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={inView ? { opacity: 1, y: 0 } : {}}
                          transition={{
                            duration: 0.5,
                            delay: (colIndex * desktopChunkSize + index) * 0.1,
                          }}
                          className="flex z-10 justify-center h-fit [&_.react-tweet-theme]:!my-2 [&_.react-tweet-theme]:!bg-surface/50 [&_.react-tweet-theme]:!border [&_.react-tweet-theme]:!border-white/5 [&_.react-tweet-theme]:!rounded-2xl [&_.react-tweet-theme]:!overflow-hidden"
                        >
                          <TweetErrorBoundary tweetId={tweet.tweet_id}>
                            <SafeTweet id={tweet.tweet_id} />
                          </TweetErrorBoundary>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            );
          })()
        ) : (
          <div className="mt-16 text-center py-16 rounded-2xl bg-surface/30 border border-white/5">
            <p className="text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              Community love coming soon. Follow us on{" "}
              <a
                href="https://x.com/superteammy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:opacity-80 transition-opacity"
                aria-label="X (Twitter)"
              >
                <Image src="/icons/x.svg" alt="" width={20} height={20} className="shrink-0" />
              </a>{" "}
              to stay updated.
            </p>
          </div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[500px] z-20 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #080B0E, #080B0E00)",
        }}
      />
    </section>
  );
}
