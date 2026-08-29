"use client";

import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/ui";
import { withBasePath } from "@/lib/base-path";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch(withBasePath("/api/auth/logout"), { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <CtaButton variant="ghost-wisp" size="sm" showArrow={false} onClick={() => void logout()}>
      Sign out
    </CtaButton>
  );
}
