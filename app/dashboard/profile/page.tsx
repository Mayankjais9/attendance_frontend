"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type MeResponse } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<MeResponse | null>(null);

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then(setProfile)
      .catch((error) => {
        console.error("[profile] failed to load profile", error);
      });
  }, []);

  return (
    <DashboardLayout sidebar={<div className="p-4 text-sm text-muted-foreground">Profile</div>}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Live account details from the backend.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{profile?.full_name || "User"}</CardTitle>
            <CardDescription>{profile?.email || "-"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="outline">{(profile?.roles || []).join(", ") || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="secondary">{profile?.status || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department Id</span>
              <span>{profile?.dept_id ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User Id</span>
              <span>{profile?.user_id ?? "-"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
