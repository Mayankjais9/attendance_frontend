"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceMarking } from "@/components/attendance-marking"
import { LayoutDashboard, Users, FileCheck, BarChart3, Download, Calendar, TrendingUp, Clock } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Area, AreaChart } from "recharts"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/manager",
    icon: <LayoutDashboard className="h-4 w-4" />,
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
    active: true,
  },
]

const monthlyData = [
  { month: "Jul", attendance: 92, productivity: 88, leaves: 5 },
  { month: "Aug", attendance: 89, productivity: 85, leaves: 8 },
  { month: "Sep", attendance: 94, productivity: 91, leaves: 3 },
  { month: "Oct", attendance: 91, productivity: 89, leaves: 6 },
  { month: "Nov", attendance: 96, productivity: 93, leaves: 4 },
  { month: "Dec", attendance: 93, productivity: 90, leaves: 7 },
  { month: "Jan", attendance: 95, productivity: 92, leaves: 2 },
]

const weeklyData = [
  { week: "Week 1", present: 68, late: 5, absent: 2 },
  { week: "Week 2", present: 72, late: 2, absent: 1 },
  { week: "Week 3", present: 70, late: 4, absent: 1 },
  { week: "Week 4", present: 75, late: 0, absent: 0 },
]

const teamPerformance = [
  { name: "John Smith", attendance: 98, productivity: 95, leaves: 1 },
  { name: "Sarah Johnson", attendance: 92, productivity: 88, leaves: 3 },
  { name: "Mike Chen", attendance: 89, productivity: 91, leaves: 2 },
  { name: "Emily Davis", attendance: 94, productivity: 89, leaves: 4 },
  { name: "David Wilson", attendance: 97, productivity: 93, leaves: 1 },
]

export default function ManagerReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedTab, setSelectedTab] = useState("attendance")

  const handleExportReport = (type: string) => {
    console.log(`Exporting ${type} report`)
    // Handle report export logic here
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Team Reports</h1>
            <p className="text-muted-foreground">Analyze team performance and attendance trends.</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExportReport("full")}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">+1.8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">-3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Hours/Day</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4h</div>
              <p className="text-xs text-muted-foreground">+0.2h from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Attendance Trends</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="leaves">Leave Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Attendance Trend</CardTitle>
                  <CardDescription>Team attendance percentage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.2}
                        name="Attendance %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Breakdown</CardTitle>
                  <CardDescription>Current month weekly attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="present" fill="hsl(var(--chart-1))" name="Present" />
                      <Bar dataKey="late" fill="hsl(var(--chart-5))" name="Late" />
                      <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Productivity vs Attendance</CardTitle>
                  <CardDescription>Correlation between attendance and productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="hsl(var(--chart-1))"
                        name="Attendance %"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="productivity"
                        stroke="hsl(var(--chart-2))"
                        name="Productivity %"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Individual Performance</CardTitle>
                  <CardDescription>Team member performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamPerformance.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Attendance: {member.attendance}%</span>
                            <span>Productivity: {member.productivity}%</span>
                            <span>Leaves: {member.leaves}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${member.attendance >= 95
                                ? "bg-chart-1"
                                : member.attendance >= 90
                                  ? "bg-chart-5"
                                  : "bg-destructive"
                              }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Trends</CardTitle>
                  <CardDescription>Monthly leave requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="leaves" fill="hsl(var(--chart-3))" name="Leave Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leave Summary</CardTitle>
                  <CardDescription>Current month leave statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Total Requests</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Approved</p>
                      <p className="text-sm text-muted-foreground">Processed requests</p>
                    </div>
                    <div className="text-2xl font-bold text-chart-1">9</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pending</p>
                      <p className="text-sm text-muted-foreground">Awaiting approval</p>
                    </div>
                    <div className="text-2xl font-bold text-chart-5">3</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Avg Response Time</p>
                      <p className="text-sm text-muted-foreground">Days to process</p>
                    </div>
                    <div className="text-2xl font-bold">1.2</div>
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
