"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Clock, FileText, Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { api } from "@/lib/api"; // ✅ using your existing API helper

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/employee", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "My Attendance History", href: "/dashboard/employee/history", icon: Clock },
  { title: "Leave Requests", href: "/dashboard/employee/leave", icon: FileText },
  { title: "Notifications", href: "/dashboard/employee/notifications", icon: Bell, active: true },
];

type NotificationItem = {
  id: number;
  title: string;
  action?: string;
  description?: string;
  type?: string; // success | warning | info
  time?: string | null;
  read?: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- fetch from backend ---
  useEffect(() => {
    api<NotificationItem[]>("/attendance/notifications/my")
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-chart-1" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-5" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userName="John Doe"
      userEmail="john.doe@company.com"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with important announcements and updates.</p>
          </div>
          <Button variant="outline" onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Your latest notifications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-sm text-muted-foreground">No notifications yet.</div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${!notification.read ? "bg-muted/50" : ""
                      }`}
                  >
                    {getNotificationIcon(notification.type || "info")}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.description || notification.action}
                      </p>
                      {notification.time && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
