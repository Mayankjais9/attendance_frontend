"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, FileCheck, BarChart3, Bell } from "lucide-react";
import { api } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
  { title: "Team Attendance", href: "/dashboard/manager/attendance", icon: Users },
  { title: "Approve Leaves", href: "/dashboard/manager/leaves", icon: FileCheck },
  { title: "Reports", href: "/dashboard/manager/reports", icon: BarChart3 },
  { title: "Notifications", href: "/dashboard/manager/notifications", icon: Bell, active: true },
];

type NotificationItem = {
  id: number;
  title: string;
  description?: string;
  action?: string;
  time?: string | null;
};

export default function ManagerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    api<NotificationItem[]>("/attendance/notifications/my")
      .then(setNotifications)
      .catch((error) => {
        console.error("[manager-notifications] failed to load notifications", error);
        setNotifications([]);
      });
  }, []);

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manager Notifications</h1>
          <p className="text-muted-foreground">Recent attendance and leave activity tied to your account.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Live backend activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-sm text-muted-foreground">No notifications yet.</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{item.title}</div>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.description || item.action}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.time ? new Date(item.time).toLocaleString() : "-"}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
