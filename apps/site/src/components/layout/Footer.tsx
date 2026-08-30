"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { href: "https://x.com/SuperteamMY", label: "X", icon: "/icons/x.svg" },
  {
    href: "https://t.me/superteammy",
    label: "Telegram",
    icon: "/icons/telegram.svg",
  },
  {
    href: "https://www.instagram.com/superteammalaysia",
    label: "Instagram",
    icon: "/icons/instagram.svg",
  },
];

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#missions", label: "Mission" },
  { href: "#impact", label: "Impact" },
  { href: "#events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "#ecosystem", label: "Ecosystems" },
  { href: "#faq", label: "FAQ" },
];

const resourceLinks = [
  { href: "https://superteam.fun", label: "Superteam Global" },
  { href: "https://earn.superteam.fun", label: "Superteam Earn" },
  { href: "https://talent.superteam.fun", label: "Superteam Talent" },
  { href: "https://superteam.fun/branding", label: "Superteam Brand Kit" },
  { href: "https://drive.google.com/drive/folders/1QSKnKm1EAjwk8R5zxtFi_WBuEse0QKGt?usp=sharing", label: "SuperteamMY Brand Kit" },
  { href: "https://solana.com", label: "Solana" },
  { href: "https://solana.com/branding", label: "Solana Brand Kit" },
  { href: "https://superteamdao.notion.site/malaysia", label: "Docs" },
];

type SubscribeStatus = "idle" | "loading" | "success" | "error";

type Toast = { message: string; type: "success" | "error" };

/** Posts the footer signup to /api/subscribe, reporting the result via a toast. */
function useSubscribe(source: string, notify: (toast: Toast) => void) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        notify({
          message: data.error || "Something went wrong. Please try again.",
          type: "error",
        });
        return;
      }

      setStatus("success");
      notify({
        message: data.alreadySubscribed
          ? "You're already on the list."
          : "Thanks — you're subscribed!",
        type: "success",
      });
      setEmail("");
    } catch {
      setStatus("error");
      notify({ message: "Network error. Please try again.", type: "error" });
    }
  }

  return { email, setEmail, status, handleSubmit, setStatus };
}

/** One toast shared by both footer forms; only one is ever on screen at a time. */
function useSubscribeToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  const notify = useCallback((next: Toast) => {
    clearTimers();
    setIsExiting(false);
    setToast(next);

    timers.current.push(
      setTimeout(() => {
        setIsExiting(true);
        timers.current.push(
          setTimeout(() => {
            setToast(null);
            setIsExiting(false);
          }, 300)
        );
      }, 4000)
    );
  }, []);

  // Timers outlive the toast itself, so they have to be torn down on unmount.
  useEffect(() => clearTimers, []);

  return { toast, isExiting, notify };
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const footerBgRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const { toast, isExiting: toastExiting, notify } = useSubscribeToast();
  const desktopSubscribe = useSubscribe("footer", notify);
  const mobileSubscribe = useSubscribe("footer-mobile", notify);

  useEffect(() => {
    const footer = footerRef.current;
    const bg = footerBgRef.current;
    if (!footer || !bg) return;

    const ctx = gsap.context(() => {
      // Image scrolls UP when user scrolls DOWN (parallax lag effect)
      const yStart = 10;
      const yEnd = -100;
      gsap.set(bg, { y: yStart, scale: 1, transformOrigin: "center center" });
      gsap.fromTo(
        bg,
        { y: yStart, scale: 1 },
        {
          y: yEnd,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <footer
        ref={footerRef}
        className="relative w-full md:min-h-[640px] flex flex-col md:pb-[80px] bg-background"
      >
        {/* Mobile: full-bleed background to cover entire footer */}
        <div className="absolute inset-0 z-0 md:hidden">
          <Image
            src="/images/footer-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #080B0E 0%, #080B0E20 100%)",
            }}
            aria-hidden
          />
        </div>
        {/* Background image + overlay (desktop) + content */}
        <div className="inset-0 md:px-20 mx-auto w-full md:h-full relative z-10">
          <div className="w-full md:min-h-[800px] min-h-[600px] inset-0 md:mt-20 md:rounded-t-[16px] rounded-t-[40px] relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden h-full">
              <div
                ref={footerBgRef}
                className="absolute inset-0 w-full bottom-0 h-[105%] will-change-transform"
              >
                <Image
                  src="/images/footer-bg.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority={false}
                />
              </div>

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, #080B0E 0%, #080B0E20 100%)",
                }}
                aria-hidden
              />
              <div className="relative z-10 flex flex-col h-full justify-between mx-auto w-full px-6 lg:px-20 md:pt-12 pt-6 pb-10 gap-[18px] md:gap-0">
                {/* Logo + socials */}
                <div className="flex flex-col items-left gap-[18px] md:gap-5 md:mb-10">
                  <Link href="/" className="flex items-center ">
                    <Image
                      src="/superteam.svg"
                      alt="Superteam"
                      width={300}
                      height={46}
                      className="h-6 w-auto md:h-auto md:w-[300px]"
                    />
                  </Link>
                  <p className="text-xs font-semibold md:text-[16px] text-white max-w-[280px]">
                    Let&apos;s build the next generation of the internet
                    together on Solana.
                  </p>
                  <div className="flex gap-1 flex-col">
                    <p className="text-xs font-semibold md:text-[16px] text-white">Follow us on</p>
                    <div className="flex gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded flex items-center justify-center text-white/90 hover:text-white transition-colors"
                        aria-label={link.label}
                      >
                        <Image
                          src={link.icon}
                          alt=""
                          width={24}
                          height={24}
                          className="shrink-0 opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </a>
                    ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="md:flex flex-col items-center text-center gap-[18px] md:gap-0 hidden">
                  <h3 className="text-sm md:text-2xl lg:text-3xl font-black text-white mb-0 md:mb-6 font-[family-name:var(--font-orbitron)] tracking-tight">
                    Sign up for our community updates
                  </h3>
                  <form
                    className="flex w-2/3 max-w-sm md:max-w-md gap-0 rounded-lg overflow-hidden bg-white"
                    onSubmit={desktopSubscribe.handleSubmit}
                  >
                    <input
                      type="email"
                      name="email"
                      required
                      value={desktopSubscribe.email}
                      onChange={(e) => {
                        desktopSubscribe.setEmail(e.target.value);
                        desktopSubscribe.setStatus("idle");
                      }}
                      placeholder="Enter your email"
                      className="flex-1 min-w-0 px-4 py-3 text-black placeholder:text-gray-500 text-xs md:text-sm outline-none rounded-l-lg "
                      aria-label="Email for updates"
                    />
                    <button
                      type="submit"
                      disabled={desktopSubscribe.status === "loading"}
                      className="shrink-0 w-12 h-12 cursor-pointer flex items-center justify-center bg-white text-black hover:bg-white/90 transition-colors rounded-r-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-label="Subscribe"
                    >
                      {desktopSubscribe.status === "loading" ? (
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : desktopSubscribe.status === "success" ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>

                <div className="flex flex-col items-left gap-[18px] md:gap-6 md:mb-10">
                  {/* MobileCTA */}
                  <div className="md:hidden flex-col items-start text-center gap-2 flex">
                    <h3 className="text-xs  font-black text-white font-[family-name:var(--font-orbitron)] tracking-tight">
                      Sign up for our community updates
                    </h3>
                    <form
                      className="flex w-[300px] gap-0 rounded-lg overflow-hidden bg-white"
                      onSubmit={mobileSubscribe.handleSubmit}
                    >
                      <input
                        type="email"
                        name="email"
                        required
                        value={mobileSubscribe.email}
                        onChange={(e) => {
                          mobileSubscribe.setEmail(e.target.value);
                          mobileSubscribe.setStatus("idle");
                        }}
                        placeholder="Enter your email"
                        className="flex-1 min-w-0 px-4 py-2 text-black placeholder:text-gray-500 text-xs md:text-sm outline-none rounded-l-lg "
                        aria-label="Email for updates"
                      />
                      <button
                        type="submit"
                        disabled={mobileSubscribe.status === "loading"}
                        className="shrink-0 w-10 h-10 cursor-pointer flex items-center justify-center bg-white text-black hover:bg-white/90 transition-colors rounded-r-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label="Subscribe"
                      >
                        {mobileSubscribe.status === "loading" ? (
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : mobileSubscribe.status === "success" ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Nav + Resources - two columns with sub-columns for links (hidden on mobile) */}
                  <div className="flex flex-row justify-between">
                    <div className="hidden md:block">
                      <h4 className="text-xs font-black text-white/70 uppercase tracking-wider mb-4 font-[family-name:var(--font-orbitron)]">
                        Navigation
                      </h4>
                      <ul className="grid grid-cols-2 gap-x-2 gap-y-2 ">
                        {navLinks.map((link) => (
                          <li
                            key={`${link.href}-${link.label}`}
                            className="min-w-40 w-full"
                          >
                            <Link
                              href={link.href}
                              className="text-sm text-white hover:text-white transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white/70 uppercase tracking-wider md:mb-4 mb-2 font-[family-name:var(--font-orbitron)]">
                        Resources
                      </h4>
                      <ul className="grid grid-cols-2 gap-x-8 md:gap-y-2 gap-y-1">
                        {resourceLinks.map((link) => (
                          <li key={link.href + link.label}>
                            <a
                              href={link.href}
                              target={
                                link.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                link.href.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="text-xs md:text-sm text-white hover:text-white/80 transition-colors"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Copyright + legal */}
                  <div className="mt-auto pb-5 md:pb-2 md:pt-6 flex flex-col sm:flex-row justify-between md:items-center items-start md:gap-4 gap-1 text-[10px] md:text-sm text-white">
                    <p>
                      © {new Date().getFullYear()} Superteam Malaysia. All
                      rights reserved.{" "}
                      <span className="text-white/50 ">
                        Made by{" "}
                        <a
                          href="https://junshen.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:underline hover:text-white/90 transition-colors text-[10px] md:text-xs md:text-inherit"
                        >
                          Junshen
                        </a>
                        {" "}and Han.
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-1 text-white/50">
                      <span>Part of the global</span>
                      <a
                        href="https://superteam.fun"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline hover:text-white/90 transition-colors md:text-xs md:text-inherit text-[10px] "
                      >
                        Superteam
                      </a>
                      <span>network</span>
                      <span>·</span>
                      <span>Powered by</span>
                      <a
                        href="https://solana.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline hover:text-white/90 transition-colors md:text-xs md:text-inherit text-[10px] "
                      >
                        Solana
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom tag - full width dark bar with superteam SVG, fades in from bottom when fully scrolled */}
            <div
              ref={tagRef}
              className="md:hidden w-full z-10 absolute bottom-0 left-0 right-0 flex items-center justify-center overflow-hidden md:px-8 px-4 "
            >
              <Image
                src="/images/superteam-tag.svg"
                alt="Superteam"
                width={1362}
                height={153}
                className="w-full min-w-full h-auto object-contain object-center"
                unoptimized
              />
            </div>
          </div>
        </div>
        {/* Bottom tag - full width dark bar with superteam SVG, fades in from bottom when fully scrolled */}
        <div
          ref={tagRef}
          className="hidden md:flex w-full z-10 absolute bottom-0 left-0 right-0  items-center justify-center overflow-hidden md:px-8 px-4 "
        >
          <Image
            src="/images/superteam-tag.svg"
            alt="Superteam"
            width={1362}
            height={153}
            className="w-full min-w-full h-auto object-contain object-center"
            unoptimized
          />
        </div>
      </footer>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            // Above the fixed navbar (z-100), anchored to the bottom because
            // that is where the reader already is when they hit subscribe.
            "fixed left-1/2 bottom-6 z-[110] -translate-x-1/2 flex items-center gap-2.5",
            "rounded-full border border-white/10 bg-background/95 backdrop-blur px-5 py-3 shadow-lg",
            "transition-all duration-300 ease-out",
            toastExiting
              ? "translate-y-3 opacity-0"
              : "translate-y-0 opacity-100"
          )}
        >
          {toast.type === "success" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-green-400"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-red-400"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
          <p className="text-sm font-medium text-white whitespace-nowrap">
            {toast.message}
          </p>
        </div>
      )}
    </>
  );
}
