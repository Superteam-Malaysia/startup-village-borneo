import type { Metadata } from "next";
import { LeaderboardPageContent } from "@/components/leaderboard";

export const metadata: Metadata = {
  title: "Teams",
  description:
    "Amazing Race team standings and momentum charts. Live data ships with the SVB companion dApp at the event.",
};

export default function TeamsPage() {
  return (
    <main className="site-main site-main--stack">
      <LeaderboardPageContent />
    </main>
  );
}
