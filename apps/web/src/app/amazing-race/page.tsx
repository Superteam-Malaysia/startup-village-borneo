import type { Metadata } from "next";
import { RacePageContent } from "@/components/race";

export const metadata: Metadata = {
  title: "Amazing Race · Startup Village Borneo",
  description:
    "Sixteen race stations across Kuching — food, culture, waterfront, photobooth, and wallet onboarding. Hard cutoff Day 4 at 18:00 MYT.",
};

export default function AmazingRacePage() {
  return (
    <main className="site-main site-main--stack">
      <RacePageContent />
    </main>
  );
}
