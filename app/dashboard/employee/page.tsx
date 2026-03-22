"use client";

import RequireRole from "@/components/RequireRole";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { AttendanceMarking } from "@/components/attendance-marking";
import {
  LayoutDashboard,
  Clock,
  CalendarIcon,
  FileText,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard, active: true },
  { title: "My Attendance History", href: "/dashboard/employee/history", icon: Clock },
  { title: "Leave Requests", href: "/dashboard/employee/leave", icon: FileText },
  { title: "Notifications", href: "/dashboard/employee/notifications", icon: Bell },
];

const API = "/api";

type TodayResp = {
  attendance_id?: number;
  date: string;
  status: string | null; // Present | WFM | Leave | null
  checkin_time?: string | null;
  checkout_time?: string | null;
  can_mark: boolean;
};

type SummaryResp = {
  today_status: string | null;
  month_days_marked: number;
  pending_leaves: number;
  unread_notifications: number;
};

export default function EmployeeDashboard() {
  const [userName, setUserName] = useState<string>("John Doe");
  const [userEmail, setUserEmail] = useState<string>("john.doe@company.com");

  const [today, setToday] = useState<TodayResp>({ date: "", status: null, can_mark: true });
  const [summary, setSummary] = useState<SummaryResp>({
    today_status: null,
    month_days_marked: 0,
    pending_leaves: 0,
    unread_notifications: 0,
  });

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  // Fetch profile + today + summary
  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me?.full_name) setUserName(me.full_name);
        if (me?.email) setUserEmail(me.email);
      });

    fetch(`${API}/attendance/today`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: TodayResp | null) => {
        if (!data) return;
        setToday(data);
        const status = (data.status || "").toLowerCase();
        setIsCheckedIn(status === "present");
        if (data.checkin_time) setCheckInTime(new Date(data.checkin_time));
        if (data.checkout_time) setCheckOutTime(new Date(data.checkout_time));
      });

    fetch(`${API}/summary/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SummaryResp | null) => {
        if (data) setSummary(data);
      });

    fetch(`${API}/attendance/month`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((arr: { date: string; status: string }[]) => {
        const map: Record<string, string> = {};
        arr.forEach((d) => (map[d.date] = d.status.toLowerCase()));
        setAttendanceMap(map);
      });
  }, []);

  const attendancePercentage = useMemo(() => {
    const now = new Date();
    const daysSoFar = now.getDate();
    if (daysSoFar <= 0) return 0;
    const pct = Math.round((summary.month_days_marked / daysSoFar) * 100);
    return Math.max(0, Math.min(100, pct));
  }, [summary.month_days_marked]);

  // --- Clock In / Clock Out ---
  async function handleClockIn() {
    if (!today.can_mark || busy) return;
    setBusy(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Present" }),
      });
      if (!res.ok) {
        alert(await res.text());
        return;
      }
      setIsCheckedIn(true);
      setCheckInTime(new Date());
      setToday((t) => ({ ...t, status: "Present", can_mark: false }));
    } finally {
      setBusy(false);
    }
  }

  async function handleClockOut() {
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${API}/attendance/clockout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setCheckOutTime(new Date());
      setIsCheckedIn(false);
      alert("Clocked out successfully!");
    } else {
      alert(await res.text());
    }
  }

  const getAttendanceStatus = (date: Date) => {
    const d = date.toISOString().split("T")[0];
    return attendanceMap[d];
  };

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <RequireRole allow={["Employee", "Manager", "HR", "Admin"]}>
      <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
        <div className="space-y-6">
          <AttendanceMarking userName={userName} userRole="Employee" />

          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userName.split(" ")[0] || "User"}!</h1>
            <p className="text-muted-foreground">Here's your attendance overview for today.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Today's Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={isCheckedIn ? "default" : "secondary"} className="text-xs">
                    {today.status ?? "Not Marked"}
                  </Badge>
                  {checkInTime && (
                    <span className="text-sm text-muted-foreground">
                      Since {checkInTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking (Clock In + Clock Out Buttons) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Tracking</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {/* Clock In */}
                  <Button
                    onClick={handleClockIn}
                    className="w-full"
                    variant="default"
                    disabled={isCheckedIn || busy || !today.can_mark}
                  >
                    {busy ? "Clocking In..." : "Clock In"}
                  </Button>

                  {/* Clock Out */}
                  <Button
                    onClick={handleClockOut}
                    className="w-full"
                    variant="destructive"
                    disabled={!isCheckedIn || !!checkOutTime}
                  >
                    {checkOutTime ? "Clocked Out" : "Clock Out"}
                  </Button>
                </div>

                {checkInTime && !checkOutTime && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Working for{" "}
                    {Math.floor((Date.now() - checkInTime.getTime()) / (1000 * 60 * 60))}h{" "}
                    {Math.floor(((Date.now() - checkInTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Monthly Attendance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Attendance</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendancePercentage}%</div>
                <Progress value={attendancePercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {summary.month_days_marked} of {new Date().getDate()} days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Calendar + Stats */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>Your attendance record for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    present: (date) => getAttendanceStatus(date) === "present",
                    wfm: (date) => getAttendanceStatus(date) === "wfm",
                    leave: (date) => getAttendanceStatus(date) === "leave",
                  }}
                  modifiersStyles={{
                    present: { backgroundColor: "hsl(var(--chart-1))", color: "white" },
                    wfm: { backgroundColor: "hsl(var(--chart-3))", color: "white" },
                    leave: { backgroundColor: "hsl(var(--destructive))", color: "white" },
                  }}
                />
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                    <span>Work From Home</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span>Leave</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>This Month's Summary</CardTitle>
                  <CardDescription>Your attendance breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-chart-1" />
                      <span className="text-sm">Present Days</span>
                    </div>
                    <span className="font-semibold">{summary.month_days_marked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-chart-5" />
                      <span className="text-sm">Work From Home</span>
                    </div>
                    <span className="font-semibold">
                      {Object.values(attendanceMap).filter((s) => s === "wfm").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Leave Days</span>
                    </div>
                    <span className="font-semibold">
                      {Object.values(attendanceMap).filter((s) => s === "leave").length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Latest updates and reminders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">No notifications yet.</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
