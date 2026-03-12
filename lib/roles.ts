export type UserRole = "employee" | "manager" | "hr" | "admin";

// normalize anything from backend / UI
export const norm = (s: string) => (s || "").trim().toLowerCase() as UserRole;

// where to go for each role
export const roleToPath: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  hr: "/dashboard/hr",
  manager: "/dashboard/manager",
  employee: "/dashboard/employee",
};

// parse roles array from backend
export function normalizeRoles(input: unknown): UserRole[] {
  if (!Array.isArray(input)) return [];
  return input.map((r) => norm(String(r))).filter(Boolean) as UserRole[];
}

// quick membership
export function hasRole(roles: UserRole[], role: UserRole) {
  return roles.includes(role);
}
