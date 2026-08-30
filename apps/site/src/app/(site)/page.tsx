export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/landing/HeroSection";
import { WhoWeAreSection } from "@/components/landing/WhoWeAreSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { MembersSpotlight } from "@/components/landing/MembersSpotlight";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FAQSection } from "@/components/landing/FAQSection";
import {
  getStats,
  getEvents,
  getProfiles,
  getPartners,
  getFAQs,
  getSiteContent,
  getEventPhotos,
} from "@/lib/supabase/queries";
import type { Event, FAQ, Partner, Profile, Stat } from "@/lib/types";

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export default async function Home() {
  const results = await Promise.allSettled([
    getStats(),
    getEvents(),
    getProfiles(),
    getPartners(),
    getFAQs(),
    getSiteContent(),
    getEventPhotos(),
  ]);

  const stats = results[0].status === "fulfilled" ? toArray<Stat>(results[0].value) : [];
  const events = results[1].status === "fulfilled" ? toArray<Event>(results[1].value) : [];
  const profiles = results[2].status === "fulfilled" ? toArray<Profile>(results[2].value) : [];
  const partners = results[3].status === "fulfilled" ? toArray<Partner>(results[3].value) : [];
  const faqs = results[4].status === "fulfilled" ? toArray<FAQ>(results[4].value) : [];
  const siteContent = results[5].status === "fulfilled" ? results[5].value : {};
  const eventPhotos =
    results[6].status === "fulfilled"
      ? toArray<{ image_url: string }>(results[6].value).map((p) => p.image_url)
      : [];

  return (
    <>
      <HeroSection content={siteContent.hero} />
      <div className="relative z-10 bg-background">
        <hr className="border-white/10 w-full mx-auto my-0" />
        <WhoWeAreSection content={siteContent.who_we_are} />
        <MissionSection content={siteContent.mission} />
        <StatsSection stats={stats} content={siteContent.stats} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <EventsSection events={events} content={siteContent.events} photos={eventPhotos} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <MembersSpotlight profiles={profiles} content={siteContent.members_spotlight} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <PartnersSection partners={partners} content={siteContent.partners} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <FAQSection faqs={faqs} content={siteContent.faq_section} />
        <hr className="border-white/10 w-full mx-auto my-0 hidden md:block" />

      </div>
    </>
  );
}
