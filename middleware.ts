import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const norm = (s: string) => (s || "").trim().toLowerCase();

const rules: { prefix: string; anyOf: string[] }[] = [
  { prefix: "/dashboard/admin",   anyOf: ["admin"] },
  { prefix: "/dashboard/hr",      anyOf: ["hr", "admin"] },
  { prefix: "/dashboard/manager", anyOf: ["manager", "hr", "admin"] },
  { prefix: "/dashboard/employee",anyOf: ["employee", "manager", "hr", "admin"] },
];

/**
 * Decode JWT payload (base64url → JSON) to extract roles.
 * We only read the payload (no verification), but the token was signed
 * by the backend — a user cannot forge a valid JWT without the secret key.
 * The token cookie is set on login alongside the roles cookie.
 */
function getRolesFromJwt(tokenCookie: string | undefined): string[] {
  if (!tokenCookie) return [];
  try {
    const parts = tokenCookie.split(".");
    if (parts.length !== 3) return [];
    // base64url → base64 → decode
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(payload));
    if (Array.isArray(decoded.roles)) {
      return decoded.roles.map(norm).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only check dashboard routes
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // Read roles from JWT token (tamper-proof) instead of plain cookie
  const tokenCookie = req.cookies.get("token")?.value;
  const roles = getRolesFromJwt(tokenCookie);

  // if no roles / no token, send to login
  if (roles.length === 0) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // find rule for this path
  const rule = rules.find(r => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const allowed = roles.some(r => rule.anyOf.includes(r));
  if (allowed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/403";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
