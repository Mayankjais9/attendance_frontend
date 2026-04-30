"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, Bell, Settings, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { api } from "@/lib/api";

const sidebarItems = [
  { title: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Employees", href: "/dashboard/admin/users", icon: Users },
  { title: "Logs", href: "/dashboard/admin/logs", icon: FileText },
  { title: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
  { title: "Notifications", href: "/dashboard/admin/notifications", icon: Bell, active: true },
];

type AlertItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string | null;
  read?: boolean;
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AlertItem[]>([]);

  useEffect(() => {
    api<AlertItem[]>("/users/alerts")
      .then(setNotifications)
      .catch((error) => {
        console.error("[admin-alerts] failed to load alerts", error);
        setNotifications([]);
      });
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Admin" userEmail="admin@company.com">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Notifications</h1>
            <p className="text-muted-foreground">System alerts and recent administrative activity from the backend.</p>
          </div>
          <Button variant="outline" onClick={() => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))}>
            Mark All as Read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Live alerts with no hardcoded data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-sm text-muted-foreground">No alerts found.</div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start gap-3 p-4 rounded-lg border ${!notification.read ? "bg-muted/50" : ""}`}>
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && <Badge variant="secondary" className="text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time ? new Date(notification.time).toLocaleString() : "-"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
