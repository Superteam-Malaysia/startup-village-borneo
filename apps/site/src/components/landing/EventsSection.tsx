"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, ArrowUpRight } from "lucide-react";
import { DomeGallery } from "@/components/ui/DomeGallery";
import type { Event, SiteContent } from "@/lib/types";

const TABS = [
  { id: "past" as const, label: "Past" },
  { id: "upcoming" as const, label: "Upcoming" },
] as const;

// Fallback only — used if the event_photos table is empty or unreachable, so
// the dome never renders blank.
const FALLBACK_EVENT_IMAGES = Array.from(
  { length: 32 },
  (_, i) => `/images/events/${i + 1}.jpeg`,
);

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface EventsSectionProps {
  events: Event[];
  content?: SiteContent | null;
  /** Managed in Dashboard → Event Gallery. */
  photos?: string[];
}

const PAST_EVENTS_LIMIT = 50;

const DEFAULT_EVENTS = {
  title: "Our Events",
  description: "Bringing the community together through meetups, workshops, hackathons, and builder gatherings.",
};

export function EventsSection({ events, content, photos }: EventsSectionProps) {
  const galleryImages = photos && photos.length > 0 ? photos : FALLBACK_EVENT_IMAGES;
  const title = content?.title || DEFAULT_EVENTS.title;
  const description = content?.description || DEFAULT_EVENTS.description;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const pastEvents = events.filter((e) => !e.is_upcoming).slice(0, PAST_EVENTS_LIMIT);

  return (
    <section id="events" className="bg-[#080B0E] overflow-x-hidden w-full">
      {/* Dome Gallery - full screen with title overlay */}
      <div
        ref={ref}
        className="relative w-screen left-1/2 -translate-x-1/2 h-screen min-h-[600px]"
      >
        <div className="absolute inset-0 w-full h-full lg:block hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-full"
          >
            <DomeGallery
              images={galleryImages}
              segments={35}
              maxVerticalRotationDeg={10}
              fit={0.75}
              fitBasis="width"
              overlayBlurColor="#080B0E"
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 w-full h-full lg:hidden block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-full"
          >
            <DomeGallery
              images={galleryImages}
              segments={25}
              maxVerticalRotationDeg={10}
              fit={1}
              fitBasis="width"
              overlayBlurColor="#080B0E"
            />
          </motion.div>
        </div>

        {/* Title - absolute overlay on top */}
        <div className="absolute flex justify-between inset-x-0 h-full lg:top-20 pt-12 lg:pb-32 md:pt-16 px-6 flex-col items-center z-10 pointer-events-none ">
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
              <h2
                className="font-[family-name:var(--font-orbitron)] text-[32px] md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase"
                style={{
                  textShadow:
                    "0 0 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.4)",
                  WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                }}
              >
                {title}
              </h2>
            </motion.span>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: inView ? 0.9 : 0 }}
            className="text-xs md:text-[16px] text-white/90 max-w-3xl mx-auto text-center"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Tabs + Luma integration - below dome */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 ">
        {/* Tab navigation - Luma-style lux-button-switcher with sliding pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center lg:mb-4"
        >
          <div className="relative grid grid-cols-2 min-w-[220px] rounded-xl bg-white/6 border border-white/10 p-1 shadow-lg">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer relative flex items-center justify-center w-full px-6 py-2.5 rounded-lg text-sm font-semibold uppercase transition-colors duration-200 hover:text-white ${
                  activeTab === tab.id ? "text-white" : "text-white/60"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="events-tab-pill"
                    className="absolute inset-0 rounded-lg bg-black/40 border border-white/10"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 font-[family-name:var(--font-orbitron)]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content with smooth crossfade */}
        <AnimatePresence mode="wait">
          {activeTab === "upcoming" && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="w-full max-w-6xl flex flex-col gap-4">
                {/* Side-by-side: image left, Luma iframe right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                  {/* Left: Kuala Lumpur illustration */}
                  <div className="rounded-xl overflow-hidden shadow-lg shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/event-sec.jpg"
                      alt="Kuala Lumpur cityscape with traditional shophouses and modern skyscrapers"
                      className="w-full h-full min-h-[400px] object-cover object-center hidden lg:block"
                    />
                    <p className="absolute bottom-2 text-center w-full text-sm text-white/90 max-w-3xl mx-auto">
                      Illustration from{" "}
                      <a
                        href="https://www.flickr.com/photos/lokamade/52351916901/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/90 hover:text-white hover:underline"
                      >
                        Loka Made Gallery
                      </a>
                    </p>
                  </div>
                  {/* Right: Luma iframe */}
                  <div className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-black/20">
                    <div className="flex-1 min-h-0">
                      <iframe
                        src="https://lu.ma/embed/calendar/cal-sZfiZHfUS5piycU/events?lt=dark"
                        width="100%"
                        height="800"
                        frameBorder="0"
                        allowFullScreen
                        className="w-full min-h-[700px] rounded-xl"
                        style={{
                          border: "0px solid rgba(191, 203, 218, 0.53)",
                          borderRadius: "12px",
                        }}
                        title="Superteam Malaysia Events on Luma"
                      />
                    </div>
                  </div>
                </div>

                <div className="items-center flex w-full justify-center">
                  <a
                    href="https://luma.com/mysuperteam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-[8px] bg-[#20211B]/20 border border-white/10 font-[family-name:var(--font-orbitron)] font-medium text-sm transition-colors duration-300 hover:border-white cursor-pointer"
                  >
                    <span
                      className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                      aria-hidden
                    />
                    <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white group-hover:text-black">
                      View All Events on Luma
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "past" && (
            <motion.div
              key="past"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-12 flex flex-col gap-4"
            >
              <div className="relative">
                <div
                  className="max-h-[400px] md:max-h-[800px] overflow-y-auto overscroll-contain rounded-xl pr-1"
                  data-lenis-prevent
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                  {pastEvents.map((event) => (
                    <a
                      key={event.id}
                      href={event.luma_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface/30 border border-white/5 hover:border-white/10 transition-all group overflow-hidden"
                    >
                      <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden bg-white/5">
                        {event.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-muted-dark" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-solana-purple transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-dark line-clamp-2">
                          {formatDate(event.date)} &middot; {event.location}
                        </p>
                      </div>
                    </a>
                  ))}
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none rounded-b-xl"
                  style={{
                    background: "linear-gradient(to top, #080B0E 0%, transparent 100%)",
                  }}
                  aria-hidden
                />
              </div>
              <div className="items-center flex w-full justify-center">
                <a
                  href="https://luma.com/mysuperteam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-[8px] bg-[#20211B]/20 border border-white/10 font-[family-name:var(--font-orbitron)] font-medium text-sm transition-colors duration-300 hover:border-white cursor-pointer"
                >
                  <span
                    className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                    aria-hidden
                  />
                  <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white group-hover:text-black">
                    View All Events on Luma
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
