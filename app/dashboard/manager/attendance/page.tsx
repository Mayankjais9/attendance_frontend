"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { LayoutDashboard, Users, FileCheck, BarChart3, Search, Clock, CheckCircle, XCircle } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/manager",
    icon: LayoutDashboard,
  },
  {
    title: "Team Attendance",
    href: "/dashboard/manager/attendance",
    icon: Users,
    active: true,
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

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/placeholder.svg",
    checkIn: "08:45 AM",
    checkOut: "05:30 PM",
    status: "present",
    hours: "8h 45m",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    checkIn: "09:15 AM",
    checkOut: "05:45 PM",
    status: "late",
    hours: "8h 30m",
    department: "Marketing",
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "/placeholder.svg",
    checkIn: "08:30 AM",
    checkOut: "05:15 PM",
    status: "present",
    hours: "8h 45m",
    department: "Engineering",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "/placeholder.svg",
    checkIn: "-",
    checkOut: "-",
    status: "absent",
    hours: "-",
    department: "Design",
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "/placeholder.svg",
    checkIn: "08:55 AM",
    checkOut: "05:25 PM",
    status: "present",
    hours: "8h 30m",
    department: "Sales",
  },
]

const weeklyAttendance = [
  { date: "2024-01-22", present: 12, late: 2, absent: 1 },
  { date: "2024-01-23", present: 13, late: 1, absent: 1 },
  { date: "2024-01-24", present: 14, late: 0, absent: 1 },
  { date: "2024-01-25", present: 12, late: 2, absent: 1 },
  { date: "2024-01-26", present: 15, late: 0, absent: 0 },
]

export default function TeamAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      late: "secondary",
      absent: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "late":
        return <Clock className="h-4 w-4 text-chart-5" />
      case "absent":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userName="Alex Manager"
      userEmail="alex.manager@company.com"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Team Attendance</h1>
          <p className="text-muted-foreground">Monitor your team's daily attendance and working hours</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">80% of team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Clock className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">6.7% of team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">6.7% of team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4h</div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Check-ins</CardTitle>
                    <CardDescription>Real-time attendance status for your team</CardDescription>
                  </div>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Check In</p>
                          <p className="font-medium">{member.checkIn}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Check Out</p>
                          <p className="font-medium">{member.checkOut}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Hours</p>
                          <p className="font-medium">{member.hours}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(member.status)}
                          {getStatusBadge(member.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Summary</CardTitle>
                <CardDescription>Team attendance for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyAttendance.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{day.date}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-chart-1" />
                          <span>{day.present} Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-chart-5" />
                          <span>{day.late} Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span>{day.absent} Absent</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Calendar</CardTitle>
                  <CardDescription>Select a date to view attendance details</CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle>Selected Date Details</CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "No date selected"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Total Team Members</span>
                      <span className="font-bold">15</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Present</span>
                      <span className="font-bold text-chart-1">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Late</span>
                      <span className="font-bold text-chart-5">1</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Absent</span>
                      <span className="font-bold text-destructive">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
