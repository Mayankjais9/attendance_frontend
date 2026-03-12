"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceMarking } from "@/components/attendance-marking"
import {
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart3,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react"

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
  },
  {
    title: "Approve Leaves",
    href: "/dashboard/manager/leaves",
    icon: FileCheck,
    active: true,
  },
  {
    title: "Reports",
    href: "/dashboard/manager/reports",
    icon: BarChart3,
  },
]

const leaveRequests = [
  {
    id: 1,
    employee: "Sarah Johnson",
    avatar: "/placeholder.svg",
    type: "Sick Leave",
    startDate: "2024-01-25",
    endDate: "2024-01-26",
    days: 2,
    reason: "Medical appointment and recovery",
    status: "pending",
    appliedDate: "2024-01-20",
  },
  {
    id: 2,
    employee: "Mike Chen",
    avatar: "/placeholder.svg",
    type: "Vacation",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    appliedDate: "2024-01-18",
  },
  {
    id: 3,
    employee: "Emily Davis",
    avatar: "/placeholder.svg",
    type: "Personal",
    startDate: "2024-01-30",
    endDate: "2024-01-30",
    days: 1,
    reason: "Personal matters",
    status: "pending",
    appliedDate: "2024-01-22",
  },
  {
    id: 4,
    employee: "David Wilson",
    avatar: "/placeholder.svg",
    type: "Sick Leave",
    startDate: "2024-01-28",
    endDate: "2024-01-29",
    days: 2,
    reason: "Flu symptoms",
    status: "approved",
    appliedDate: "2024-01-15",
  },
  {
    id: 5,
    employee: "John Smith",
    avatar: "/placeholder.svg",
    type: "Vacation",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    days: 3,
    reason: "Weekend getaway",
    status: "rejected",
    appliedDate: "2024-01-10",
  },
]

export default function ManagerLeavesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("pending")

  const handleLeaveAction = (leaveId: number, action: "approve" | "reject") => {
    console.log(`${action} leave request ${leaveId}`)
    // Handle leave approval/rejection logic here
  }

  const filteredRequests = leaveRequests.filter(
    (request) =>
      request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs capitalize">
        {status}
      </Badge>
    )
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "Sick Leave": "text-destructive",
      Vacation: "text-chart-1",
      Personal: "text-chart-5",
    } as const

    return colors[type as keyof typeof colors] || "text-muted-foreground"
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userName="Alex Manager"
      userEmail="alex.manager@company.com"
    >
      <div className="space-y-6">
        <AttendanceMarking userName="Alex Manager" userRole="Manager" />

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-balance">Leave Management</h1>
          <p className="text-muted-foreground">Review and approve team leave requests.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Leave requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Availability</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2</div>
              <p className="text-xs text-muted-foreground">Days to approve</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Manage team leave requests and approvals</CardDescription>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {filteredRequests
                  .filter((request) => request.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={request.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {request.employee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium">{request.employee}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className={getTypeColor(request.type)}>{request.type}</span>
                            <span>
                              {new Date(request.startDate).toLocaleDateString()} -{" "}
                              {new Date(request.endDate).toLocaleDateString()}
                            </span>
                            <span>
                              {request.days} day{request.days > 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{request.reason}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveAction(request.id, "reject")}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleLeaveAction(request.id, "approve")}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {filteredRequests
                  .filter((request) => request.status === "approved")
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={request.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {request.employee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium">{request.employee}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className={getTypeColor(request.type)}>{request.type}</span>
                            <span>
                              {new Date(request.startDate).toLocaleDateString()} -{" "}
                              {new Date(request.endDate).toLocaleDateString()}
                            </span>
                            <span>
                              {request.days} day{request.days > 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{request.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">{getStatusBadge(request.status)}</div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={request.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.employee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium">{request.employee}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className={getTypeColor(request.type)}>{request.type}</span>
                          <span>
                            {new Date(request.startDate).toLocaleDateString()} -{" "}
                            {new Date(request.endDate).toLocaleDateString()}
                          </span>
                          <span>
                            {request.days} day{request.days > 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      {request.status === "pending" && (
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLeaveAction(request.id, "reject")}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleLeaveAction(request.id, "approve")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
