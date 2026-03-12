import type { UserRole } from "./roles";

export function saveSession(token: string, roles: UserRole[]) {
  localStorage.setItem("token", token);
  localStorage.setItem("roles", JSON.stringify(roles));
  // cookie for middleware (simple, non-secure; fine for dev)
  document.cookie = `roles=${encodeURIComponent(roles.join(","))}; Path=/`;
  document.cookie = `token=${encodeURIComponent(token)}; Path=/`;
}

export function readSession():
  | { token: string; roles: UserRole[] }
  | null {
  try {
    const token = localStorage.getItem("token") || "";
    const roles = JSON.parse(localStorage.getItem("roles") || "[]") as UserRole[];
    if (!token) return null;
    return { token, roles: Array.isArray(roles) ? roles : [] };
  } catch {
    return null;
  }
}
