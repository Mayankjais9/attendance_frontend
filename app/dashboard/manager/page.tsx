"use client"

import RequireRole from "@/components/RequireRole"
import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Users, FileCheck, BarChart3, CheckCircle, XCircle, Clock } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import { AttendanceMarking } from "@/components/attendance-marking"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/manager",
    icon: <LayoutDashboard className="h-4 w-4" />,
    active: true,
  },
  {
    title: "Team Attendance",
    href: "/dashboard/manager/attendance",
    icon: Users,
  },
  {
    title: "Approve Leaves",
    href: "/dashboard/manager/leaves",
    icon: FileCheck,
  },
  {
    title: "Reports",
    href: "/dashboard/manager/reports",
    icon: BarChart3,
  },
]

// Mock data
const teamAttendanceData = [
  { name: "Mon", present: 12, absent: 2, late: 1 },
  { name: "Tue", present: 13, absent: 1, late: 1 },
  { name: "Wed", present: 14, absent: 1, late: 0 },
  { name: "Thu", present: 12, absent: 2, late: 1 },
  { name: "Fri", present: 15, absent: 0, late: 0 },
]

const attendanceOverview = [
  { name: "Present", value: 85, color: "hsl(var(--chart-1))" },
  { name: "Late", value: 10, color: "hsl(var(--chart-5))" },
  { name: "Absent", value: 5, color: "hsl(var(--destructive))" },
]

const pendingLeaves = [
  {
    id: 1,
    employee: "Sarah Johnson",
    avatar: "/placeholder.svg",
    type: "Sick Leave",
    dates: "Jan 25-26, 2024",
    reason: "Medical appointment and recovery",
    status: "pending",
  },
  {
    id: 2,
    employee: "Mike Chen",
    avatar: "/placeholder.svg",
    type: "Vacation",
    dates: "Feb 1-5, 2024",
    reason: "Family vacation",
    status: "pending",
  },
  {
    id: 3,
    employee: "Emily Davis",
    avatar: "/placeholder.svg",
    type: "Personal",
    dates: "Jan 30, 2024",
    reason: "Personal matters",
    status: "pending",
  },
]

const dailyCheckIns = [
  {
    id: 1,
    employee: "John Smith",
    avatar: "/placeholder.svg",
    checkIn: "08:45 AM",
    checkOut: "05:30 PM",
    status: "present",
    hours: "8h 45m",
  },
  {
    id: 2,
    employee: "Sarah Johnson",
    avatar: "/placeholder.svg",
    checkIn: "09:15 AM",
    checkOut: "05:45 PM",
    status: "late",
    hours: "8h 30m",
  },
  {
    id: 3,
    employee: "Mike Chen",
    avatar: "/placeholder.svg",
    checkIn: "08:30 AM",
    checkOut: "05:15 PM",
    status: "present",
    hours: "8h 45m",
  },
  {
    id: 4,
    employee: "Emily Davis",
    avatar: "/placeholder.svg",
    checkIn: "-",
    checkOut: "-",
    status: "absent",
    hours: "-",
  },
  {
    id: 5,
    employee: "David Wilson",
    avatar: "/placeholder.svg",
    checkIn: "08:55 AM",
    checkOut: "05:25 PM",
    status: "present",
    hours: "8h 30m",
  },
]

export default function ManagerDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const handleLeaveAction = (leaveId: number, action: "approve" | "reject") => {
    console.log(`${action} leave request ${leaveId}`)
    // Handle leave approval/rejection logic here
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      late: "secondary",
      absent: "destructive",
    } as const

    const colors = {
      present: "text-chart-1",
      late: "text-chart-5",
      absent: "text-destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <RequireRole allow={["Manager", "HR", "Admin"]}>
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userName="Alex Manager"
        userEmail="alex.manager@company.com"
      >
        <div className="space-y-6">
          <AttendanceMarking userName="Alex Manager" userRole="Manager" />

          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">Team Management Dashboard</h1>
            <p className="text-muted-foreground">Monitor your team's attendance and manage leave requests.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Active employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">80% attendance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                <FileCheck className="h-4 w-4 text-chart-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Require approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5h</div>
                <p className="text-xs text-muted-foreground">Per employee today</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Team Overview</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
              <TabsTrigger value="checkins">Daily Check-ins</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Weekly Attendance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Attendance Overview</CardTitle>
                    <CardDescription>Team attendance for this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={teamAttendanceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" fill="hsl(var(--chart-1))" name="Present" />
                        <Bar dataKey="late" fill="hsl(var(--chart-5))" name="Late" />
                        <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Attendance Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                    <CardDescription>Overall team attendance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={attendanceOverview}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {attendanceOverview.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      {attendanceOverview.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span>
                            {item.name}: {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leaves" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Leave Requests</CardTitle>
                  <CardDescription>Review and approve team leave requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingLeaves.map((leave) => (
                      <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={leave.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {leave.employee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-medium">{leave.employee}</p>
                            <p className="text-sm text-muted-foreground">
                              {leave.type} • {leave.dates}
                            </p>
                            <p className="text-xs text-muted-foreground">{leave.reason}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLeaveAction(leave.id, "reject")}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleLeaveAction(leave.id, "approve")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checkins" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Check-ins</CardTitle>
                  <CardDescription>Monitor your team's daily attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyCheckIns.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {employee.employee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-medium">{employee.employee}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>In: {employee.checkIn}</span>
                              <span>Out: {employee.checkOut}</span>
                              <span>Hours: {employee.hours}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">{getStatusBadge(employee.status)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </RequireRole>
  )
}
