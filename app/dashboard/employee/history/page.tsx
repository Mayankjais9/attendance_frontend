"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { LayoutDashboard, Clock, FileText, Bell } from "lucide-react";
import { api } from "@/lib/api"; // ✅ use centralized API helper

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
  { title: "My Attendance History", href: "/dashboard/employee/history", icon: Clock, active: true },
  { title: "Leave Requests", href: "/dashboard/employee/leave", icon: FileText },
  { title: "Notifications", href: "/dashboard/employee/notifications", icon: Bell },
];

// ✅ Type for data fetched from backend
type AttendanceRecord = {
  date: string;
  checkin_time: string | null;
  location: string | null;
  status: string;
  reason: string | null;
};

export default function AttendanceHistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  // ✅ Fetch from backend on mount
  useEffect(() => {
    api<AttendanceRecord[]>("/attendance/history")
      .then((data) => setAttendanceHistory(data))
      .catch(() => setAttendanceHistory([]));
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      Present: "default",
      Late: "secondary",
      Absent: "destructive",
      WFM: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] ?? "secondary"} className="text-xs">
        {status}
      </Badge>
    );
  };

  // ✅ Format date/time nicely
  const formatTime = (time: string | null) => {
    if (!time) return "-";
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="John Doe" userEmail="john.doe@company.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Attendance History</h1>
          <p className="text-muted-foreground">View your complete attendance record and patterns.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* --- Attendance Table --- */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Your attendance record for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{formatTime(record.checkin_time)}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* --- Calendar --- */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Select a date to view detailed attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
