"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, X } from "lucide-react";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLenisRef } from "@/contexts/LenisContext";
import { BADGE_PILL_CLASS, BADGE_PILL_FALLBACK, cardGradientFor } from "@/lib/badges";

interface MemberProfileCardProps {
  profile: Profile;
  index?: number;
  /** When true (members page), click opens enlarged overlay with front+back side by side */
  expandOnClick?: boolean;
}


export function MemberProfileCard({
  profile,
  index = 0,
  expandOnClick = false,
}: MemberProfileCardProps) {
  const displayName = (
    profile.nickname ||
    profile.real_name ||
    "Member"
  ).toUpperCase();
  const primaryRole = (profile.roles || [])[0]?.name;
  const primaryCompany = (profile.companies || [])[0]?.name;
  const profession =
    [primaryCompany, primaryRole].filter(Boolean).join("\n") || "Member";
  const memberNum = profile.member_number ?? null;
  const formattedMemberNum =
    memberNum != null ? `#${String(memberNum).padStart(3, "0")}` : null;

  const hasAnyLink =
    profile.twitter_url ||
    profile.linkedin_url ||
    profile.telegram_url ||
    profile.website_url;

  const cardGradient = cardGradientFor(profile.badges);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const lenisRef = useLenisRef();

  const handleCardClick = () => {
    if (expandOnClick) {
      setIsExpanded(true);
    } else {
      setIsFlipped((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!isExpanded) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    document.addEventListener("keydown", onEscape);

    // Stop Lenis smooth scroll so background doesn't scroll
    lenisRef?.current?.stop();

    // Lock body scroll using position:fixed (fallback for when Lenis isn't active)
    const scrollY = window.scrollY;
    const body = document.body;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onEscape);
      lenisRef?.current?.start();
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isExpanded, lenisRef]);

  const cardContent = (
    <>
      {/* Front face */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: cardGradient,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute z-10 w-full h-full pointer-events-none" style={{ backgroundImage: "url('/images/noise.png')" }} />
        <div className="relative p-5 flex flex-col items-center h-full min-h-0 z-20">
          <div className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Image src="/superteam.svg" alt="Superteam Malaysia" width={156} height={24} className="h-6 w-auto" />
            </div>
            {formattedMemberNum && (
              <span className="px-2.5 py-1 rounded-sm text-xs font-bold text-white border border-white/20 bg-white/10 font-[family-name:var(--font-orbitron)]">
                {formattedMemberNum}
              </span>
            )}
          </div>
          <div className="w-full flex justify-center items-center mb-3">
            <div className="w-1.5 h-1.5 bg-white/20" />
            <div className="w-full h-0.25 bg-white/20" />
            <div className="w-1.5 h-1.5 bg-white/20" />
          </div>
          <div className="relative w-full flex flex-col items-center mb-2">
            <div className="w-full px-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-solana-purple/20 to-solana-green/20">
                    <span className="text-2xl font-bold text-white/80">{displayName.charAt(0)}</span>
                  </div>
                )}
                {(profile.badges || []).length > 0 && (
                  <div className="absolute top-2 w-full flex flex-wrap justify-center gap-1">
                    {profile.badges!.map((b) => (
                      <span
                        key={b}
                        className={cn(
                          "px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider font-[family-name:var(--font-orbitron)]",
                          BADGE_PILL_CLASS[b] ?? BADGE_PILL_FALLBACK
                        )}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-black text-white uppercase mb-1 text-center font-[family-name:var(--font-orbitron)]">{displayName}</h3>
          <div className="flex flex-col items-center mb-2">
            <p className="text-xs text-white/80 uppercase text-center">{primaryCompany}</p>
            <p className="text-xs text-white/80 uppercase text-center">{primaryRole}</p>
          </div>
          <div className="w-full flex justify-center items-center mb-3">
            <div className="w-1.5 h-1.5 bg-white/20" />
            <div className="w-full h-0.25 bg-white/20" />
            <div className="w-1.5 h-1.5 bg-white/20" />
          </div>
          <div className="flex items-center justify-center gap-4 mt-auto min-h-[28px]">
            {profile.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="X">
                <Image src="/icons/x.svg" alt="" width={16} height={16} className="shrink-0" />
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
                <Image src="/images/linkedin.svg" alt="" width={16} height={16} className="shrink-0" />
              </a>
            )}
            {profile.telegram_url && (
              <a href={profile.telegram_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="Telegram">
                <Image src="/icons/telegram.svg" alt="" width={16} height={16} className="shrink-0" />
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="Portfolio">
                <Link2 className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const backContent = (
    <div
      className="w-full h-full rounded-2xl overflow-hidden flex flex-col relative"
      style={{
        background: cardGradient,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.06 }}>
        <Image src="/stmy-mark.svg" alt="" width={117} height={100} className="object-contain" />
      </div>
      <div className="absolute z-10 w-full h-full pointer-events-none" style={{ backgroundImage: "url('/images/noise.png')" }} />
      <div className="relative flex-1 min-h-0 z-30 overflow-y-auto overscroll-contain" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 flex flex-col">
          <div className="flex justify-center items-center mb-3">
            <div className="w-1.5 h-1.5 bg-white/20" />
            <div className="flex-1 max-w-[200px] h-0.25 bg-white/20 mx-2" />
            <div className="w-1.5 h-1.5 bg-white/20" />
          </div>
          {(profile.bio || primaryRole || primaryCompany) && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1">About</p>
              <p className="text-xs text-white/80 leading-relaxed">
                {[profession !== "Member" ? profession : null, profile.bio].filter(Boolean).join(" ")}
              </p>
            </div>
          )}
          {((profile.skills?.length ?? 0) > 0 || (profile.subskills?.length ?? 0) > 0) && (() => {
            const allSkills = [...(profile.skills || []), ...(profile.subskills || [])];
            const maxVisible = 9;
            const visible = allSkills.slice(0, maxVisible);
            const remaining = allSkills.length - maxVisible;
            return (
              <div className="mb-3">
                <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1.5">Skill</p>
                <div className="flex flex-wrap gap-1">
                  {visible.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] uppercase shrink-0">{s.name}</span>
                  ))}
                  {remaining > 0 && <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] shrink-0">+{remaining}</span>}
                </div>
              </div>
            );
          })()}
          {profile.achievements && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1.5">Achievements</p>
              <ul className="text-xs text-white/80 space-y-1">
                {profile.achievements.split(/\n+/).map((s) => s.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean).map((line, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-white/60 shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {profile.talk_to_me_about && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1">Talk to me about</p>
              <p className="text-xs text-white/80">{profile.talk_to_me_about}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="w-full max-w-[320px] cursor-pointer"
        onClick={handleCardClick}
      >
      <motion.div
        className="relative w-full min-h-[420px] rounded-2xl overflow-visible shadow-xl"
        style={{ perspective: "1000px" }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="relative w-full h-full min-h-[420px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden relative"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: cardGradient,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="absolute z-10 w-full h-full pointer-events-none"
              style={{ backgroundImage: "url('/images/noise.png')" }}
            />
            <div className="relative p-5 flex flex-col items-center h-full min-h-0 z-20">
        {/* Header: logo + flag + member number */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image
              src="/superteam.svg"
              alt="Superteam Malaysia"
              width={156}
              height={24}
              className="h-6 w-auto"
            />
          </div>
          {formattedMemberNum && (
            <span className="px-2.5 py-1 rounded-sm text-xs font-bold text-white border border-white/20 bg-white/10 font-[family-name:var(--font-orbitron)]">
              {formattedMemberNum}
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="w-full flex justify-center items-center mb-3">
          <div className="w-1.5 h-1.5 bg-white/20" />
          <div className="w-full h-0.25 bg-white/20"></div>
          <div className="w-1.5 h-1.5  bg-white/20" />
        </div>

        {/* Avatar area with role badge */}
        <div className="relative w-full flex flex-col items-center mb-2">
          <div className="w-full px-4">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-solana-purple/20 to-solana-green/20">
                  <span className="text-2xl font-bold text-white/80">
                    {displayName.charAt(0)}
                  </span>
                </div>
              )}
              {/* Badges */}
              {(profile.badges || []).length > 0 && (
                <div className="absolute top-2 w-full flex flex-wrap justify-center gap-1 ">
                  {profile.badges!.map((b) => (
                    <span
                      key={b}
                      className={cn(
                        "px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider font-[family-name:var(--font-orbitron)]",
                        BADGE_PILL_CLASS[b] ?? BADGE_PILL_FALLBACK
                      )}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-black text-white uppercase mb-1 text-center font-[family-name:var(--font-orbitron)]">
          {displayName}
        </h3>

        <div className="flex flex-col items-center mb-2">
          {/* Profession */}
          <p className="text-xs text-white/80 uppercase text-center">
            {primaryCompany}
          </p>
          <p className="text-xs text-white/80 uppercase text-center">
            {primaryRole}
          </p>
        </div>

        {/* Separator */}
        <div className="w-full flex justify-center items-center mb-3">
          <div className="w-1.5 h-1.5 bg-white/20" />
          <div className="w-full h-0.25 bg-white/20"></div>
          <div className="w-1.5 h-1.5  bg-white/20" />
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 mt-auto min-h-[28px]">
          {profile.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="X"
            >
              <Image src="/icons/x.svg" alt="" width={16} height={16} className="shrink-0" />
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Image src="/images/linkedin.svg" alt="" width={16} height={16} className="shrink-0" />
            </a>
          )}
          {profile.telegram_url && (
            <a
              href={profile.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Telegram"
            >
              <Image src="/icons/telegram.svg" alt="" width={16} height={16} className="shrink-0" />
            </a>
          )}
          {profile.website_url && (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Portfolio"
            >
              <Link2 className="w-4 h-4" />
            </a>
          )}
        </div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: cardGradient,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            {/* Centered logo watermark - subtle so it doesn't obscure content */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: 0.06 }}
            >
              <Image
                src="/stmy-mark.svg"
                alt=""
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div
              className="absolute z-10 w-full h-full pointer-events-none"
              style={{ backgroundImage: "url('/images/noise.png')" }}
            />
            <div
              className="relative flex-1 min-h-0 z-30 overflow-y-auto overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 flex flex-col">
              {/* Decorative line */}
              <div className="flex justify-center items-center mb-3">
                <div className="w-1.5 h-1.5 bg-white/20" />
                <div className="flex-1 max-w-[200px] h-0.25 bg-white/20 mx-2" />
                <div className="w-1.5 h-1.5 bg-white/20" />
              </div>

              {(profile.bio || primaryRole || primaryCompany) && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1">About</p>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {[profession !== "Member" ? profession : null, profile.bio].filter(Boolean).join(" ")}
                  </p>
                </div>
              )}

              {((profile.skills?.length ?? 0) > 0 || (profile.subskills?.length ?? 0) > 0) && (() => {
                const allSkills = [...(profile.skills || []), ...(profile.subskills || [])];
                const maxVisible = 9;
                const visible = allSkills.slice(0, maxVisible);
                const remaining = allSkills.length - maxVisible;
                return (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1.5">Skill</p>
                    <div className="flex flex-wrap gap-1">
                      {visible.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] uppercase shrink-0">
                          {s.name}
                        </span>
                      ))}
                      {remaining > 0 && (
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] shrink-0">
                          +{remaining}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {profile.achievements && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1.5">Achievements</p>
                  <ul className="text-xs text-white/80 space-y-1">
                    {profile.achievements
                      .split(/\n+/)
                      .map((s) => s.replace(/^[•\-\*]\s*/, "").trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-white/60 shrink-0">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {profile.talk_to_me_about && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-1">Talk to me about</p>
                  <p className="text-xs text-white/80">{profile.talk_to_me_about}</p>
                </div>
              )}

              {hasAnyLink && (
                <div className="flex items-center justify-center gap-4 mt-auto pt-3">
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="X">
                      <Image src="/icons/x.svg" alt="" width={16} height={16} className="shrink-0" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
                      <Image src="/images/linkedin.svg" alt="" width={16} height={16} className="shrink-0" />
                    </a>
                  )}
                  {profile.telegram_url && (
                    <a href={profile.telegram_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="Telegram">
                      <Image src="/icons/telegram.svg" alt="" width={16} height={16} className="shrink-0" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/70 hover:text-white transition-colors" aria-label="Portfolio">
                      <Link2 className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              <div className="flex justify-center items-center mt-3">
                <div className="w-1.5 h-1.5 bg-white/20" />
                <div className="flex-1 max-w-[200px] h-0.25 bg-white/20 mx-2" />
                <div className="w-1.5 h-1.5 bg-white/20" />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-[10px] text-white/50 hover:text-white/80 text-center mt-2 cursor-pointer w-full"
              >
                Click to flip back
              </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>

      {expandOnClick &&
        isExpanded &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden overscroll-none"
              data-lenis-prevent
              onClick={() => setIsExpanded(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex gap-6 max-w-[90vw] overflow-x-auto overflow-y-auto overscroll-contain scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-[320px] h-fit shrink-0">
                  <div className="relative w-full rounded-2xl overflow-hidden">
                    {cardContent}
                  </div>
                </div>
                <div className="w-[320px] shrink-0 min-h-[420px]">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    {backContent}
                  </div>
                </div>
              </motion.div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
