"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnicornBackground } from "@/components/ui/UnicornBackground";

interface AuthShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Shared frame for /login, /register, /forgot-password, /reset-password and /pending.
 * Renders immediately -- the old inline login sat behind a 5s setTimeout, which read
 * as a broken page.
 */
export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="dark min-h-screen flex items-center justify-center px-6 py-12 relative">
      <UnicornBackground />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md"
      >
        <Link href="/">
          <Image
            src="/stmy-mark.svg"
            alt="Superteam Malaysia"
            width={128}
            height={128}
            className="h-14 w-14 object-contain"
            priority
          />
        </Link>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {footer && <div className="text-sm text-muted-foreground text-center">{footer}</div>}
      </motion.div>
    </div>
  );
}
