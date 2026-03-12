// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PRIORITY = ["admin", "hr", "manager", "employee"] as const;

export default function DashboardGate() {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("roles") || "[]";
      const roles = JSON.parse(raw) as string[];

      const landing =
        PRIORITY.find((r) => roles?.includes(r)) ?? "employee";

      const map: Record<string, string> = {
        employee: "/dashboard/employee",
        manager: "/dashboard/manager",
        hr: "/dashboard/hr",
        admin: "/dashboard/admin",
      };

      router.replace(map[landing]);
    } catch {
      router.replace("/dashboard/employee");
    }
  }, [router]);

  return <div style={{ padding: 24 }}>Redirecting…</div>;
}
