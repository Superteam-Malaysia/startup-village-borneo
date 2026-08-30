"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroLogoProps {
  className?: string;
}

export function HeroLogo({ className = "w-[52px] h-[52px]" }: HeroLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Image
        src="/stmy-mark.svg"
        alt="Superteam Malaysia"
        width={104}
        height={102}
        className={className + " object-contain"}
        priority
      />
    </motion.div>
  );
}
