"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = "employee" | "manager" | "hr" | "admin";

const API = "/api"; // ✅ FIXED (proxy base)
const norm = (s: string) => (s || "").trim().toLowerCase();

const ROLE_PATHS: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  hr: "/dashboard/hr",
  manager: "/dashboard/manager",
  employee: "/dashboard/employee",
};

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log("🔥 LOGIN USING PROXY /api/auth/login");
    setError(null);
    setBusy(true);

    try {
      // 🔥 LOGIN
      const form = new URLSearchParams();
      form.set("username", email.trim().toLowerCase());
      form.set("password", password);

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form,
      });

      if (!loginRes.ok) {
        const msg = await loginRes.text().catch(() => "");
        throw new Error(msg || `Login failed: ${loginRes.status}`);
      }

      const loginData: {
        access_token: string;
        token_type?: string;
        role?: string;
        roles?: string[];
      } = await loginRes.json();

      const token = loginData.access_token;
      if (!token) throw new Error("No token returned.");

      localStorage.setItem("token", token);

      // 🔥 FETCH ROLES
      let rawRoles: string[] = [];

      if (Array.isArray(loginData.roles)) {
        rawRoles = loginData.roles;
      } else if (loginData.role) {
        rawRoles = [loginData.role];
      } else {
        const meRes = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meRes.ok) {
          const msg = await meRes.text().catch(() => "");
          throw new Error(msg || `Failed to fetch profile`);
        }

        const me = await meRes.json();
        if (Array.isArray(me.roles)) rawRoles = me.roles;
        else if (me.role) rawRoles = [me.role];
      }

      if (!rawRoles.length) throw new Error("No role found");

      // 🔥 SAVE ROLES
      const rolesLower = rawRoles.map((r) => norm(r)) as UserRole[];

      localStorage.setItem("roles", JSON.stringify(rolesLower));

      document.cookie = `roles=${encodeURIComponent(
        rolesLower.join(",")
      )}; Path=/`;
      document.cookie = `token=${encodeURIComponent(token)}; Path=/`;

      // 🔥 VALIDATE ROLE
      const selected = norm(role) as UserRole;

      if (!rolesLower.includes(selected)) {
        setError(
          `You selected "${role}", but your account has: ${rolesLower.join(", ")}`
        );
        return;
      }

      // 🔥 REDIRECT
      router.push(ROLE_PATHS[selected]);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <img src="/logo.png" alt="AttendanceHub" className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">AttendanceHub</h1>
            <p className="text-muted-foreground text-balance">
              Employee Attendance & Management System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 border border-red-200 rounded p-2 bg-red-50">
                  {error}
                </p>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}