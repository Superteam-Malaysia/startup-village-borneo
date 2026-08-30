"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { Stat, SiteContent } from "@/lib/types";

interface StatsSectionProps {
  stats: Stat[];
  content?: SiteContent | null;
}

const DEFAULT_STATS = {
  title: "Powered by Builders",
  description: "From local meetups to global opportunities, our community continues to grow through shipped projects, hosted events, and meaningful contributions across the ecosystem.",
};

export function StatsSection({ stats, content }: StatsSectionProps) {
  const title = content?.title || DEFAULT_STATS.title;
  const description = content?.description || DEFAULT_STATS.description;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="impact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/stats-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-[32px]  md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-wide mb-4 flex flex-col items-center justify-center gap-0">
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
            className="text-[10px] px-3 sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Malaysia Map - larger, overlaps title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 flex justify-center lg:-mt-16 mb-8 lg:mb-16"
        >
          <div className="w-full max-w-6xl xl:max-w-7xl aspect-[1180/516] relative">
            <Image
              src="/malaysia-map.svg"
              alt="Malaysia"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Stats - Index 64px, Label 16px, responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="font-[family-name:var(--font-orbitron)] font-black text-white md:mb-2 tabular-nums text-[36px] md:text-[3rem] lg:text-[64px]">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-[family-name:var(--font-orbitron)] font-black text-white/90 uppercase text-[10px] md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
