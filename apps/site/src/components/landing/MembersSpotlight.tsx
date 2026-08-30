"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MemberProfileCard } from "@/components/members/MemberProfileCard";
import type { Profile, SiteContent } from "@/lib/types";
import Image from "next/image";

interface MembersSpotlightProps {
  profiles: Profile[];
  content?: SiteContent | null;
}

const CARD_SCALE = 0.9;
// Card base width 320px; scaled visual width = 320*0.85. Use that so cards stick close.
const CARD_WIDTH = Math.round(320 * CARD_SCALE); // 272
const MOBILE_CARD_WIDTH = 280 + 16; // card + gap-4

// Pixels per second. The track length grows with the member count, so the
// duration is derived from it — otherwise adding members speeds the scroll up.
const MARQUEE_SPEED = 80;
const MIN_DURATION = 18;

function marqueeDuration(count: number, cardWidth: number) {
  return Math.max(MIN_DURATION, (count * cardWidth) / MARQUEE_SPEED);
}

const DEFAULT_MEMBERS = {
  title: "Member Spotlight",
  description: "Meet the talented builders driving the Solana ecosystem in Malaysia",
};

export function MembersSpotlight({ profiles, content }: MembersSpotlightProps) {
  const title = content?.title || DEFAULT_MEMBERS.title;
  const description = content?.description || DEFAULT_MEMBERS.description;
  const { ref: mobileHeaderRef, inView: mobileInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: desktopHeaderRef, inView: desktopInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Row 1: from front (index 0, 1, 2, ...). Row 2: from back (last, second-last, ...)
  const { row1, row2 } = useMemo(
    () => ({
      row1: [...profiles],
      row2: [...profiles].reverse(),
    }),
    [profiles],
  );

  const desktopDuration = marqueeDuration(profiles.length, CARD_WIDTH);
  const mobileDuration = marqueeDuration(profiles.length, MOBILE_CARD_WIDTH);
  const desktopStyle = {
    "--marquee-duration": `${desktopDuration}s`,
  } as React.CSSProperties;
  const mobileStyle = {
    "--marquee-duration": `${mobileDuration}s`,
  } as React.CSSProperties;

  const renderCards = (
    rowProfiles: Profile[],
    startIndex: number,
    copyId: number,
  ) =>
    rowProfiles.map((profile, i) => (
      <motion.div
        key={`${profile.id}-${copyId}-${i}`}
        initial={{ opacity: 0, y: 20, scale: CARD_SCALE }}
        animate={
          desktopInView
            ? { opacity: 1, y: 0, scale: CARD_SCALE }
            : { opacity: 0, y: 20, scale: CARD_SCALE }
        }
        transition={{
          duration: 0.6,
          delay: Math.min((startIndex + i) * 0.05, 0.5),
        }}
        className="shrink-0 overflow-visible flex items-center justify-center origin-center"
        style={{ width: CARD_WIDTH }}
      >
        <MemberProfileCard profile={profile} index={startIndex + i} />
      </motion.div>
    ));

  return (
    <section id="members" className="lg:py-24 py-12 overflow-hidden relative">
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/images/member-sec-bg.png"
          alt=""
          fill
          className="object-cover object-center hidden lg:block"
          unoptimized
          priority={false}
        />
        <Image
          src="/images/mobile-member-bg.png"
          alt=""
          fill
          className="object-cover object-center block lg:hidden"
          unoptimized
          priority={false}
        />
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1/3 lg:hidden z-[1] bg-linear-to-r from-background/80 to-background/0 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 lg:hidden z-[1] bg-linear-to-l from-background/80 to-background/0 pointer-events-none" />

      {/* Mobile: no border div, single carousel - only visible below md (768px) */}
      <div className="md:hidden flex flex-col gap-6 px-4 z-10">
        <motion.div
          ref={mobileHeaderRef}
          initial={{ opacity: 0, y: 30 }}
          animate={mobileInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-[32px] font-black text-white uppercase tracking-wide mb-4 flex flex-col items-center justify-center gap-0">
            <div className="overflow-hidden" style={{ lineHeight: 1.25 }}>
              <motion.span
                className="block text-center will-change-transform"
                style={{ lineHeight: 1.25 }}
                initial={{ y: 96 }}
                animate={mobileInView ? { y: 0 } : { y: 96 }}
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
            animate={mobileInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: mobileInView ? 0.9 : 0 }}
            className="text-[10px] text-white/90 leading-relaxed max-w-3xl mx-auto px-5 md:px-0"
          >
            {description}
          </motion.p>
        </motion.div>

        <div className="-mx-4 overflow-visible relative">
          
          <div className="marquee-track marquee-mobile-ltr flex gap-4 w-max" style={mobileStyle}>
            <div className="flex gap-4 shrink-0">
              {profiles.map((profile, i) => (
                <div
                  key={`${profile.id}-m0-${i}`}
                  className="shrink-0 flex justify-center"
                  style={{ width: 280 }}
                >
                  <MemberProfileCard profile={profile} index={i} />
                </div>
              ))}
            </div>
            <div className="flex gap-4 shrink-0">
              {profiles.map((profile, i) => (
                <div
                  key={`${profile.id}-m1-${i}`}
                  className="shrink-0 flex justify-center"
                  style={{ width: 280 }}
                >
                  <MemberProfileCard profile={profile} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center z-10">
          <Link
            href="/members"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[40px] bg-[#20211B]/20 border border-white/10 px-6 py-3 rounded-[8px] text-sm font-semibold font-[family-name:var(--font-orbitron)] transition-colors duration-300 hover:border-white cursor-pointer"
          >
            <span
              className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white group-hover:text-black">
              View All Members
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>

      {/* Tablet & Desktop: bordered wrapper + marquee (unchanged) */}
      <div className="hidden md:flex mx-20 flex-col gap-1 shadow-lg bg-background rounded-[16px] p-8 px-20">
        {/* Header */}
        <motion.div
          ref={desktopHeaderRef}
          initial={{ opacity: 0, y: 30 }}
          animate={desktopInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-wide mb-2 flex flex-col items-center justify-center gap-0">
            <div className="overflow-hidden" style={{ lineHeight: 1.25 }}>
              <motion.span
                className="block text-center will-change-transform"
                style={{ lineHeight: 1.25 }}
                initial={{ y: 96 }}
                animate={desktopInView ? { y: 0 } : { y: 96 }}
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
            animate={desktopInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: desktopInView ? 0.9 : 0 }}
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </motion.div>

        <div className="relative -mx-6 md:-mx-8 overflow-visible ">
          {/* Row 1: left to right (content scrolls left) */}
          <div className="marquee-row group -mb-5">
            <div className="marquee-track marquee-ltr" style={desktopStyle}>
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row1, 0, 0)}
              </div>
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row1, 0, 1)}
              </div>
            </div>
          </div>

          {/* Row 2: right to left (content scrolls right) */}
          <div className="marquee-row group">
            <div className="marquee-track marquee-rtl" style={desktopStyle}>
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row2, profiles.length, 0)}
              </div>
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row2, profiles.length, 1)}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/members"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[40px] bg-[#20211B]/20 border border-white/10 px-6 py-3 rounded-[8px] text-sm font-semibold font-[family-name:var(--font-orbitron)] transition-colors duration-300 hover:border-white cursor-pointer"
          >
            <span
              className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white group-hover:text-black">
              View All Members
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
