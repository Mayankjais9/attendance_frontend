"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    LayoutDashboard,
    Users,
    FileText,
    Bell,
    CheckCircle,
    AlertTriangle,
    Info,
    Settings,
} from "lucide-react";

const sidebarItems = [
    {
        title: "Admin Dashboard",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Employees",
        href: "/dashboard/admin/employees",
        icon: Users,
    },
    {
        title: "Leave Approvals",
        href: "/dashboard/admin/leaves",
        icon: FileText,
    },
    {
        title: "System Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
    },
    {
        title: "Notifications",
        href: "/dashboard/admin/notifications",
        icon: Bell,
        active: true,
    },
];

const notifications = [
    {
        id: 1,
        type: "warning",
        title: "Multiple Late Check-ins",
        message: "5 employees checked in late today.",
        time: "1 hour ago",
        read: false,
    },
    {
        id: 2,
        type: "success",
        title: "Leave Request Approved",
        message: "HR approved 3 leave requests.",
        time: "3 hours ago",
        read: false,
    },
    {
        id: 3,
        type: "info",
        title: "New Employee Registered",
        message: "A new employee account has been created.",
        time: "Yesterday",
        read: true,
    },
    {
        id: 4,
        type: "warning",
        title: "Attendance System Alert",
        message: "Attendance API response time increased.",
        time: "2 days ago",
        read: true,
    },
];

export default function AdminNotificationsPage() {
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "info":
                return <Info className="h-4 w-4 text-blue-500" />;
            default:
                return <Bell className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <DashboardLayout
            sidebar={<SidebarNav items={sidebarItems} />}
            userName="Admin"
            userEmail="admin@company.com"
        >
            <div className="space-y-6 p-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Notifications</h1>
                        <p className="text-muted-foreground">
                            System alerts, employee updates, and administrative notifications.
                        </p>
                    </div>

                    <Button variant="outline">Mark All as Read</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Notifications</CardTitle>
                        <CardDescription>
                            Latest alerts and activities in the system
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-3 p-4 rounded-lg border ${!notification.read ? "bg-muted/50" : ""
                                        }`}
                                >
                                    {getNotificationIcon(notification.type)}

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
                                            {notification.message}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                </Card>

            </div>
        </DashboardLayout>
    );
}