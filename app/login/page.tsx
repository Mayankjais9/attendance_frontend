"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { loginUser } from "@/lib/api";
import { API } from "@/lib/api";

type UserRole = "employee" | "manager" | "hr" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      const token = data.access_token;
      localStorage.setItem("token", token);

      // Get roles from login response or fallback to /auth/me
      let rawRoles: string[] = [];
      if (Array.isArray(data.roles) && data.roles.length > 0) {
        rawRoles = data.roles;
      } else {
        const meRes = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          if (Array.isArray(me.roles)) rawRoles = me.roles;
        }
      }

      // Normalize and persist roles
      const norm = (s: string) => (s || "").trim().toLowerCase();
      const rolesLower = rawRoles.map(norm) as UserRole[];
      localStorage.setItem("roles", JSON.stringify(rolesLower));
      document.cookie = `roles=${encodeURIComponent(rolesLower.join(","))}; Path=/`;
      document.cookie = `token=${encodeURIComponent(token)}; Path=/`;

      // Validate selected role
      if (!rolesLower.includes(role)) {
        setError(`You selected "${role}", but your account has: ${rolesLower.join(", ")}.`);
        return;
      }

      const redirectPaths: Record<UserRole, string> = {
        employee: "/dashboard/employee",
        manager: "/dashboard/manager",
        hr: "/dashboard/hr",
        admin: "/dashboard/admin",
      };

      router.push(redirectPaths[role]);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (r: UserRole) => {
    const iconProps = "h-4 w-4 fill-current";
    const icons = {
      employee: <svg className={iconProps} viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      manager:  <svg className={iconProps} viewBox="0 0 24 24"><path d="M3 21h18V9l-9-7-9 7v12zM9 12h6v2H9v-2z" /></svg>,
      hr:       <svg className={iconProps} viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>,
      admin:    <svg className={iconProps} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>,
    };
    return icons[r];
  };

  const ClockIcon = () => <img src="/logo.png" alt="AttendanceHub Logo" className="h-12 w-12" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <ClockIcon />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">AttendanceHub</h1>
            <p className="text-muted-foreground text-balance">Employee Attendance & Management System</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@company.com"
                       value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password"
                       value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee"><div className="flex items-center gap-2">{getRoleIcon("employee")}Employee</div></SelectItem>
                    <SelectItem value="manager"><div className="flex items-center gap-2">{getRoleIcon("manager")}Manager</div></SelectItem>
                    <SelectItem value="hr"><div className="flex items-center gap-2">{getRoleIcon("hr")}HR</div></SelectItem>
                    <SelectItem value="admin"><div className="flex items-center gap-2">{getRoleIcon("admin")}Admin</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary hover:underline">Forgot your password?</a>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}


