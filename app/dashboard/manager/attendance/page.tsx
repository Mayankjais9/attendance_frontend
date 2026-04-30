"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, Users, FileCheck, BarChart3, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { api, type MeResponse } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
  { title: "Team Attendance", href: "/dashboard/manager/attendance", icon: Users, active: true },
  { title: "Approve Leaves", href: "/dashboard/manager/leaves", icon: FileCheck },
  { title: "Reports", href: "/dashboard/manager/reports", icon: BarChart3 },
];

type AttendanceRow = {
  attendance_id: number;
  user_id: number;
  employee: string;
  date: string;
  status: string;
  checkin_time: string | null;
  checkout_time?: string | null;
  reason?: string | null;
};

export default function TeamAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [userName, setUserName] = useState("Manager");
  const [userEmail, setUserEmail] = useState("manager@company.com");

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name);
        if (me.email) setUserEmail(me.email);
      })
      .catch((error) => console.error("[manager-attendance] failed to load profile", error));

    api<AttendanceRow[]>("/attendance/history?scope=team&days=30")
      .then(setRows)
      .catch((error) => {
        console.error("[manager-attendance] failed to load attendance", error);
        setRows([]);
      });
  }, []);

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          (row.employee || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.status.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [rows, searchTerm]
  );

  const todayRows = filteredRows.filter((row) => row.date === new Date().toISOString().slice(0, 10));
  const presentToday = todayRows.filter((row) => ["present", "wfm"].includes(row.status.toLowerCase())).length;
  const absentToday = todayRows.filter((row) => row.status.toLowerCase() === "absent").length;

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      wfm: "secondary",
      absent: "destructive",
    } as const;
    const normalized = status.toLowerCase() as keyof typeof variants;
    return <Badge variant={variants[normalized] || "outline"} className="text-xs capitalize">{status}</Badge>;
  };

  const formatTime = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Team Attendance</h1>
          <p className="text-muted-foreground">Live attendance history for your accessible team members.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{presentToday}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{absentToday}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Records Loaded</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{filteredRows.length}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Real backend records instead of static sample entries</CardDescription>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search team members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRows.length === 0 ? (
              <div className="text-sm text-muted-foreground">No attendance records found.</div>
            ) : (
              filteredRows.map((row) => (
                <div key={row.attendance_id} className="flex items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">{row.employee}</p>
                    <div className="text-sm text-muted-foreground">
                      {new Date(row.date).toLocaleDateString()} | In: {formatTime(row.checkin_time)} | Out: {formatTime(row.checkout_time)}
                    </div>
                    {row.reason && <p className="text-xs text-muted-foreground">{row.reason}</p>}
                  </div>
                  {getStatusBadge(row.status)}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
