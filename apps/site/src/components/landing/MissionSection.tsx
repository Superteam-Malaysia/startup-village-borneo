"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { SiteContent, MissionPillar } from "@/lib/types";

const DEFAULT_PILLARS: MissionPillar[] = [
  { title: "LEARN", image_url: "/images/learn.jpeg", description: "Learn through hands-on education, workshops, and mentorship from experienced builders across the ecosystem." },
  { title: "BUILD", image_url: "/images/build.jpeg", description: "Build alongside the community through hackathons, collaborative events, and real projects that turn ideas into production-ready products." },
  { title: "GROW", image_url: "/images/grow.jpeg", description: "Grow your career and network through strong ecosystem connections and long-term opportunities, locally and globally." },
  { title: "EARN", image_url: "/images/earn.jpeg", description: "Earn through grants, funding access, jobs, and bounties by contributing to impactful Web3 projects." },
];

function MissionPillarFrame({
  index,
  pillar,
}: {
  index: number;
  pillar: MissionPillar;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start end", "end start"],
  });
  const frameClip = useTransform(
    scrollYProgress,
    [0, 0.36, 0.56, 1],
    ["inset(20% 24% round 6px)", "inset(0% 0% round 2px)", "inset(0% 0% round 2px)", "inset(16% 20% round 5px)"]
  );
  const frameY = useTransform(scrollYProgress, [0, 0.45, 1], [58, 0, -72]);
  const titleY = useTransform(scrollYProgress, [0, 0.45, 1], [48, 0, -82]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.14, 0.82, 1], [0.25, 1, 1, 0.18]);
  const [descriptionState, setDescriptionState] = useState<"hidden" | "shown" | "exiting">("hidden");

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      if (value < 0.3) {
        setDescriptionState("hidden");
        return;
      }
      if (value > 0.6) {
        setDescriptionState("exiting");
        return;
      }
      setDescriptionState("shown");
    });
  }, [scrollYProgress]);

  const descriptionY =
    descriptionState === "shown" ? 0 : descriptionState === "exiting" ? -56 : 34;

  return (
    <article
      ref={articleRef}
      className="relative flex min-h-[74vh] flex-col items-center px-5 py-2 md:min-h-[78vh] md:px-10"
    >
      <div className="sticky top-[8vh] flex h-[70vh] w-full flex-col items-center justify-center md:top-[7vh] md:h-[72vh]">
        <motion.h3
          className="pointer-events-none relative z-20 mb-8 text-center font-[family-name:var(--font-orbitron)] text-[clamp(3.4rem,10vw,8.8rem)] font-black uppercase leading-none text-white md:mb-10"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {pillar.title}
        </motion.h3>

        <motion.div
          className="relative z-10 w-[min(82vw,820px)] overflow-hidden rounded-sm border border-white/10 bg-white/5 shadow-2xl shadow-black/35"
          style={{ aspectRatio: "16 / 10", clipPath: frameClip, y: frameY }}
        >
          <Image
            src={pillar.image_url}
            alt={pillar.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 82vw, 820px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C0E]/45 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="relative z-20 mt-8 h-[56px] w-[min(82vw,820px)] overflow-hidden text-[11px] uppercase tracking-wide text-white/75 md:h-[64px] md:text-sm"
          animate={{ opacity: descriptionState === "hidden" ? 0 : 1 }}
          transition={{ duration: 0.18, ease: [0.77, 0, 0.175, 1] }}
        >
          <motion.div
            className="flex items-start justify-between gap-8"
            animate={{ y: descriptionY }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
          >
            <p className="max-w-[600px] normal-case leading-relaxed tracking-normal text-white/80">
              {pillar.description}
            </p>
            <span className="shrink-0 font-[family-name:var(--font-orbitron)] text-white/80">
              0{index + 1}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
}

export function MissionSection({ content }: { content?: SiteContent | null }) {
  const pillars = ((content?.content as { pillars?: MissionPillar[] })?.pillars ?? DEFAULT_PILLARS) as MissionPillar[];

  return (
    <section
      id="missions"
      className="relative overflow-visible bg-[#090C0E] text-white"
    >
      <div className="relative z-10 pb-4 md:pb-6">
        {pillars.map((pillar, i) => (
          <MissionPillarFrame
            key={pillar.title}
            index={i}
            pillar={pillar}
          />
        ))}
      </div>
    </section>
  );
}
