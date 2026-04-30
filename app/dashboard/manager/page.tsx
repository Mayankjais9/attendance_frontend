"use client"

import { useEffect, useState } from "react"
import RequireRole from "@/components/RequireRole"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AttendanceMarking } from "@/components/attendance-marking"
import { api } from "@/lib/api"
import { LayoutDashboard, Users, FileCheck, BarChart3, CheckCircle, XCircle, Clock } from "lucide-react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard, active: true },
  { title: "Team Attendance", href: "/dashboard/manager/attendance", icon: Users },
  { title: "Approve Leaves", href: "/dashboard/manager/leaves", icon: FileCheck },
  { title: "Reports", href: "/dashboard/manager/reports", icon: BarChart3 },
]

type ManagerDashboardData = {
  team_size: number
  present_today: number
  absent_today: number
  pending_leaves: number
  avg_hours_today: string
  weekly_attendance: { name: string; present: number; wfm: number; absent: number }[]
  attendance_overview: { name: string; value: number }[]
  pending_leaves_list: {
    id: number
    employee: string
    type: string
    start_date: string
    end_date: string
    reason: string
    status: string
  }[]
  daily_checkins: {
    id: number
    employee: string
    checkIn: string | null
    checkOut: string | null
    status: string
    hours: string
  }[]
}

const initialData: ManagerDashboardData = {
  team_size: 0,
  present_today: 0,
  absent_today: 0,
  pending_leaves: 0,
  avg_hours_today: "0.0h",
  weekly_attendance: [],
  attendance_overview: [],
  pending_leaves_list: [],
  daily_checkins: [],
}

const pieColors = ["hsl(var(--chart-1))", "hsl(var(--chart-3))", "hsl(var(--destructive))"]

export default function ManagerDashboard() {
  const [userName, setUserName] = useState("Manager")
  const [userEmail, setUserEmail] = useState("manager@company.com")
  const [data, setData] = useState<ManagerDashboardData>(initialData)

  useEffect(() => {
    api<{ full_name?: string; email?: string }>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name)
        if (me.email) setUserEmail(me.email)
      })
      .catch(() => null)

    api<ManagerDashboardData>("/summary/manager-dashboard")
      .then(setData)
      .catch(() => setData(initialData))
  }, [])

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      wfm: "secondary",
      absent: "destructive",
      pending: "secondary",
    } as const

    const key = status.toLowerCase() as keyof typeof variants
    return <Badge variant={variants[key] || "outline"} className="text-xs capitalize">{status}</Badge>
  }

  return (
    <RequireRole allow={["Manager", "HR", "Admin"]}>
      <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
        <div className="space-y-6">
          <AttendanceMarking userName={userName} userRole="Manager" />

          <div>
            <h1 className="text-3xl font-bold text-balance">Team Management Dashboard</h1>
            <p className="text-muted-foreground">Live attendance, leave, and check-in data for your department.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.team_size}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.present_today}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                <FileCheck className="h-4 w-4 text-chart-5" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.pending_leaves}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.avg_hours_today}</div></CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Overview</CardTitle>
                <CardDescription>Daily team attendance from the database</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.weekly_attendance}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="present" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="wfm" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="absent" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
                <CardDescription>Current month status split</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={data.attendance_overview} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                      {data.attendance_overview.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>Open leave requests from your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.pending_leaves_list.length === 0 ? (
                <div className="text-sm text-muted-foreground">No pending leave requests.</div>
              ) : (
                data.pending_leaves_list.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{leave.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {leave.type} | {new Date(leave.start_date).toLocaleDateString()} to{" "}
                        {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{leave.reason}</p>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Check-ins</CardTitle>
              <CardDescription>Real-time attendance records from today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.daily_checkins.length === 0 ? (
                <div className="text-sm text-muted-foreground">No team attendance records found.</div>
              ) : (
                data.daily_checkins.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{employee.employee}</p>
                      <div className="text-sm text-muted-foreground">
                        In: {employee.checkIn ? new Date(employee.checkIn).toLocaleTimeString() : "-"} | Out:{" "}
                        {employee.checkOut ? new Date(employee.checkOut).toLocaleTimeString() : "-"} | Hours: {employee.hours}
                      </div>
                    </div>
                    {getStatusBadge(employee.status)}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireRole>
  )
}
