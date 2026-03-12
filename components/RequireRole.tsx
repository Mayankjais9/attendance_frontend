"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Accept either "Admin" | "HR" | "Manager" | "Employee" or lowercase variants.
// Using string[] avoids TS prop/type mismatches.
type Props = { allow: string[]; children: ReactNode };

const norm = (s: string) => (s || "").trim().toLowerCase();

export default function RequireRole({ allow, children }: Props) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const rolesFromLS = (() => {
      try {
        const raw = localStorage.getItem("roles");
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    })();

    // also accept cookie roles if LS missing
    const rolesFromCookie = (() => {
      const m = document.cookie.match(/(?:^|;\s*)roles=([^;]+)/);
      if (!m) return [];
      try {
        return decodeURIComponent(m[1]).split(",").map(norm);
      } catch {
        return [];
      }
    })();

    const roles = (rolesFromLS.length ? rolesFromLS : rolesFromCookie).map(norm);
    const allowed = allow.map(norm);

    const isAllowed = roles.some(r => allowed.includes(r));
    setOk(isAllowed);

    if (!isAllowed) router.replace("/403");
  }, [allow, router]);

  if (ok === null) return null;     // avoid flash
  if (!ok) return null;
  return <>{children}</>;
}
