"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MemberProfileCard } from "@/components/members/MemberProfileCard";
import { MemberFilters } from "@/components/members/MemberFilters";
import type { Profile, SubskillTag } from "@/lib/types";

const CARD_WIDTH = 320;

function ScalableCardWrapper({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const updateScale = () => {
      const width = el.offsetWidth;
      setScale(Math.min(1, width / CARD_WIDTH));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full "
      style={{ aspectRatio: `${CARD_WIDTH}/470` }}
    >
      <div
        className="absolute left-1/2 top-0 w-[320px] origin-top"
        style={{ transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

interface MembersPageClientProps {
  profiles: Profile[];
  availableSubskills: SubskillTag[];
}

export function MembersPageClient({ profiles, availableSubskills }: MembersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSubskillIds, setSelectedSubskillIds] = useState<string[]>([]);

  const filterOptions = useMemo(
    () => ["All", "Core Team", "Frontend", "Backend", "Blockchain", "Design", "Content", "Growth", "Community"],
    []
  );

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const displayName = profile.nickname || profile.real_name || "";
      const roleNames = (profile.roles || []).map((r) => r.name).join(" ");
      const companyNames = (profile.companies || []).map((c) => c.name).join(" ");
      const skillNames = (profile.skills || []).map((s) => s.name).join(" ");
      const subskillNames = (profile.subskills || []).map((s) => s.name).join(" ");

      const matchesSearch =
        searchQuery === "" ||
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companyNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roleNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skillNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subskillNames.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategoryFilter =
        activeFilter === "All" ||
        (activeFilter === "Core Team" && (profile.user_role === "admin" || profile.user_role === "super_admin")) ||
        (activeFilter !== "All" && (profile.roles || []).some((r) => r.name === activeFilter));

      const profileSubskillIds = new Set((profile.subskills || []).map((s) => s.id));
      const matchesSubskillFilter =
        selectedSubskillIds.length === 0 ||
        selectedSubskillIds.some((id) => profileSubskillIds.has(id));

      return matchesSearch && matchesCategoryFilter && matchesSubskillFilter;
    });
  }, [profiles, searchQuery, activeFilter, selectedSubskillIds]);

  return (
    <div className="relative min-h-screen pt-28 pb-24">
      {/* Fixed background - does not scroll with content */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/member-bg.png')" }}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center md:mb-8 mb-4"
        >
          <h1 className="font-[family-name:var(--font-orbitron)] uppercase text-3xl md:text-4xl lg:text-7xl font-black text-white mb-3">
            Member Directory
          </h1>
          <p className="md:text-lg text-[14px] text-white/90 md:max-w-xl px-4 md:px-0 mx-auto">
            Discover the talented builders, creators, and founders driving the
            Solana ecosystem in Malaysia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:mb-8 mb-4"
        >
          <MemberFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterOptions={filterOptions}
            subskillOptions={availableSubskills}
            selectedSubskillIds={selectedSubskillIds}
            onSubskillChange={setSelectedSubskillIds}
          />
        </motion.div>

        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-sm text-muted-dark mb-6 text-center"
        >
          Showing {filteredProfiles.length} member{filteredProfiles.length !== 1 ? "s" : ""}
        </motion.p> */}

        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile, index) => (
              <ScalableCardWrapper key={profile.id}>
                <MemberProfileCard profile={profile} index={index} expandOnClick />
              </ScalableCardWrapper>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted mb-2">No members found</p>
            <p className="text-sm text-muted-dark">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
