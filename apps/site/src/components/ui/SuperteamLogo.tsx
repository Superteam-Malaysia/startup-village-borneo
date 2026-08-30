"use client";

import { useId } from "react";
import { motion } from "framer-motion";

interface SuperteamLogoProps {
  className?: string;
  animated?: boolean;
  color?: string;
}

export function SuperteamLogo({
  className = "",
  animated = true,
  color = "white",
}: SuperteamLogoProps) {
  // Unique ID per instance to avoid clip-path conflicts (hydration-safe)
  const reactId = useId();
  const clipId = "st-clip-" + reactId.replace(/:/g, "");

  if (!animated) {
    return (
      <svg
        viewBox="0 0 42 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M32.6944 4.90892H41.4468V8.28973C41.4468 12.8741 37.742 16.5795 33.1571 16.5795H32.6938L32.6944 4.90892ZM20.2372 0H32.6944V31.9071H31.2127C22.1822 31.9071 20.3765 25.6088 20.3765 20.0055L20.2372 0ZM0 7.22433C0 12.9205 4.07522 15.0043 8.61369 15.6993H0V32H8.28973C16.6252 32 17.5978 28.2952 17.5978 24.7757C17.5978 20.4688 14.6338 17.459 10.0495 16.3007H17.5978V0H9.30807C0.972554 0 0 3.70477 0 7.22433Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 42 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          {/* Left part - S shape: animates from 0-width to full reveal */}
          <motion.rect
            x="0"
            y="0"
            initial={{ width: 0 }}
            animate={{ width: 18 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            height="32"
          />
          {/* Right part - T shape top: animates from 0-width to full reveal */}
          <motion.rect
            x="20"
            y="0"
            initial={{ width: 0 }}
            animate={{ width: 22 }}
            transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
            height="17"
          />
          {/* Right part - T shape bottom: animates from 0-height to full reveal */}
          <motion.rect
            x="20"
            y="0"
            initial={{ height: 0 }}
            animate={{ height: 32 }}
            transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
            width="13"
          />
        </clipPath>
      </defs>

      <motion.path
        clipPath={`url(#${clipId})`}
        d="M32.6944 4.90892H41.4468V8.28973C41.4468 12.8741 37.742 16.5795 33.1571 16.5795H32.6938L32.6944 4.90892ZM20.2372 0H32.6944V31.9071H31.2127C22.1822 31.9071 20.3765 25.6088 20.3765 20.0055L20.2372 0ZM0 7.22433C0 12.9205 4.07522 15.0043 8.61369 15.6993H0V32H8.28973C16.6252 32 17.5978 28.2952 17.5978 24.7757C17.5978 20.4688 14.6338 17.459 10.0495 16.3007H17.5978V0H9.30807C0.972554 0 0 3.70477 0 7.22433Z"
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    </svg>
  );
}
