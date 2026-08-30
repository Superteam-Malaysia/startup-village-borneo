"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrambleText } from "@/hooks/useScrambleText";
import { Button } from "@/components/ui/button";
import { UnicornBackground } from "@/components/ui/UnicornBackground";
import { cn } from "@/lib/utils";

const TELEGRAM_URL = "https://t.me/superteammy";
const EARN_URL = "https://earn.superteam.fun";
const FAST_TRACK_URL = "https://superteam.fun/fast-track";
const COLLECTIVE_FORM_URL = "https://forms.gle/superteam-collective"; // placeholder - update if you have the real form

function ScrambleBlock({
  text,
  delay = 0,
  iterationsPerLetter = 1,
  className = "",
}: {
  text: string;
  delay?: number;
  iterationsPerLetter?: number;
  className?: string;
}) {
  const started = useRef(false);
  const { display, replay } = useScrambleText(text, { iterationsPerLetter });

  useEffect(() => {
    if (started.current) return;
    const t = setTimeout(() => {
      started.current = true;
      replay();
    }, delay);
    return () => clearTimeout(t);
  }, [delay, replay]);

  return <span className={cn("font-mono", className)}>{display}</span>;
}

export function WelcomeMessage({ nickname }: { nickname: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <UnicornBackground />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Image src="/superteam.svg" alt="Superteam Malaysia" width={207} height={32} className="h-8 w-auto" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card/95 backdrop-blur-sm p-6 md:p-8 shadow-xl"
        >
          <div className="space-y-6 text-sm md:text-base text-foreground/90">
            {/* Greeting */}
            <p>
              <ScrambleBlock text={`Hi ${nickname || "Member"},`} delay={200} className="font-medium" />
            </p>

            <p>
              <ScrambleBlock
                text="We're thrilled to invite you to join Superteam Malaysia as a full-fledged Member. We accept less than ~5% of applicants, so now is the time to buy yourself a nice gift or just treat yourself to a nice hot coffee. ☕️🎁"
                delay={600}
                iterationsPerLetter={1}
              />
            </p>

            <p>
              <ScrambleBlock
                text="As a Member, you'll get access to the earning opportunities, distribution support from Superteam Malaysia, and a range of exclusive perks and benefits:"
                delay={2200}
                iterationsPerLetter={1}
              />
            </p>

            {/* Benefits list */}
            <ol className="space-y-4 list-decimal list-inside">
              <li className="space-y-2">
                <ScrambleBlock
                  text="Discounts on Essential Services:"
                  delay={3500}
                  iterationsPerLetter={1}
                  className="font-medium"
                />
                <ul className="ml-6 space-y-1 list-disc list-inside text-foreground/80">
                  <li>
                    <ScrambleBlock
                      text="Up to 100% off legal services and consulting sessions with top law firms."
                      delay={4000}
                      iterationsPerLetter={1}
                    />
                  </li>
                  <li>
                    <ScrambleBlock
                      text="40% off on audits, threat monitoring, and dynamic wallet testing."
                      delay={4800}
                      iterationsPerLetter={1}
                    />
                  </li>
                  <li>
                    <ScrambleBlock
                      text="33% off tokenomics design, audits, and modeling from leading Web3 economists, analysts, and researchers."
                      delay={5600}
                      iterationsPerLetter={1}
                    />
                  </li>
                  <li>
                    <ScrambleBlock text="Full list of services " delay={6200} iterationsPerLetter={1} />
                    <a href="/dashboard/perks" className="text-primary hover:underline font-medium">
                      here
                    </a>
                    <ScrambleBlock text="." delay={6400} iterationsPerLetter={1} />
                  </li>
                </ul>
              </li>
              <li className="space-y-1">
                <ScrambleBlock
                  text="Exclusive Earning Opportunities:"
                  delay={6800}
                  iterationsPerLetter={1}
                  className="font-medium"
                />
                <p>
                  <ScrambleBlock
                    text="Participate in high-paying bounties and freelance projects with top crypto projects on "
                    delay={7300}
                    iterationsPerLetter={1}
                  />
                  <a
                    href={EARN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Superteam Earn
                  </a>
                  <ScrambleBlock text=". Set up your profile for free and start earning today!" delay={8000} iterationsPerLetter={1} />
                </p>
              </li>
              <li className="space-y-1">
                <ScrambleBlock
                  text="Fundraising Support:"
                  delay={9000}
                  iterationsPerLetter={1}
                  className="font-medium"
                />
                <p>
                  <ScrambleBlock
                    text="Receive personalized feedback from our partners at leading accelerators and incubators through "
                    delay={9500}
                    iterationsPerLetter={1}
                  />
                  <a
                    href={FAST_TRACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Superteam Fast Track
                  </a>
                  <ScrambleBlock text="." delay={10200} iterationsPerLetter={1} />
                </p>
              </li>
              <li className="space-y-1">
                <ScrambleBlock
                  text="Invest in Early-Stage Solana Startups:"
                  delay={10800}
                  iterationsPerLetter={1}
                  className="font-medium"
                />
                <p>
                  <ScrambleBlock
                    text="Superteam Collective offers opportunities to invest in early-stage Solana projects. Invest on a deal-by-deal basis alongside Superteam Members, Leads, and founders of major Solana protocols. Fill in "
                    delay={11400}
                    iterationsPerLetter={1}
                  />
                  <a
                    href={COLLECTIVE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    this form
                  </a>
                  <ScrambleBlock text=" for an invite." delay={12800} iterationsPerLetter={1} />
                </p>
              </li>
            </ol>

            {/* Telegram CTA - Most important */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 13.5, duration: 0.4 }}
              className="mt-8 pt-6 border-t-2 border-primary/30 bg-primary/5 rounded-lg p-4 -mx-2"
            >
              <p className="mb-4 font-semibold text-foreground text-base">
                <ScrambleBlock
                  text="Please join our Telegram Group if you haven't already."
                  delay={13200}
                  iterationsPerLetter={1}
                  className="font-semibold"
                />
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto cursor-pointer bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold text-base py-6 shadow-lg shadow-primary/20"
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Image src="/icons/telegram.svg" alt="" width={20} height={20} />
                    Join Telegram Group →
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto cursor-pointer">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
