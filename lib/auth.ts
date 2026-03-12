import { API } from "./api";

export type UserRole = "employee" | "manager" | "hr" | "admin";

export const normalizeRole = (r: string): UserRole | null => {
  const s = (r || "").trim().toLowerCase();
  if (s === "employee") return "employee";
  if (s === "manager") return "manager";
  if (s === "hr" || s === "human resources") return "hr";
  if (s === "admin" || s === "administrator") return "admin";
  return null;
};

const ROLE_PRIORITY: UserRole[] = ["admin", "hr", "manager", "employee"];

export const pickDefaultRole = (roles: UserRole[]): UserRole =>
  [...ROLE_PRIORITY].find((r) => roles.includes(r)) || "employee";

export const hasRole = (roles: UserRole[], role: UserRole) => roles.includes(role);

export const saveSession = (token: string, roles: UserRole[]) => {
  localStorage.setItem("token", token);
  localStorage.setItem("roles", JSON.stringify(roles));
  document.cookie = `roles=${encodeURIComponent(roles.join(","))}; Path=/`;
  document.cookie = `token=${encodeURIComponent(token)}; Path=/`;
};

export const loadSession = () => {
  const token = localStorage.getItem("token") || "";
  let roles: UserRole[] = [];
  try {
    roles = JSON.parse(localStorage.getItem("roles") || "[]");
  } catch {}
  return { token, roles };
};

export type Profile = { full_name?: string; email?: string };

export async function fetchProfile(): Promise<Profile | null> {
  const token = localStorage.getItem("token") || "";
  if (!token) return null;
  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
