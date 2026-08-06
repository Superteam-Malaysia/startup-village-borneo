import type { Metadata } from "next";
import { LeaderboardPageContent } from "@/components/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Amazing Race team standings and momentum charts. Live data ships with the SVB companion dApp at the event.",
};

export default function LeaderboardPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
      <LeaderboardPageContent />
    </main>
  );
}
