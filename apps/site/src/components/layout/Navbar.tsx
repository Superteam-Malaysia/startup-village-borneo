"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Calendar } from "lucide-react";
import { useScrambleText } from "@/hooks/useScrambleText";

const navLinks = [
  { href: "#about", label: "ABOUT" },
  { href: "#missions", label: "MISSIONS" },
  { href: "#impact", label: "IMPACTS" },
  { href: "#events", label: "EVENTS" },
  { href: "#members", label: "MEMBERS" },
  { href: "#ecosystem", label: "ECOSYSTEMS" },
  // { href: "#community", label: "COMMUNITY" }, // hidden for now
  { href: "#faq", label: "FAQ" },
];

const socialLinks = [
  { href: "https://x.com/SuperteamMY", label: "X", icon: "/icons/x.svg" },
  {
    href: "https://t.me/superteammy",
    label: "TELEGRAM",
    icon: "/icons/telegram.svg",
  },
  {
    href: "https://lu.ma/superteammy",
    label: "LUMA",
    icon: "calendar" as const,
  },
  {
    href: "https://www.instagram.com/superteammalaysia",
    label: "INSTAGRAM",
    icon: "/icons/instagram.svg",
  },
  {
    href: "https://www.linkedin.com/company/superteam-malaysia",
    label: "LINKEDIN",
    icon: "/icons/linkedin.svg",
  },
];

function NavButton({ text, onClick }: { text: string; onClick?: () => void }) {
  const canReplayRef = useRef(true);
  const { display, replay } = useScrambleText(text, { playOnMount: true });

  const handleMouseEnter = () => {
    if (canReplayRef.current) {
      canReplayRef.current = false;
      replay();
    }
  };

  const handleMouseLeave = () => {
    canReplayRef.current = true;
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative shrink-0 w-[130px] min-w-[130px] rounded-sm text-center overflow-hidden border border-white/40 px-4 py-2 font-[family-name:var(--font-orbitron)] text-xs tracking-widest text-white font-medium uppercase transition-colors duration-300 hover:border-white cursor-pointer"
    >
      <span
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
        aria-hidden
      />
      <span className="relative z-10 pointer-events-none transition-colors duration-300 group-hover:text-black font-mono">
        {display}
      </span>
    </button>
  );
}

function NavCtaLink({
  href,
  text,
  external,
}: {
  href: string;
  text: string;
  external?: boolean;
}) {
  const canReplayRef = useRef(true);
  const { display, replay } = useScrambleText(text, { playOnMount: true });

  const handleMouseEnter = () => {
    if (canReplayRef.current) {
      canReplayRef.current = false;
      replay();
    }
  };

  const handleMouseLeave = () => {
    canReplayRef.current = true;
  };

  const baseClass =
    "group relative shrink-0 w-[130px] min-w-[130px] rounded-sm text-center overflow-hidden border border-white/40 px-4 py-2 font-[family-name:var(--font-orbitron)] text-xs tracking-widest text-white font-medium uppercase transition-colors duration-300 hover:border-white";

  const content = (
    <>
      <span
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
        aria-hidden
      />
      <span className="relative z-10 pointer-events-none transition-colors duration-300 group-hover:text-black font-mono">
        {display}
      </span>
    </>
  );

  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={baseClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </Link>
  );
}

function MenuScrambleLink({
  href,
  text,
  onClick,
  index,
}: {
  href: string;
  text: string;
  onClick: () => void;
  index: number;
}) {
  const canReplayRef = useRef(true);
  const { display, replay } = useScrambleText(text, { playOnMount: true });

  const handleMouseEnter = () => {
    if (canReplayRef.current) {
      canReplayRef.current = false;
      replay();
    }
  };

  const handleMouseLeave = () => {
    canReplayRef.current = true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="group flex items-center justify-center gap-2 w-[320px] font-[family-name:var(--font-orbitron)] text-xl md:text-3xl font-bold tracking-wider text-white/80 uppercase transition-colors duration-300 hover:text-solana-green"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span
          className="w-1.5 h-1.5 shrink-0 rounded-full bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        />
        <span className="pointer-events-none font-mono">{display}</span>
      </Link>
    </motion.div>
  );
}

function SocialLink({
  href,
  text,
  index,
}: {
  href: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.06, duration: 0.3, ease: "easeOut" }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-[family-name:var(--font-orbitron)] text-xs tracking-widest text-white/50 uppercase transition-colors duration-300 hover:text-solana-green"
      >
        {text}
      </a>
    </motion.div>
  );
}

const MOBILE_BREAKPOINT = 768;

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [inFooter, setInFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = () => setIsMobile(mq.matches);
    const id = requestAnimationFrame(() => setIsMobile(mq.matches));
    mq.addEventListener("change", handler);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", handler);
    };
  }, []);

  const isMembersPage = pathname === "/members";

  // Visibility is purely positional: the bar belongs to the stretch of page
  // between the hero and the footer, regardless of scroll direction.
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const hero = document.getElementById("hero");
    const heroBottom = hero
      ? hero.offsetTop + hero.offsetHeight
      : window.innerHeight;

    setPastHero(currentY > heroBottom - 100);

    // "Fully in the footer" — its top edge has reached the top of the viewport,
    // so nothing but footer is on screen.
    const footer = document.querySelector("footer");
    setInFooter(footer ? footer.getBoundingClientRect().top <= 0 : false);
  }, []);

  useEffect(() => {
    // Sync once on mount so a page restored mid-scroll starts in the right state.
    const id = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const showBar =
    // The menu overlay needs its own close button to stay reachable.
    menuOpen ||
    (!inFooter && (isMembersPage || pastHero || isMobile));

  return (
    <>
      {/* Floating Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-100 pointer-events-none"
        style={{ padding: "12px 16px" }}
      >
        <div
          className="mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500 ease-out rounded-sm md:px-4 md:py-2.5"
          style={{
            maxWidth: 1280,
            opacity: showBar ? 1 : 0,
            transform: showBar ? "translateY(0)" : "translateY(-20px)",
          }}
        >
          {/* Mobile: Black header with logo + text + flag + hamburger */}
          <div
            className="flex md:hidden items-center justify-between w-full rounded-md px-4 py-3 "
            style={{ minHeight: 48 }}
          >
            <Link href="/" className="flex items-center gap-2 text-white">
              <Image
                src="/superteam.svg"
                alt="Superteam Malaysia"
                width={181}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 text-white hover:opacity-80 transition-opacity"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          {/* Desktop: Connect + Logo + Menu */}
          <div className="hidden md:flex items-center justify-between w-full rounded-sm bg-background/80 backdrop-blur-xl px-4 py-2.5">
            <NavCtaLink href="/dashboard" text="CONNECT" />
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/superteam.svg"
                alt="Superteam Malaysia"
                width={181}
                height={28}
                className="h-7 w-auto"
                priority
              />
            </Link>
            <NavButton
              text={menuOpen ? "CLOSE" : "MENU"}
              onClick={() => setMenuOpen((v) => !v)}
            />
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] flex flex-col bg-background"
            initial={{ clipPath: "circle(0% at calc(100% - 90px) 32px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 90px) 32px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 90px) 32px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Top spacer for the navbar */}
            <div className="h-20" />

            {/* Nav Links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-5 md:gap-7">
              {navLinks.map((link, i) => (
                <MenuScrambleLink
                  key={link.href}
                  href={link.href}
                  text={link.label}
                  onClick={() => setMenuOpen(false)}
                  index={i}
                />
              ))}
            </div>

            {/* Socials - Mobile: icons */}
            <div className="flex md:hidden items-center justify-center gap-6 pb-10 pt-6">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + i * 0.06,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="text-white/50 hover:text-solana-green transition-colors duration-300 p-2"
                  aria-label={link.label}
                >
                  {link.icon === "calendar" ? (
                    <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
                  ) : (
                    <Image
                      src={link.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Socials - Desktop: text */}
            <div className="hidden md:flex items-center justify-center gap-6 md:gap-10 pb-10 pt-6">
              {socialLinks.map((link, i) => (
                <SocialLink
                  key={link.href}
                  href={link.href}
                  text={link.label}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
